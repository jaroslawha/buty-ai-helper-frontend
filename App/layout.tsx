import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buty AI Helper – Idealne dopasowanie obuwia',
  description: 'Inteligentny asystent zakupów obuwia dopasowany do wymiaru Twojej stopy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-[#f4f7f5] text-[#1b2d23] antialiased">
        {children}
      </body>
    </html>
  );
}
