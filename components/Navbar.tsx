"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/install-guide', label: 'Install Guide' },
  { href: '/dex', label: 'Dex' },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="w-full bg-white border-b shadow-sm mb-8">
      <div className="max-w-4xl mx-auto px-4 flex h-14 items-center gap-4">
        <div className="font-bold text-xl flex-1">Pokémon Infinite Fusion</div>
        <div className="flex gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1 rounded hover:bg-blue-100 transition-colors font-medium ${
                pathname === item.href ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 