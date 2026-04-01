/**
 * @file app/layout.tsx
 * @description Root layout for Next.js dashboard
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crypto AI Advisor Dashboard",
  description:
    "Real-time cryptocurrency token analysis and scoring powered by AI",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <div className="min-h-screen">
          <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-cyan-400">
                  🤖 Crypto AI Advisor
                </h1>
                <nav className="text-sm text-gray-400">
                  <a href="/" className="hover:text-cyan-400 transition">
                    Dashboard
                  </a>
                </nav>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>

          <footer className="border-t border-gray-800 bg-gray-900 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
              <p>
                Crypto AI Advisor Dashboard • Powered by AI & Blockchain Data
              </p>
              <p className="text-xs mt-2">
                Disclaimer: This is for educational purposes only. Always do your
                own research before investing.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
