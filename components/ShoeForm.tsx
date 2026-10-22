'use client';

import React, { useState } from 'react';
import { ShoeSearchRequest, ShoeItem } from '../types';
import ShoeResults from './ShoeResults';

export default function ShoeForm() {
  const [footLength, setFootLength] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [favoriteBrands, setFavoriteBrands] = useState<string>('');
  const [shoeType, setShoeType] = useState<string>('');
  const [material, setMaterial] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ShoeItem[]>([]);
  const [cooldown, setCooldown] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const lengthNum = parseFloat(footLength);
    if (isNaN(lengthNum) || lengthNum < 9.0 || lengthNum > 35.0) {
      setError('Długość stopy musi być wartością od 9 cm do 35 cm.');
      return;
    }

    if (cooldown > 0) return;

    setLoading(true);

    const payload: ShoeSearchRequest = {
      foot_length_cm: lengthNum,
      budget: budget || undefined,
      favorite_brands: favoriteBrands || undefined,
      shoe_type: shoeType || undefined,
      material: material || undefined,
      color: color || undefined,
      description: description || undefined,
    };

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${backendUrl}/api/search-shoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Wystąpił błąd podczas wyszukiwania.');
      }

      if (data.success && data.results) {
        setResults(data.results);
      } else {
        setError('Nie znaleziono wyników.');
      }

      // Ustawienie cooldown 15 sekund anty-spam / ochrona przed wieloklikiem
      setCooldown(15);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err: any) {
      setError(err.message || 'Problem z połączeniem z serwerem backendu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-[#d8e8de] p-8 md:p-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#11231a] mb-2">Buty AI Helper</h1>
        <p className="text-[#355242]">Wpisz długość swojej stopy, a my znajdziemy dla Ciebie idealny model w najlepszej cenie.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pole obowiązkowe: Długość stopy */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-[#1b2d23]">
              Długość stopy w cm <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-xs text-[#2d6a4f] hover:underline font-semibold focus:outline-none"
            >
              {showTooltip ? 'Ukryj instrukcję mierzenia' : 'Jak zmierzyć stopę?'}
            </button>
          </div>

          {showTooltip && (
            <div className="mb-3 p-4 bg-[#e9f5ed] border border-[#b7e4c7] rounded-xl text-xs text-[#1b4332] leading-relaxed">
              <strong>Instrukcja mierzenia stopy:</strong> Połóż kartkę papieru na podłodze tak, aby jedna krawędź dotykała ściany. Postaw na niej stopę tak, aby pięta lekko dotykała ściany. Zaznacz na kartce ołówkiem trzymanym pionowo najdalej wysunięty punkt (palec). Zmierź linijką odległość od krawędzi kartki do zaznaczonego punktu.
            </div>
          )}

          <input
            type="number"
            step="0.1"
            min="9.0"
            max="35.0"
            required
            placeholder="np. 27.5"
            value={footLength}
            onChange={(e) => setFootLength(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#c2dccb] focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all text-[#11231a]"
          />
          <span className="text-xs text-[#52796f] mt-1 block">Wymagana wartość od 9 cm do 35 cm (obejmuje niemowlęta i dorosłych).</span>
        </div>

        {/* Pola opcjonalne strukturalne */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#1b2d23] mb-2">Budżet</label>
            <input
              type="text"
              placeholder="np. do 400 zł, tanio"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#c2dccb] focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all text-[#11231a]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1b2d23] mb-2">Ulubione marki</label>
            <input
              type="text"
              placeholder="np. Adidas, Nike, Salomon"
              value={favoriteBrands}
              onChange={(e) => setFavoriteBrands(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#c2dccb] focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all text-[#11231a]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1b2d23] mb-2">Rodzaj buta</label>
            <input
              type="text"
              placeholder="np. terenowe, biegowe, codzienne"
              value={shoeType}
              onChange={(e) => setShoeType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#c2dccb] focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all text-[#11231a]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1b2d23] mb-2">Materiał / Kolorystyka</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="np. skóra, siateczka"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#c2dccb] focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all text-[#11231a]"
              />
              <input
                type="text"
                placeholder="np. czarny, zielony"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#c2dccb] focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all text-[#11231a]"
              />
            </div>
          </div>
        </div>

        {/* Opcjonalne pole opisowe */}
        <div>
          <label className="block text-sm font-bold text-[#1b2d23] mb-2">
            Podaj inne informacje nie wymienione wyżej, które pomogą nam znaleźć dla Ciebie najlepsze buty
          </label>
          <textarea
            rows={3}
            placeholder="Wpisz dodatkowe uwagi (opcjonalnie)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#c2dccb] focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent outline-none transition-all text-[#11231a] resize-none"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Przycisk wyszukiwania */}
        <button
          type="submit"
          disabled={loading || cooldown > 0}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
            loading || cooldown > 0
              ? 'bg-[#84a98c] cursor-not-allowed'
              : 'bg-[#1b4332] hover:bg-[#2d6a4f] active:scale-[0.99]'
          }`}
        >
          {loading
            ? 'Przeszukuję internet i dopasowuję rozmiary przez AI...'
            : cooldown > 0
            ? `Odczekaj ${cooldown}s przed kolejnym wyszukiwaniem`
            : 'Znajdź najlepsze buty'}
        </button>
      </form>

      {/* Sekcja Wyników */}
      <ShoeResults items={results} />
    </div>
  );
            }
