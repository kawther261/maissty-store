import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
// ⚡ IMPORTATION DU NOUVEAU FILTRE
import { LayoutWrapper } from "../components/LayoutWrapper"; 

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

export const metadata: Metadata = {
  title: "Maissty Store | Haute Parfumerie & Maroquinerie",
  description: "Découvrez notre collection exclusive de parfums de luxe et sacs à main en Algérie.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#FDF6F3] min-h-screen flex flex-col antialiased">
        
        {/* 🪄 LE FILTRE EMBARQUÉ : Il gère l'affichage de la Navbar et du Footer tout seul */}
        <LayoutWrapper>
          {children}
        </LayoutWrapper>

      </body>
    </html>
  );
}