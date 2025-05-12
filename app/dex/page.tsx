"use client";

import { useState } from 'react';

const mockFusions = [
  {
    id: '1-4',
    name: 'Bulbasaur + Charmander',
    img: '/fusions/1.4.png',
    left: 'Bulbasaur',
    right: 'Charmander',
    leftId: 1,
    rightId: 4,
    types: ['Grass', 'Fire'],
  },
  {
    id: '4-7',
    name: 'Charmander + Squirtle',
    img: '/fusions/4.7.png',
    left: 'Charmander',
    right: 'Squirtle',
    leftId: 4,
    rightId: 7,
    types: ['Fire', 'Water'],
  },
  {
    id: '25-1',
    name: 'Pikachu + Bulbasaur',
    img: '/fusions/25.1.png',
    left: 'Pikachu',
    right: 'Bulbasaur',
    leftId: 25,
    rightId: 1,
    types: ['Electric', 'Grass'],
  },
  {
    id: '6-9',
    name: 'Charizard + Blastoise',
    img: '/fusions/6.9.png',
    left: 'Charizard',
    right: 'Blastoise',
    leftId: 6,
    rightId: 9,
    types: ['Fire', 'Water'],
  },
  {
    id: '3-6',
    name: 'Venusaur + Charizard',
    img: '/fusions/3.6.png',
    left: 'Venusaur',
    right: 'Charizard',
    leftId: 3,
    rightId: 6,
    types: ['Grass', 'Fire'],
  },
  {
    id: '150-151',
    name: 'Mewtwo + Mew',
    img: '/fusions/150.151.png',
    left: 'Mewtwo',
    right: 'Mew',
    leftId: 150,
    rightId: 151,
    types: ['Psychic', 'Psychic'],
  },
  {
    id: '149-130',
    name: 'Dragonite + Gyarados',
    img: '/fusions/149.130.png',
    left: 'Dragonite',
    right: 'Gyarados',
    leftId: 149,
    rightId: 130,
    types: ['Dragon', 'Water'],
  },
  {
    id: '143-25',
    name: 'Snorlax + Pikachu',
    img: '/fusions/143.25.png',
    left: 'Snorlax',
    right: 'Pikachu',
    leftId: 143,
    rightId: 25,
    types: ['Normal', 'Electric'],
  },
  {
    id: '7-3',
    name: 'Squirtle + Venusaur',
    img: '/fusions/7.3.png',
    left: 'Squirtle',
    right: 'Venusaur',
    leftId: 7,
    rightId: 3,
    types: ['Water', 'Grass'],
  },
  {
    id: '9-1',
    name: 'Blastoise + Bulbasaur',
    img: '/fusions/9.1.png',
    left: 'Blastoise',
    right: 'Bulbasaur',
    leftId: 9,
    rightId: 1,
    types: ['Water', 'Grass'],
  },
];

const allTypes = Array.from(new Set(mockFusions.flatMap(f => f.types)));

export default function Dex() {
  const [search, setSearch] = useState('');
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedFusion, setSelectedFusion] = useState<typeof mockFusions[0] | null>(null);
  const filtered = mockFusions.filter(fusion =>
    (fusion.name.toLowerCase().includes(search.toLowerCase()) ||
      fusion.left.toLowerCase().includes(search.toLowerCase()) ||
      fusion.right.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter === '' || fusion.types.includes(typeFilter))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Fusion Dex</h1>
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center items-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full max-w-md p-3 border rounded shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="w-full max-w-xs p-3 border rounded shadow-sm"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          {allTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-400">No fusion found.</div>
        )}
        {filtered.map(fusion => (
          <button
            key={fusion.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow focus:outline-none"
            onClick={() => setSelectedFusion(fusion)}
          >
            {!imgErrorMap[fusion.id] ? (
              <img
                src={fusion.img}
                alt="Fusion Image"
                className="w-32 h-32 object-contain mb-2 bg-gray-50 rounded"
                onError={() => setImgErrorMap(prev => ({ ...prev, [fusion.id]: true }))}
                style={{ display: imgErrorMap[fusion.id] ? 'none' : 'block' }}
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded mb-2">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-300">
                  <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                  <path d="M4 16l4-4a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 0 2.8 0L20 10" strokeWidth="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                </svg>
              </div>
            )}
            <div className="font-bold text-lg mb-1">{fusion.name}</div>
            <div className="flex gap-2 mb-1">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{fusion.types[0]}</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">{fusion.types[1]}</span>
            </div>
            <div className="text-gray-500 text-sm">{fusion.left} + {fusion.right}</div>
          </button>
        ))}
      </div>

      {/* Modal for fusion details */}
      {selectedFusion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedFusion(null)}>
          <div
            className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setSelectedFusion(null)}
              aria-label="Close"
            >
              ×
            </button>
            {!imgErrorMap[selectedFusion.id] ? (
              <img
                src={selectedFusion.img}
                alt="Fusion Image"
                className="w-40 h-40 object-contain mb-4 bg-gray-50 rounded"
                onError={() => setImgErrorMap(prev => ({ ...prev, [selectedFusion.id]: true }))}
                style={{ display: imgErrorMap[selectedFusion.id] ? 'none' : 'block' }}
              />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded mb-4">
                <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-300">
                  <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                  <path d="M4 16l4-4a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 0 2.8 0L20 10" strokeWidth="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                </svg>
              </div>
            )}
            <div className="font-bold text-2xl mb-2">{selectedFusion.name}</div>
            <div className="flex gap-2 mb-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">{selectedFusion.types[0]}</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">{selectedFusion.types[1]}</span>
            </div>
            <div className="text-gray-500 text-base mb-4">{selectedFusion.left} + {selectedFusion.right}</div>
            <div className="flex gap-6 items-center">
              <div className="flex flex-col items-center">
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedFusion.leftId}.png`} alt={selectedFusion.left} className="w-12 h-12 mb-1" />
                <span className="text-xs text-gray-600">{selectedFusion.left}</span>
              </div>
              <span className="text-2xl font-bold text-gray-400">+</span>
              <div className="flex flex-col items-center">
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedFusion.rightId}.png`} alt={selectedFusion.right} className="w-12 h-12 mb-1" />
                <span className="text-xs text-gray-600">{selectedFusion.right}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 