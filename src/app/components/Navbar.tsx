'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center px-2 py-2 text-gray-700 hover:text-purple-600"
            >
              <span className="font-bold text-xl">AI Photo</span>
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link
              href="/photo-analyzer"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${pathname === '/photo-analyzer' 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
            >
              Photo Comments
            </Link>
            <Link
              href="/image-compare"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${pathname === '/image-compare' 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
            >
              Image Compare
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 