"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, User, X } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

export function Navbar() {
  const cartCount = useCartStore((state) => state.cartCount);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Force le rechargement propre de la page boutique avec le mot clé
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/boutique?search=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-[#F0DDD8]/60 sticky top-0 z-50 font-inter text-[#2C1810]">
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
        
        {/* LOGO */}
        <Link href="/" className="flex flex-col items-start select-none">
          <span className="font-playfair text-xl font-bold tracking-[0.2em] uppercase">Maissty</span>
          <span className="font-inter text-[9px] font-bold tracking-[0.4em] uppercase text-[#C9A96E] mt-1">Store</span>
        </Link>

        {/* NAVIGATION LINKS */}
        {!isSearchOpen && (
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.2em]">
            <Link href="/" className="hover:text-[#C9A96E] transition-colors">Accueil</Link>
            <Link href="/boutique" className="hover:text-[#C9A96E] transition-colors">Boutique</Link>
            <Link href="/favoris" className="hover:text-[#C9A96E] transition-colors">Favoris</Link>
            <Link href="/apropos" className="hover:text-[#C9A96E] transition-colors">À propos</Link>
            <Link href="/contact" className="hover:text-[#C9A96E] transition-colors">Contact</Link>
          </nav>
        )}

        {/* 🔍 BARRE DE RECHERCHE CORRIGÉE AVEC BOUTON SUBMIT */}
        {isSearchOpen && (
          <form 
            onSubmit={handleSearchSubmit} 
            className="absolute inset-x-4 md:inset-x-auto md:right-48 bg-white h-12 flex items-center border border-[#F0DDD8] px-4 rounded-full shadow-sm z-30 w-[calc(100%-2rem)] md:w-80 animate-fade-in"
          >
            <input
              type="text"
              placeholder="Rechercher un parfum, un sac..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xs text-[#2C1810]"
              autoFocus
            />
            <div className="flex items-center gap-2">
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-black">
                  <X size={14} />
                </button>
              )}
              {/* Vrai bouton cliquable obligatoire pour déclencher l'action sur mobile */}
              <button type="submit" className="text-[#2C1810] hover:text-[#C9A96E] p-1 cursor-pointer">
                <Search size={15} />
              </button>
            </div>
          </form>
        )}

        {/* ACTIONS ICONS */}
        <div className="flex items-center gap-4 text-[#2C1810]">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)} 
            className="p-1.5 hover:text-[#C9A96E] transition-colors cursor-pointer"
          >
            <Search size={18} />
          </button>

          <Link href="/favoris" className="p-1.5 hover:text-[#C9A96E] transition-colors relative">
            <Heart size={18} />
          </Link>

          <Link href="/panier" className="p-1.5 hover:text-[#C9A96E] transition-colors relative">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ⚡ SÉCURISÉ : Redirige maintenant vers l'espace client /compte */}
          <Link href="/compte" className="p-1.5 hover:text-[#C9A96E] transition-colors">
            <User size={18} />
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;