"use client";

import { useState, useEffect } from 'react';

interface Pokemon {
  id: number;
  name: { english: string };
  type: string[];
  base?: Record<string, number>;
}

function PokemonCard({ id, name, isSelected, onClick }: { id: number; name: string; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-2 rounded-lg border transition-all w-full h-full focus:outline-none ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      }`}
    >
      <img
        src={`/sprites/base/${id}.png`}
        alt={name}
        className="w-20 h-20 object-contain mb-1"
        onError={e => (e.currentTarget as HTMLImageElement).style.display = 'none'}
      />
      <span className="text-sm font-medium text-center">{name}</span>
    </button>
  );
}

function PokemonSelectGrid({ value, onChange, label, data }: { value: number | null; onChange: (id: number) => void; label: string; data: Pokemon[] }) {
  const [search, setSearch] = useState('');
  const filtered = data.filter(p => p.name.english.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <label className="block mb-2 font-semibold">{label}</label>
      <input
        type="text"
        placeholder="Search Pokémon..."
        className="w-full p-2 border rounded mb-4"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
        {filtered.map(p => (
          <PokemonCard
            key={p.id}
            id={p.id}
            name={p.name.english}
            isSelected={value === p.id}
            onClick={() => onChange(p.id)}
          />
        ))}
        {filtered.length === 0 && <div className="col-span-full p-2 text-gray-400">No results</div>}
      </div>
    </div>
  );
}

export default function Calculator() {
  const [data, setData] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected1, setSelected1] = useState<number | null>(null);
  const [selected2, setSelected2] = useState<number | null>(null);

  useEffect(() => {
    fetch("/pokedex_with_fusion_stats.json")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const p1 = data.find(p => p.id === selected1);
  const p2 = data.find(p => p.id === selected2);
  const fusionImg = selected1 && selected2
    ? `/sprites/fusions/${selected1}-${selected2}.png`
    : null;
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    setImgError(false);
    setImgLoading(!!fusionImg);
  }, [fusionImg]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Fusion Calculator</h1>
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Fusion Result</h2>
        {p1 && p2 ? (
          <div className="flex flex-col items-center">
            <div className="flex gap-4 mb-2">
              <div className="flex flex-col items-center">
                <img src={`/sprites/base/${p1.id}.png`} alt={p1.name.english} className="w-16 h-16 object-contain bg-gray-100 rounded" />
                <div className="text-xs text-gray-500">{p1.name.english}</div>
              </div>
              <div className="flex flex-col items-center">
                <img src={`/sprites/base/${p2.id}.png`} alt={p2.name.english} className="w-16 h-16 object-contain bg-gray-100 rounded" />
                <div className="text-xs text-gray-500">{p2.name.english}</div>
              </div>
            </div>
            {imgLoading && !imgError && (
              <div className="w-48 h-48 flex items-center justify-center mb-2">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            {!imgError && fusionImg && (
              <img
                src={fusionImg}
                alt={`${p1.name.english} + ${p2.name.english} fusion`}
                className={`w-48 h-48 object-contain mb-2 border rounded bg-gray-50 ${imgLoading ? 'hidden' : ''}`}
                onLoad={() => setImgLoading(false)}
                onError={() => { setImgError(true); setImgLoading(false); }}
              />
            )}
            {imgError && (
              <div className="w-48 h-48 flex items-center justify-center bg-gray-100 border rounded mb-2 text-red-600 font-bold text-lg">
                No fusion image
              </div>
            )}
            <div className="text-lg font-bold mb-2">{p1.name.english} - {p2.name.english}</div>
            <div className="mb-2 text-gray-600">Type: {[...new Set([...(p1.type || []), ...(p2.type || [])])].join(', ')}</div>
            {p1.base && p2.base ? (
              <div className="w-full max-w-xs mx-auto">
                <h4 className="font-semibold text-sm mb-1">Base Stats (Avg)</h4>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  {(Object.keys(p1.base) as (keyof typeof p1.base)[]).map((stat) => {
                    const avg = Math.round(((p1.base?.[stat] || 0) + (p2.base?.[stat] || 0)) / 2);
                    return (
                      <li key={stat} className="flex justify-between">
                        <span className="text-gray-500">{stat}</span>
                        <span className="font-mono">{avg}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-gray-500">Select two Pokémon to see their fusion result.</div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PokemonSelectGrid value={selected1} onChange={setSelected1} label="Select First Pokémon" data={data} />
        <PokemonSelectGrid value={selected2} onChange={setSelected2} label="Select Second Pokémon" data={data} />
      </div>
    </div>
  );
} 