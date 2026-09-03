'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react'
import { useCartStore } from "../store/useCartStore"
import { useFavoritesStore } from "../store/useFavoritesStore"
import { CartDrawer } from "./CartDrawer"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  const items = useCartStore(s => s.items) || []
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0)
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
      {/* Top Announcement Bar */}
      <div className="bg-maisssty-text text-white text-[10px] sm:text-xs py-2 px-2 text-center font-inter tracking-widest uppercase">
        Livraison Rapide Partout en Algérie &nbsp;|&nbsp; Produits 100% Originaux
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-maisssty-bg/95 backdrop-blur-md border-b ${
          scrolled ? 'shadow-md border-maisssty-border' : 'border-maisssty-border/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Left: Mobile Menu Toggle Button */}
            <button 
              type="button"
              className="md:hidden p-1.5 text-maisssty-text cursor-pointer focus:outline-none" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Center/Left: Brand Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="text-left sm:text-center">
                <div className="font-playfair text-lg sm:text-2xl font-bold text-maisssty-text tracking-wide uppercase leading-none">
                  Maisssty
                </div>
                <div className="text-[8px] sm:text-[9px] text-gold tracking-[0.25em] uppercase mt-0.5">
                  Store
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
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

            {/* Right: Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2 text-maisssty-text">
              <button 
                onClick={() => setSearchOpen(!searchOpen)} 
                className="p-1.5 hover:text-rose-dark cursor-pointer"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              <Link href="/favoris" className="p-1.5 relative hover:text-rose-dark">
                <Heart size={18} />
                {isMounted && favCount > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-rose-dark text-white text-[8px] font-bold flex items-center justify-center">
                    {favCount}
                  </span>
                )}
              </Link>

              {/* Cart Button Opens Side Drawer directly */}
              <button 
                onClick={() => setCartDrawerOpen(true)} 
                className="p-1.5 relative hover:text-rose-dark cursor-pointer"
                aria-label="Open Cart"
              >
                <ShoppingBag size={18} />
                {isMounted && itemCount > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-maisssty-text text-white text-[8px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              <Link href="/admin" className="p-1.5 hover:text-gold transition-colors hidden sm:inline-block">
                <User size={18} />
              </Link>
            </div>
          </div>

          {/* Search Bar Input Container */}
          {searchOpen && (
            <div className="pb-3 animate-fade-in px-2">
              <div className="relative max-w-md mx-auto">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-maisssty-muted" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-maisssty-border outline-none font-inter text-maisssty-text focus:border-rose-medium rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-maisssty-border/60 bg-maisssty-bg animate-fade-in shadow-lg">
            <div className="px-6 py-5 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-xs tracking-widest text-maisssty-text uppercase font-medium hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-maisssty-border/40">
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-xs tracking-widest text-maisssty-text uppercase font-medium flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <User size={15} /> Espace Admin
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  )
}