'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [footLength, setFootLength] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [results, setResults] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);

  // Odliczanie cooldownu 15s
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lengthNum = parseFloat(footLength);

    if (isNaN(lengthNum) || lengthNum < 9 || lengthNum > 35) {
      setError('Wpisz długość stopy od 9 do 35 cm.');
      return;
    }

    setError(null);
    setLoading(true);
    setResults([]);

    // Wpisz poniżej w miejsce '[https://twoj-backend.onrender.com](https://twoj-backend.onrender.com)' swój adres z Rendera!
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '[https://twoj-backend.onrender.com](https://twoj-backend.onrender.com)';
    const cleanUrl = baseUrl.replace(/\/$/, ''); // Usuwa ewentualny ukośnik z końca

    try {
      const res = await fetch(`${cleanUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foot_length_cm: lengthNum }),
      });

      if (!res.ok) {
        throw new Error(`Błąd serwera: ${res.status}`);
      }

      const data = await res.json();
      setResults(data.results || []);
      setVisibleCount(5);
      setCooldown(15);
    } catch (err: any) {
      setError('Nie udało się połączyć z backendem. Serwer może się wybudzać — spróbuj ponownie za 30 sekund.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-emerald-50 text-emerald-950 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-emerald-100">
        <h1 className="text-3xl font-bold text-center text-emerald-800 mb-2">
          Buty AI Helper 👟
        </h1>
        <p className="text-center text-emerald-600 mb-6 text-sm">
          Znajdź idealny rozmiar obuwia dopasowany w milimetrach do Twojej stopy.
        </p>

        {/* FORMULARZ */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-emerald-900">
              Długość stopy (w cm):
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="9"
                max="35"
                placeholder="np. 24.5"
                value={footLength}
                onChange={(e) => setFootLength(e.target.value)}
                className="w-full p-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
                required
              />
            </div>
            <p className="text-xs text-emerald-600 mt-1">
              💡 Jak zmierzyć? Postaw stopę na kartce, obrysuj i zmierz odległość od pięty do najdłuższego palca.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-3.5 rounded-xl transition duration-200 shadow-md"
          >
            {loading ? 'Szukam ofert...' : cooldown > 0 ? `Odczekaj (${cooldown}s)` : 'Znajdź buty'}
          </button>
        </form>

        {/* WYNIKI */}
        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold text-emerald-900 border-b border-emerald-100 pb-2">
              Rekomendowane oferty:
            </h2>
            
            <div className="space-y-3">
              {results.slice(0, visibleCount).map((item, index) => (
                <div key={index} className="p-4 border border-emerald-100 bg-emerald-50/50 rounded-xl flex justify-between items-center hover:shadow-sm transition">
                  <div>
                    <h3 className="font-bold text-emerald-900">{item.brand} {item.model}</h3>
                    <p className="text-xs text-emerald-700">
                      Zalecany rozmiar: <span className="font-bold">{item.recommended_size}</span> (wkładka: {item.insole_cm} cm)
                    </p>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
                  >
                    Zobacz
                  </a>
                </div>
              ))}
            </div>

            {visibleCount < results.length && (
              <button
                onClick={() => setVisibleCount(visibleCount + 5)}
                className="w-full py-2 bg-emerald-100 text-emerald-800 font-semibold rounded-xl hover:bg-emerald-200 transition text-sm"
              >
                Pokaż kolejne 5 ofert
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
