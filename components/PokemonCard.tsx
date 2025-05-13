import Image from 'next/image';

interface PokemonCardProps {
  id: number;
  name: string;
  imageUrl: string;
  onClick: () => void;
  isSelected?: boolean;
}

export default function PokemonCard({ id, name, imageUrl, onClick, isSelected = false }: PokemonCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg transition-all ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="aspect-square relative mb-2">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <div className="text-sm font-medium text-center">
        {name}
      </div>
    </button>
  );
} 