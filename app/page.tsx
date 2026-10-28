'use client';

import { useState, useEffect } from 'react';

interface ShoeResult {
  brand: string;
  model: string;
  recommended_size: string;
  insole_cm: number;
  price?: string;
  link: string;
  image_url?: string;
}

export default function Home() {
  const [footLength, setFootLength] = useState<string>('');
  const [margin, setMargin] = useState<string>('0.5');
  const [shoeType, setShoeType] = useState<string>('Sneakersy / Miejskie');
  const [preferredBrands, setPreferredBrands] = useState<string>('');
  const [material, setMaterial] = useState<string>('Dowolny');
  const [gender, setGender] = useState<string>('Uniseks');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [results, setResults] = useState<ShoeResult[]>([]);
  const [aiGreeting, setAiGreeting] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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
      setError('Długość stopy musi wynosić od 9.0 cm do 35.0 cm.');
      return;
    }

    setError(null);
    setLoading(true);
    setResults([]);
    setAiGreeting('');

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://twoj-backend.onrender.com';
    const cleanUrl = baseUrl.replace(/\/$/, '');

    const payload = {
      foot_length_cm: lengthNum,
      margin_cm: parseFloat(margin) || 0.5,
      shoe_type: shoeType,
      preferred_brands: preferredBrands.trim(),
      material: material,
      gender: gender,
      additional_info: additionalInfo.trim(),
    };

    try {
      const res = await fetch(`${cleanUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Błąd serwera: ${res.status}`);
      }

      const data = await res.json();
      setResults(data.results || []);
      setAiGreeting(data.ai_greeting || '');
      setCooldown(15);
    } catch (err: any) {
      setError('Nie udało się połączyć z serwerem. Spróbuj ponownie za chwilę.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 text-emerald-950 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-10 border border-emerald-100">
        
        {/* NAGŁÓWEK */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-2 tracking-wide uppercase">
            AI Size Matcher v1.1
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-900 tracking-tight">
            Buty AI Helper 👟
          </h1>
          <p className="text-emerald-600 mt-2 text-sm md:text-base max-w-md mx-auto">
            Wprowadź wymiary i preferencje – znajdziemy dla Ciebie 3 najlepsze oferty.
          </p>
        </div>

        {/* INSTRUKCJA POMIARU */}
        <div className="mb-8 p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 space-y-1.5 shadow-sm">
          <p className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
            <span>💡</span> Jak poprawnie zmierzyć stopę?
          </p>
          <p>1. Postaw boso stopę na kartce papieru dosuniętej do ściany.</p>
          <p>2. Zaznacz kreską najdalej wysunięty punkt (najdłuższy palec).</p>
          <p>3. Zmierz linijką odległość od brzegu kartki do kreski [cm].</p>
        </div>

        {/* FORMULARZ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800">
              1. Wymiary stopy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-emerald-900">
                  Długość stopy [cm] <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="9"
                  max="35"
                  placeholder="np. 24.5"
                  value={footLength}
                  onChange={(e) => setFootLength(e.target.value)}
                  className="w-full p-3.5 bg-white border-2 border-emerald-200 rounded-xl focus:border-emerald-600 focus:outline-none text-base shadow-sm transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-emerald-900">
                  Preferowany luz / zapas
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  className="w-full p-3.5 bg-white border-2 border-emerald-200 rounded-xl focus:border-emerald-600 focus:outline-none text-base shadow-sm transition"
                >
                  <option value="0.3">+0.3 cm (Dopasowane / Ciasne)</option>
                  <option value="0.5">+0.5 cm (Standardowe - Zalecane)</option>
                  <option value="0.8">+0.8 cm (Większy luz)</option>
                  <option value="1.0">+1.0 cm (Zimowe / Gruba skarpeta)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800">
              2. Preferencje i przeznaczenie
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-emerald-900">
                  Typ obuwia
                </label>
                <select
                  value={shoeType}
                  onChange={(e) => setShoeType(e.target.value)}
                  className="w-full p-3.5 bg-white border-2 border-emerald-200 rounded-xl focus:border-emerald-600 focus:outline-none text-base shadow-sm transition"
                >
                  <option value="Sneakersy / Miejskie">Sneakersy / Miejskie</option>
                  <option value="Sportowe / Do biegania">Sportowe / Do biegania</option>
                  <option value="Trekkingowe / Górskie">Trekkingowe / Górskie</option>
                  <option value="Eleganckie / Wizytowe">Eleganckie / Wizytowe</option>
                  <option value="Sandały / Klapki">Sandały / Klapki</option>
                  <option value="Zimowe / Ocieplane">Zimowe / Ocieplane</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-emerald-900">
                  Kategoria / Płeć
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3.5 bg-white border-2 border-emerald-200 rounded-xl focus:border-emerald-600 focus:outline-none text-base shadow-sm transition"
                >
                  <option value="Uniseks">Uniseks</option>
                  <option value="Damskie">Damskie</option>
                  <option value="Męskie">Męskie</option>
                  <option value="Dziecięce">Dziecięce</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-emerald-900">
                  Ulubione marki (opcjonalnie)
                </label>
                <input
                  type="text"
                  placeholder="np. Nike, Adidas, Salomon"
                  value={preferredBrands}
                  onChange={(e) => setPreferredBrands(e.target.value)}
                  className="w-full p-3.5 bg-white border-2 border-emerald-200 rounded-xl focus:border-emerald-600 focus:outline-none text-base shadow-sm transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-emerald-900">
                  Preferowany materiał
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full p-3.5 bg-white border-2 border-emerald-200 rounded-xl focus:border-emerald-600 focus:outline-none text-base shadow-sm transition"
                >
                  <option value="Dowolny">Dowolny materiał</option>
                  <option value="Skóra naturalna">Skóra naturalna</option>
                  <option value="Zamsz / Nubuk">Zamsz / Nubuk</option>
                  <option value="Siatka / Oddychający">Siatka / Oddychający</option>
                  <option value="Gore-Tex / Wodoodporny">Gore-Tex / Wodoodporny</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-emerald-900">
                Dodatkowe informacje / uwagi dla AI (opcjonalnie)
              </label>
              <textarea
                rows={2}
                placeholder="np. wysokie podbicie, szeroka stopa, szukam lekkich butów..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full p-3.5 bg-white border-2 border-emerald-200 rounded-xl focus:border-emerald-600 focus:outline-none text-base shadow-sm transition resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl shadow-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-300 disabled:to-teal-300 text-white font-bold text-lg py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Szukam najlepszych ofert...</span>
              </>
            ) : cooldown > 0 ? (
              <span>⏳ Odczekaj chwilę ({cooldown}s)</span>
            ) : (
              <span>✨ Znajdź dopasowane buty</span>
            )}
          </button>
        </form>

        {/* SEKACJA WYNIKÓW */}
        {results.length > 0 && (
          <div className="mt-10 space-y-6 pt-6 border-t border-emerald-100">
            
            {/* SPERSONALIZOWANE POWITANIE AI */}
            {aiGreeting && (
              <div className="p-4 bg-emerald-100/80 border border-emerald-300 rounded-2xl text-emerald-950 font-medium text-center shadow-sm text-sm md:text-base">
                🎉 {aiGreeting}
              </div>
            )}

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-emerald-900">
                Rekomendowane oferty
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                Znaleziono: {results.length}
              </span>
            </div>
            
            {/* LISTA KART / LABELEK */}
            <div className="space-y-4">
              {results.map((item, index) => (
                <div 
                  key={index} 
                  className="p-5 bg-white border-2 border-emerald-100 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-4 items-center"
                >
                  {/* MINIATURKA ZDJĘCIA */}
                  <div className="w-full sm:w-28 h-28 bg-emerald-50 rounded-xl overflow-hidden flex-shrink-0 border border-emerald-100 relative flex items-center justify-center">
                    <img 
                      src={item.image_url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"} 
                      alt={item.model}
                      className="w-full h-full object-cover"
                      onError={(e: any) => { 
                        e.target.src = "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80"; 
                      }}
                    />
                  </div>

                  {/* DANE OFERTY */}
                  <div className="flex-grow text-center sm:text-left space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        {item.brand}
                      </span>
                      {item.price && (
                        <span className="inline-block px-2.5 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 text-xs font-extrabold rounded-full self-center sm:self-auto">
                          {item.price}
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-emerald-950 text-lg leading-snug">
                      {item.model}
                    </h3>

                    <div className="pt-1 text-xs text-emerald-800 space-y-0.5">
                      <p>
                        Zalecany rozmiar: <span className="font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">EU {item.recommended_size}</span>
                      </p>
                      <p className="text-emerald-700">
                        Wkładka: <span className="font-semibold">{item.insole_cm} cm</span>
                      </p>
                    </div>
                  </div>

                  {/* PRZYCISK PRZEKIEROWANIA */}
                  <div className="w-full sm:w-auto flex-shrink-0 pt-2 sm:pt-0">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold rounded-xl transition shadow-md gap-1"
                    >
                      Sprawdź ofertę ➔
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
