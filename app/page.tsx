import ShoeForm from '../components/ShoeForm';

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#e9f5ed] to-[#f4f7f5]">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <span className="bg-[#d8e8de] text-[#1b4332] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Smart Shoe Matchmaker
          </span>
        </header>

        <ShoeForm />
      </div>
    </main>
  );
}
