
import React from 'react';
import { ShoeItem } from '../types';

interface ShoeCardProps {
  item: ShoeItem;
}

export default function ShoeCard({ item }: ShoeCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#d8e8de] overflow-hidden flex flex-col transition-all hover:shadow-lg hover:border-[#134e38]">
      <div className="relative h-48 bg-[#eef4f1] overflow-hidden">
        <img 
          src={item.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"} 
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback w razie niedostępności obrazka
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
          }}
        />
        <div className="absolute top-3 right-3 bg-[#134e38] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
          Dopasowanie: {item.match_score}%
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <span className="inline-block bg-[#e2eee7] text-[#134e38] text-xs font-semibold px-2.5 py-1 rounded-md mb-2">
            Sklep: {item.store}
          </span>
          <h3 className="text-lg font-bold text-[#11231a] mb-2 line-clamp-2">{item.title}</h3>
          
          <div className="space-y-1 text-sm text-[#355242] mb-4">
            <p>Rekomendowany rozmiar: <strong className="text-[#134e38]">{item.matched_size}</strong></p>
            <p>Długość wkładki: <span>{item.insole_cm}</span></p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-[#edf3f0] flex items-center justify-between mt-auto">
          <span className="text-xl font-extrabold text-[#134e38]">{item.price}</span>
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#134e38] hover:bg-[#0e3b2a] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            Przejdź do oferty
          </a>
        </div>
      </div>
    </div>
  );
}
