'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react'
import { useCartStore } from "../store/useCartStore"
import { useFavoritesStore } from "../store/useFavoritesStore"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  const items = useCartStore(s => s.items) || [];
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const favCount = useFavoritesStore(s => s.favorites?.length || 0)

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/favoris', label: 'Favoris' },
    { href: '/apropos', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Top Banner */}
      <div className="bg-maisssty-text text-white text-[10px] sm:text-xs py-2 text-center font-inter tracking-widest uppercase">
        Livraison Rapide Partout en Algérie &nbsp;|&nbsp; Produits 100% Originaux &nbsp;|&nbsp; Paiement Sécurisé
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 bg-maisssty-bg/95 backdrop-blur-md ${
          scrolled ? 'shadow-rose border-b border-maisssty-border' : 'border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Mobile Hamburger Button */}
            <button 
              className="md:hidden p-2 text-maisssty-text cursor-pointer focus:outline-none" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="text-center">
                <div className="font-playfair text-xl sm:text-2xl font-bold text-maisssty-text tracking-wide uppercase leading-none">
                  Maisssty
                </div>
                <div className="text-[9px] text-gold tracking-[0.25em] uppercase mt-1">
                  Store
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-inter text-xs tracking-widest text-maisssty-text uppercase font-medium transition-colors hover:text-rose-dark relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-1 sm:gap-3 text-maisssty-text">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-rose-dark cursor-pointer">
                <Search size={19} />
              </button>

              <Link href="/favoris" className="p-2 relative hover:text-rose-dark">
                <Heart size={19} />
                {isMounted && favCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-dark text-white text-[9px] font-bold flex items-center justify-center animate-fade-in">
                    {favCount}
                  </span>
                )}
              </Link>

              <Link href="/panier" className="p-2 relative hover:text-rose-dark">
                <ShoppingBag size={19} />
                {isMounted && itemCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-maisssty-text text-white text-[9px] font-bold flex items-center justify-center animate-fade-in">
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link href="/admin" className="p-2 hover:text-gold transition-colors hidden sm:inline-block">
                <User size={19} />
              </Link>
            </div>
          </div>

          {/* Search Bar Popup */}
          {searchOpen && (
            <div className="pb-4 animate-fade-in">
              <div className="relative max-w-md mx-auto">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-maisssty-muted" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-maisssty-border outline-none font-inter text-maisssty-text focus:border-rose-medium rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="md:hidden border-t border-maisssty-border bg-maisssty-bg animate-fade-in shadow-lg">
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-sm tracking-wider text-maisssty-text uppercase font-medium hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-maisssty-border/50">
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-sm tracking-wider text-maisssty-text uppercase font-medium flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <User size={16} /> Espace Admin
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}