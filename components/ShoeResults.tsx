import React, { useState } from 'react';
import { ShoeItem } from '../types';
import ShoeCard from './ShoeCard';

interface ShoeResultsProps {
  items: ShoeItem[];
}

export default function ShoeResults({ items }: ShoeResultsProps) {
  const [visibleCount, setVisibleCount] = useState(5);

  const displayedItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-[#11231a] mb-6 text-center">
        Najlepsze dopasowania dla Ciebie
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item, index) => (
          <ShoeCard key={index} item={item} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={handleLoadMore}
            className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-medium px-8 py-3 rounded-xl transition-all shadow-md"
          >
            Załaduj kolejne 5 propozycji
          </button>
        </div>
      )}
    </div>
  );
}
