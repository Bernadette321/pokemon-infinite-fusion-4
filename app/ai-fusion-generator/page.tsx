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

      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
      
      {imageUrl && !loading && (
        <div className="flex flex-col items-center">
          <img src={imageUrl} alt="AI Fusion Result" className="w-64 h-64 object-contain rounded shadow mb-2" />
          <div className="text-gray-500 text-sm mb-3">Generated with recraft-ai/recraft-v3</div>
          
          {/* Download button */}
          <a 
            href={imageUrl}
            download="pokemon-fusion.png"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
          >
            ⬇️ Download Image
          </a>
          
          {/* Social sharing buttons */}
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href={`https://twitter.com/intent/tweet?text=Check out my AI Pokémon fusion!&url=${imageUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              🐦 Share on Twitter
            </a>

            <a
              href={`https://www.reddit.com/submit?url=${imageUrl}&title=My AI Pokémon fusion`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              🧡 Share on Reddit
            </a>

            <a
              href={`https://t.me/share/url?url=${imageUrl}&text=Look at this Pokémon fusion!`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              📬 Share on Telegram
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(imageUrl);
                alert('Image link copied!');
              }}
              className="text-gray-600 hover:underline"
            >
              📋 Copy image link
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 