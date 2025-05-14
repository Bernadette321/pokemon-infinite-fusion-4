"use client";
import { useState, useEffect, useRef } from "react";
import Select from 'react-select';

interface Pokemon {
  id: number;
  name: {
    english: string;
  };
}

interface StyleOption {
  value: string;
  label: string;
}

const MIN_FAST_PROGRESS_DURATION = 2000; // Ensure 0-50% takes at least this long
const POLLING_INTERVAL_MS = 2500; // Slightly increased polling interval
const MAX_POLL_FAILURES = 4; // Give up after this many consecutive poll failures

export default function AIFusionGenerator() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [headPokemon, setHeadPokemon] = useState<{ value: number; label: string } | null>(null);
  const [bodyPokemon, setBodyPokemon] = useState<{ value: number; label: string } | null>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>({ value: "default", label: "Default Style (recraft-ai/recraft-v3)" });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isImageComponentLoading, setIsImageComponentLoading] = useState(false);
  const [error, setError] = useState("");
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(null);

  const pollFailureCount = useRef(0); // Ref to track consecutive poll failures

  // Using recraft-ai/recraft-v3 model by default
  const styleOptions: StyleOption[] = [
    { value: "default", label: "Default Style (recraft-ai/recraft-v3)" } 
  ];

  useEffect(() => {
    fetch('/pokedex_with_fusion_stats.json')
      .then(res => res.json())
      .then(data => setPokemonList(data));
  }, []);

  // Progress Animation Effect
  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    if (loading && progress < 100) { 
      if (progress < 50) {
        // Smoother 0-50% phase
        const increment = 1; // Smaller increment for smoother animation
        const interval = MIN_FAST_PROGRESS_DURATION / (50 / increment); // e.g., 2000ms / 50 = 40ms
        progressTimer = setTimeout(() => {
          setProgress(prev => Math.min(prev + increment, 50)); 
        }, interval);
      } else if (progress >= 50 && progress < 95 && loading) { 
        // Slow phase from 50% to 95%
        progressTimer = setTimeout(() => {
          if(loading) setProgress(prev => Math.min(prev + 1, 95)); 
        }, 400); 
      }
    }
    return () => clearTimeout(progressTimer);
  }, [loading, progress]);

  // Polling Effect
  useEffect(() => {
    if (!predictionId || !loading) {
      pollFailureCount.current = 0; // Reset failure count if not polling
      return;
    }

    const pollIntervalId = setInterval(async () => {
      try {
        const response = await fetch(`/api/ai-fusion/status?predictionId=${predictionId}`);
        
        if (!response.ok) {
          pollFailureCount.current++;
          const errorText = await response.text();
          console.warn(`Poll attempt ${pollFailureCount.current}/${MAX_POLL_FAILURES} failed for ${predictionId}: ${response.status} - ${errorText}`);

          if (pollFailureCount.current >= MAX_POLL_FAILURES) {
            setError(`Failed to get prediction status after ${MAX_POLL_FAILURES} attempts. Last error: ${response.status}`);
            setLoading(false);
            setProgress(0);
            setIsImageComponentLoading(false); // Ensure image loading stops on poll failure
            clearInterval(pollIntervalId);
          }
          return; // Allow retry up to MAX_POLL_FAILURES
        }

        pollFailureCount.current = 0; // Reset failure count on a successful poll response (even if still processing)
        const data = await response.json();
        
        if (data.status === 'succeeded') {
          setProgress(100); // Set progress to 100 immediately
          
          // Short delay to ensure 100% progress is rendered before showing image
          setTimeout(() => {
            if (typeof data.output === 'string') {
              setImageUrl(data.output);
            } else if (Array.isArray(data.output) && typeof data.output[0] === 'string') {
              setImageUrl(data.output[0]); 
            } else {
              console.error("Unexpected output format from Replicate:", data.output);
              setError('Failed to parse image URL from generation results.');
              // If output is bad, we still want to stop loading but not show an image
            }
            setLoading(false); // Now stop loading and show image (if URL is valid)
            clearInterval(pollIntervalId);
          }, 100); // 100ms delay, can be adjusted

        } else if (data.status === 'failed') {
          setError(data.error?.detail || data.error || 'Image generation failed. Please try again.');
          setLoading(false);
          setProgress(0);
          setIsImageComponentLoading(false); // Ensure image loading stops on API failure
          clearInterval(pollIntervalId);
        } else if (data.status === 'processing' || data.status === 'starting') {
          // Still working, progress animation useEffect will handle visual progress
        } else {
          console.warn(`Unknown prediction status for ${predictionId}: ${data.status}`);
          // Potentially treat as a soft failure for retry counting?
        }
      } catch (error) { 
        pollFailureCount.current++;
        console.warn(`Poll attempt ${pollFailureCount.current}/${MAX_POLL_FAILURES} (Network/JSON error) for ${predictionId}:`, error);
        if (pollFailureCount.current >= MAX_POLL_FAILURES) {
          setError('Network error while checking status after multiple retries.');
          setLoading(false);
          setProgress(0);
          setIsImageComponentLoading(false);
          clearInterval(pollIntervalId);
        }
        // Allow retry up to MAX_POLL_FAILURES
      }
    }, POLLING_INTERVAL_MS);

    return () => {
      clearInterval(pollIntervalId);
      pollFailureCount.current = 0; // Reset on cleanup
    };
  // Removed generationStartTime from here, error handling is now based on consecutive failures
  }, [predictionId, loading, setError, setImageUrl, setLoading, setProgress]); 

  // Effect to handle the start of image component loading when imageUrl is set/reset
  useEffect(() => {
    if (imageUrl) {
      setIsImageComponentLoading(true); 
      // setError(""); // Consider if you want to clear general errors here or specifically image load errors
    } else {
      setIsImageComponentLoading(false); // Reset if imageUrl is cleared
    }
  }, [imageUrl]);

  async function handleGenerate() {
    if (!headPokemon || !bodyPokemon) {
      setError("Please select both Pokémon");
      return;
    }

    setError(""); 
    setImageUrl(null);
    setPredictionId(null);
    setProgress(0); 
    pollFailureCount.current = 0; // Reset poll failure counter
    setGenerationStartTime(Date.now()); 
    setLoading(true); 

    try {
      const response = await fetch('/api/ai-fusion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headId: headPokemon.value,
          bodyId: bodyPokemon.value,
          prompt
        }),
      });

      const data = await response.json(); 
      
      if (!response.ok) {
        const errorDetail = data.error?.detail || data.error || data.message || response.statusText || "Failed to start generation.";
        console.error("Error from /api/ai-fusion initial call:", errorDetail, data);
        setError(errorDetail);
        setLoading(false);
        setProgress(0); // Ensure progress is 0 on initial failure
        // setGenerationStartTime(null); // Not strictly needed to nullify here
        return;
      }
      
      if (data.predictionId) {
        setPredictionId(data.predictionId);
        // setProgress(1); // Let the animation useEffect handle the initial jump from 0
      } else {
        console.error("No predictionId in successful response from /api/ai-fusion", data);
        setError(data.error?.detail || data.error || 'Failed to get prediction ID from server.');
        setLoading(false);
        setProgress(0);
      }

    } catch (e) {
      console.error("Fetch/network error calling /api/ai-fusion:", e);
      setError("Failed to communicate with generation API. Please try again.");
      setLoading(false);
      setProgress(0);
    }
  }

  async function handleDownload() {
    if (!imageUrl) return;

    const confirmed = window.confirm(
      "Image generated by AI, not for commercial use.\n" +
      "The image link from Replicate is temporary (typically 24 hours to 7 days) and is suitable for sharing and downloading now.\n\n" +
      "The image will be downloaded in PNG format.\n\n" +
      "Proceed with download?"
    );

    if (confirmed) {
      try {
        setError(''); // Clear previous errors

        // Fetch the original image
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        const originalBlob = await response.blob();

        // Create an Image element to load the blob so we can get its dimensions and draw it
        const img = document.createElement('img');
        const imgLoadPromise = new Promise<void>((resolve, reject) => {
          img.onload = () => {
            URL.revokeObjectURL(img.src); // Clean up the object URL for the source image
            resolve();
          };
          img.onerror = () => {
            URL.revokeObjectURL(img.src); // Clean up
            reject(new Error('Failed to load image for conversion.'));
          };
        });
        img.src = URL.createObjectURL(originalBlob);
        await imgLoadPromise;

        // Create a canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not get canvas context.');
        }

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

        // Get the PNG blob from the canvas
        const pngBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/png');
        });

        if (!pngBlob) {
          throw new Error('Failed to convert image to PNG. This can happen due to CORS issues if the image is from a different origin without proper headers, or if the image is too large.');
        }

        const objectUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement('a');
        link.href = objectUrl;

        // Determine base filename from imageUrl, then append .png
        let baseFilename = "pokemon-fusion";
        try {
          const url = new URL(imageUrl);
          const pathnameParts = url.pathname.split('/');
          const lastPart = pathnameParts[pathnameParts.length - 1];
          if (lastPart) {
            // Remove common image extensions to get a base name more reliably
            const nameWithoutExt = lastPart.replace(/\.(png|jpg|jpeg|webp|gif|svg)$/i, "");
            if (nameWithoutExt) {
                baseFilename = nameWithoutExt;
            }
          }
        } catch (e) {
          console.warn("Could not parse base filename from URL, using default.", e);
        }
        link.download = `${baseFilename}.png`; // Ensure .png extension

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl); // Clean up the object URL for the PNG blob

      } catch (err: any) {
        console.error("Download and conversion failed:", err);
        setError("Download failed or could not convert to PNG. You can also try right-clicking the original image and selecting 'Save Image As...'. Error: " + err.message);
      }
    }
  }

  const pokemonOptions = pokemonList.map(pokemon => ({
    value: pokemon.id,
    label: `${pokemon.name.english} (#${pokemon.id})`
  }));

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Pokémon Fusion Generator</h1>
      <p className="text-center mb-6">Using recraft-ai/recraft-v3 model to create unique fusions</p>
      
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Head Pokémon</label>
        <Select
          options={pokemonOptions}
          value={headPokemon}
          onChange={setHeadPokemon}
          placeholder="Select head Pokémon..."
          className="text-black"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Body Pokémon</label>
        <Select
          options={pokemonOptions}
          value={bodyPokemon}
          onChange={setBodyPokemon}
          placeholder="Select body Pokémon..."
          className="text-black"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Custom Prompt (optional)</label>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          className="w-full p-2 border rounded text-black"
          placeholder="Add additional details (e.g. 'in a vibrant, mystical forest')"
        />
      </div>

      <button
        onClick={handleGenerate}
        className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition mb-4 disabled:bg-gray-400"
        disabled={loading || !headPokemon || !bodyPokemon}
      >
        {loading ? `Generating... (${progress.toFixed(0)}%)` : "Generate Fusion Image"}
      </button>

      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-width duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {error && <div className="text-red-600 mb-4 text-center py-2 px-3 border border-red-400 bg-red-100 rounded">{error}</div>}
      
      {imageUrl && (
        <div className="flex flex-col items-center mt-4">
          <div className="w-64 h-64 mb-3 relative flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden bg-gray-100 shadow">
            {isImageComponentLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10 p-4">
                <svg className="animate-spin h-10 w-10 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-gray-700 font-medium text-center">The image has been generated and is loading. Please wait.</p>
              </div>
            )}
            <img
              src={imageUrl}
              alt={error && !loading && !isImageComponentLoading ? "Image failed to load" : "AI Fusion Result"}
              className={`object-contain w-full h-full transition-opacity duration-300 ease-in-out ${isImageComponentLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => {
                setIsImageComponentLoading(false);
              }}
              onError={() => {
                setIsImageComponentLoading(false);
                if (!error || error === 'Failed to parse image URL from generation results.') {
                   setError("Failed to load the generated image. The link might be invalid, expired, or a network issue occurred. Please try generating again.");
                }
              }}
            />
          </div>

          {!isImageComponentLoading && imageUrl && (
            <>
              <div className="text-gray-500 text-sm mb-1">Generated with recraft-ai/recraft-v3</div>
              <div className="text-xs text-gray-400 mb-3">Image generated by AI, not for commercial use.</div>
              
              <button
                onClick={handleDownload}
                className="mb-3 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition w-full sm:w-auto"
              >
                ⬇️ Download Image
              </button>
              
              <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
                <a
                  href={`https://twitter.com/intent/tweet?text=Check out my AI Pokémon fusion!&url=${imageUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-sky-500 text-white font-medium rounded hover:bg-sky-600 transition no-underline"
                >
                  🐦 Share on Twitter
                </a>

                <a
                  href={`https://www.reddit.com/submit?url=${imageUrl}&title=My AI Pokémon fusion`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition no-underline"
                >
                  🧡 Share on Reddit
                </a>

                <a
                  href={`https://t.me/share/url?url=${imageUrl}&text=Look at this Pokémon fusion!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-cyan-500 text-white font-medium rounded hover:bg-cyan-600 transition no-underline"
                >
                  📬 Share on Telegram
                </a>

                <button
                  onClick={() => {
                    if(imageUrl) navigator.clipboard.writeText(imageUrl);
                    alert('Image link copied!');
                  }}
                  className="px-3 py-1.5 bg-gray-500 text-white font-medium rounded hover:bg-gray-600 transition"
                >
                  📋 Copy image link
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 