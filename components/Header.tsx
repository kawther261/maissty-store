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

  // Safe Store Reads
  const rawItems = useCartStore(s => s?.items)
  const items = Array.isArray(rawItems) ? rawItems : []
  const itemCount = items.reduce((sum, item) => sum + (item?.quantity || 1), 0)

  const rawFavs = useFavoritesStore(s => s?.favorites)
  const favCount = Array.isArray(rawFavs) ? rawFavs.length : 0

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
      <div className="bg-[#2C1810] text-white text-[10px] sm:text-xs py-2 px-2 text-center font-inter tracking-widest uppercase">
        Livraison Rapide Partout en Algérie &nbsp;|&nbsp; Produits 100% Originaux
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-[#FDF6F3]/95 backdrop-blur-md border-b ${
          scrolled ? 'shadow-md border-[#F0DDD8]' : 'border-[#F0DDD8]/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Mobile Menu Toggle */}
            <button 
              type="button"
              className="md:hidden p-2 text-[#2C1810] cursor-pointer focus:outline-none" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="text-left sm:text-center">
                <div className="font-playfair text-lg sm:text-2xl font-bold text-[#2C1810] tracking-wide uppercase leading-none">
                  Maisssty
                </div>
                <div className="text-[8px] sm:text-[9px] text-[#8B6860] tracking-[0.25em] uppercase mt-0.5">
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
                  className="font-inter text-xs tracking-widest text-[#2C1810] uppercase font-medium transition-colors hover:text-[#8B6860] relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B6860] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Header Right Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2 text-[#2C1810]">
              <button 
                onClick={() => setSearchOpen(!searchOpen)} 
                className="p-1.5 hover:text-[#8B6860] cursor-pointer"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              <Link href="/favoris" className="p-1.5 relative hover:text-[#8B6860]">
                <Heart size={18} />
                {isMounted && favCount > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {favCount}
                  </span>
                )}
              </Link>

              <button 
                onClick={() => setCartDrawerOpen(true)} 
                className="p-1.5 relative hover:text-[#8B6860] cursor-pointer"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {isMounted && itemCount > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#2C1810] text-white text-[8px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              <Link href="/admin" className="p-1.5 hover:text-[#8B6860] transition-colors hidden sm:inline-block">
                <User size={18} />
              </Link>
            </div>
          </div>

          {searchOpen && (
            <div className="pb-3 px-2">
              <div className="relative max-w-md mx-auto">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#F0DDD8] outline-none font-inter text-[#2C1810] focus:border-[#8B6860] rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#F0DDD8] bg-[#FDF6F3] shadow-lg">
            <div className="px-6 py-5 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-xs tracking-widest text-[#2C1810] uppercase font-medium hover:text-[#8B6860] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-[#F0DDD8]">
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-xs tracking-widest text-[#2C1810] uppercase font-medium flex items-center gap-2 hover:text-[#8B6860] transition-colors"
                >
                  <User size={15} /> Espace Admin
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  )
}