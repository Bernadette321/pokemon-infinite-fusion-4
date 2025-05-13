import Image from 'next/image';
import { useState } from 'react';

interface FusionImageProps {
  id1: number;
  id2: number;
  name1: string;
  name2: string;
}

export default function FusionImage({ id1, id2, name1, name2 }: FusionImageProps) {
  const [error, setError] = useState(false);
  const fusionUrl = `/fusions/${id1}.${id2}.png`;

  return (
    <div className="flex flex-col items-center">
      {!error ? (
        <Image
          src={fusionUrl}
          alt={`${name1} + ${name2} fusion`}
          width={256}
          height={256}
          className="object-contain border rounded bg-white"
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-64 h-64 flex items-center justify-center bg-gray-100 border rounded">
          <span className="text-gray-400">No fusion image found</span>
        </div>
      )}
      <div className="mt-2 text-lg font-bold text-center">{name1} + {name2}</div>
    </div>
  );
} 