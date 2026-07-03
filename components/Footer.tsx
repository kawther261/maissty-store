"use client";
import Link from "next/link";
import { Phone, Mail, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✨ Merci pour votre inscription ! Vous recevrez bientôt nos nouveautés exclusives.");
  };

  return (
    // 🎨 COULEUR CHIRURGICALE : Fixée sur le code #E5D4CD prélevé directement sur la maquette image_91d4dd.jpg
    <footer className="bg-[#E5D4CD] text-[#2C1810] font-inter border-t border-[#F0DDD8]">
      
   

      {/* 2. LIENS DE NAVIGATION ET CONTACTS */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 text-xs">
        
        {/* Colonne 1 : À propos de la marque */}
        <div className="md:col-span-4 space-y-4">
          <h2 className="font-playfair text-lg font-bold tracking-widest uppercase">
            Maissty Store
          </h2>
          <p className="text-[#8B6860] leading-relaxed max-w-sm">
            Parfums, sacs et produits de maquillage 100% originaux sélectionnés avec le plus grand soin pour l&apos;élégance des femmes en Algérie.
          </p>
          
        </div>

        {/* Colonne 2 : Navigation */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="font-playfair font-bold text-[11px] uppercase tracking-[0.2em] text-[#2C1810]">
            Navigation
          </h4>
          <ul className="space-y-2.5 font-medium text-[#8B6860]">
            <li><Link href="/" className="hover:text-black transition-colors">Accueil</Link></li>
            <li><Link href="/boutique" className="hover:text-black transition-colors">Boutique</Link></li>
            <li><Link href="/favoris" className="hover:text-black transition-colors">Mes favoris</Link></li>
            <li><Link href="/apropos" className="hover:text-black transition-colors">À propos</Link></li>
            <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Colonne 3 : Catégories */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="font-playfair font-bold text-[11px] uppercase tracking-[0.2em] text-[#2C1810]">
            Catégories
          </h4>
          <ul className="space-y-2.5 font-medium text-[#8B6860]">
            <li><Link href="/boutique?category=parfums" className="hover:text-black transition-colors">Parfums Prestige</Link></li>
            <li><Link href="/boutique?category=sacs" className="hover:text-black transition-colors">Sacs à main Luxe</Link></li>
            <li><Link href="/boutique?category=maquillage" className="hover:text-black transition-colors">Maquillage Professionnel</Link></li>
          </ul>
        </div>

        {/* Colonne 4 : Coordonnées */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="font-playfair font-bold text-[11px] uppercase tracking-[0.2em] text-[#2C1810]">
            Contact
          </h4>
          <ul className="space-y-3 font-semibold text-[#2C1810]/90">
            <li className="flex items-center gap-2">
              <Phone size={13} className="text-[#8B6860]" />
              <span className="font-mono">+213 668 16 32 00</span>
            </li>
            <li className="flex items-center gap-2 break-all">
              <Mail size={13} className="text-[#8B6860]" />
              <span>Siadmaissa5@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* 3. COPYRIGHTS EXTRA-FINS */}
      <div className="bg-[#2C1810] text-white/50 text-[10px] py-4 px-6 sm:px-12 lg:px-20 tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Maisssty Store. Tous droits réservés.</p>
          <p className="text-white/30 uppercase text-[9px] tracking-[0.2em]">Authentic Elegance Algeria</p>
        </div>
      </div>

    </footer>
  );
}

export default Footer;