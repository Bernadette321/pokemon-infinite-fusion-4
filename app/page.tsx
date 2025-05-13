"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Fusion Calculator",
      description: "Calculate fusion results between any two Pokémon and discover their combined stats and abilities.",
      bgColor: "from-red-400 to-red-600",
      link: "/calculator",
      buttonText: "Start Fusing"
    },
    {
      title: "Installation Guide",
      description: "Learn how to install and play the game with our comprehensive guide.",
      bgColor: "from-yellow-400 to-yellow-600",
      link: "/install-guide",
      buttonText: "View Guide"
    },
    {
      title: "Pokédex",
      description: "Browse through all available Pokémon fusions and find your perfect combination.",
      bgColor: "from-green-400 to-green-600", 
      link: "/dex",
      buttonText: "Open Pokédex"
    },
    {
      title: "AI Fusion Generator",
      description: "Generate unique Pokémon fusions using AI technology and explore endless possibilities.",
      bgColor: "from-purple-400 to-purple-600",
      link: "/ai-fusion-generator",
      buttonText: "Generate Fusions"
    }
  ];

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner Carousel */}
      <div className={`relative h-[60vh] bg-gradient-to-r ${slides[currentSlide].bgColor} transition-colors duration-700`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            Pokémon Infinite Fusion
          </h1>
          <h2 className="text-3xl font-bold mb-2 text-center">
            {slides[currentSlide].title}
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">
            {slides[currentSlide].description}
          </p>
          <Link 
            href={slides[currentSlide].link} 
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            {slides[currentSlide].buttonText}
          </Link>
          
          {/* Carousel Navigation Dots */}
          <div className="flex space-x-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? 'bg-white' : 'bg-white/50'
                } transition-all duration-200`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Explore the World of Pokémon Fusion</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <Link href="/calculator" className="group">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                <svg 
                  className="w-24 h-24 text-white group-hover:scale-110 transition-transform" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="8" y1="6" x2="16" y2="6" />
                  <line x1="8" y1="10" x2="16" y2="10" />
                  <line x1="8" y1="14" x2="16" y2="14" />
                  <line x1="8" y1="18" x2="16" y2="18" />
                </svg>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-semibold mb-2">Fusion Calculator</h3>
                <p className="text-gray-600">Calculate fusion results between any two Pokémon and discover their combined stats and abilities.</p>
              </div>
            </div>
          </Link>

          <Link href="/install-guide" className="group">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <svg 
                  className="w-24 h-24 text-white group-hover:scale-110 transition-transform" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-semibold mb-2">Installation Guide</h3>
                <p className="text-gray-600">Learn how to install and play the game with our comprehensive guide.</p>
              </div>
            </div>
          </Link>

          <Link href="/dex" className="group">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <svg 
                  className="w-24 h-24 text-white group-hover:scale-110 transition-transform" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-semibold mb-2">Pokédex</h3>
                <p className="text-gray-600">Browse through all available Pokémon fusions and find your perfect combination.</p>
              </div>
            </div>
          </Link>

          <Link href="/ai-fusion-generator" className="group">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <svg 
                  className="w-24 h-24 text-white group-hover:scale-110 transition-transform" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-semibold mb-2">AI Fusion Generator</h3>
                <p className="text-gray-600">Generate unique Pokémon fusions using AI technology and explore endless possibilities.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 