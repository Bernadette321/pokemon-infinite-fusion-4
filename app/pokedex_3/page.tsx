"use client";
import { useEffect, useState } from "react";

interface Pokemon {
  id: number;
  name: { english: string };
  type: string[];
  fusionStats?: {
    headProgress: number;
    bodyProgress: number;
    totalFusions: number;
    maxFusions: number;
  };
}

export default function Pokedex3() {
  const [data, setData] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [headId, setHeadId] = useState<number | null>(null);
  const [bodyId, setBodyId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/pokedex_with_fusion_stats.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const filtered = data.filter((p) =>
    p.name.english.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pokedex 3</h1>
      <input
        type="text"
        placeholder="Search Pokémon by name..."
        className="w-full p-3 mb-6 border rounded shadow-sm"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <ul className="space-y-2">
        {filtered.slice(0, 30).map((p) => (
          <li
            key={p.id}
            className="p-3 bg-white rounded shadow flex items-center gap-4 cursor-pointer hover:bg-blue-50 transition"
            onClick={() => setSelected(p)}
          >
            <img
              src={`/sprites/base/${p.id}.png`}
              alt={p.name.english}
              className="w-12 h-12 object-contain bg-gray-100 rounded"
              onError={e => (e.currentTarget as HTMLImageElement).style.display = 'none'}
            />
            <span className="font-mono text-gray-500">#{p.id}</span>
            <span className="font-bold">{p.name.english}</span>
            <span className="text-sm text-gray-400">({p.type.join(", ")})</span>
            {p.fusionStats && (
              <div className="ml-auto flex gap-4">
                <div className="text-sm">
                  <div>Head: {p.fusionStats.headProgress}%</div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${p.fusionStats.headProgress}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm">
                  <div>Body: {p.fusionStats.bodyProgress}%</div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${p.fusionStats.bodyProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
        {filtered.length === 0 && <li className="text-gray-400">No Pokémon found.</li>}
      </ul>

      {/* Modal for details */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">{selected.name.english}</h2>
            <div className="mb-2 text-gray-500">Type: {selected.type.join(", ")}</div>
            {/* Fusion Stats */}
            {selected.fusionStats && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Fusion Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm mb-1">Head Progress: {selected.fusionStats.headProgress}%</div>
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${selected.fusionStats.headProgress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selected.fusionStats.totalFusions}/{selected.fusionStats.maxFusions} fusions
                    </div>
                  </div>
                  <div>
                    <div className="text-sm mb-1">Body Progress: {selected.fusionStats.bodyProgress}%</div>
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${selected.fusionStats.bodyProgress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selected.fusionStats.totalFusions}/{selected.fusionStats.maxFusions} fusions
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Fusion Preview */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Fusion Preview</h3>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Head Pokémon</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={headId ?? selected.id}
                    onChange={e => setHeadId(Number(e.target.value))}
                  >
                    {data.map(p => (
                      <option key={p.id} value={p.id}>{p.name.english}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Body Pokémon</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={bodyId ?? selected.id}
                    onChange={e => setBodyId(Number(e.target.value))}
                  >
                    {data.map(p => (
                      <option key={p.id} value={p.id}>{p.name.english}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-center">
                {(headId ?? selected.id) !== (bodyId ?? selected.id) ? (
                  <img
                    src={`/sprites/fusions/${headId ?? selected.id}-${bodyId ?? selected.id}.png`}
                    alt="Fusion Preview"
                    className="w-32 h-32 object-contain bg-gray-100 rounded"
                    onError={e => (e.currentTarget as HTMLImageElement).style.display = 'none'}
                  />
                ) : (
                  <div className="text-gray-400 text-center py-8">请选择不同的头部和身体宝可梦</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 