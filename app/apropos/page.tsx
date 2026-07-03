"use client";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, Truck, Sparkles } from "lucide-react";

export default function AuProposPage() {
  return (
    <div className="bg-[#FDF6F3] text-[#2C1810] font-inter min-h-screen antialiased">
      
      {/* 1. En-tête de la page (Hero Section) */}
      <section className="relative bg-[#E2D2CB] py-20 text-center px-4 overflow-hidden border-b border-[#F0DDD8]">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-fade-in">
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6860]">
            Notre Histoire
          </p>
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Derrière l&apos;Élégance de Maisssty Store
          </h1>
          <div className="w-12 h-[1px] bg-[#2C1810] mx-auto mt-4" />
        </div>
      </section>

      {/* 2. Section Manifeste & Vision (Layout Asymétrique Premium) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 lg:py-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Colonne Gauche : Image d'ambiance de luxe */}
        <div className="md:col-span-5 relative h-[350px] sm:h-[450px] w-full rounded-2xl overflow-hidden shadow-sm border border-[#F0DDD8]/60">
          <Image 
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800" 
            alt="L'univers Maisssty" 
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Colonne Droite : Textes fondateurs */}
        <div className="md:col-span-7 space-y-6 text-left">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold leading-snug">
            Notre engagement : L&apos;authenticité absolue, sans aucun compromis.
          </h2>
          <p className="text-xs sm:text-sm text-[#8B6860] leading-relaxed">
            Chez <strong>Maisssty Store</strong>, nous pensons que le parfum que vous portez, le sac que vous tenez ou le maquillage que vous appliquez sont le prolongement direct de votre personnalité. C&apos;est pourquoi nous refusons catégoriquement les contrefaçons et les approximations.
          </p>
          <p className="text-xs sm:text-sm text-[#8B6860] leading-relaxed">
            Chaque référence disponible sur notre catalogue est rigoureusement sélectionnée auprès de distributeurs officiels et certifiés. Nous vous garantissons des pièces <strong>100% originales</strong> importées avec soin, pour vous offrir l&apos;excellence des plus grandes maisons de luxe mondiales directement ici, en Algérie.
          </p>

          <div className="pt-4">
            <Link 
              href="/boutique" 
              className="inline-block bg-black text-white px-7 py-3.5 rounded-none font-inter text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-neutral-900 transition-colors shadow-sm"
            >
              Explorer nos collections
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Nos Piliers de Confiance (Grille d'avantages professionnels) */}
      <section className="bg-white border-y border-[#F0DDD8]/50 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          
          <div className="text-center mb-16">
            <h3 className="font-playfair text-xl sm:text-2xl font-bold uppercase tracking-wide">
              Pourquoi nous faire confiance ?
            </h3>
            <div className="w-12 h-[1px] bg-[#C9A96E] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Pilier 1 */}
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-10 h-10 bg-[#FDF6F3] rounded-full flex items-center justify-center text-[#2C1810]">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-playfair font-bold text-sm uppercase tracking-wider">Origine Garantie</h4>
              <p className="text-xs text-[#8B6860] leading-relaxed max-w-xs">
                Aucune copie, aucun marché parallèle. Nos produits proviennent exclusivement de circuits officiels de confiance.
              </p>
            </div>

            {/* Pilier 2 */}
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-10 h-10 bg-[#FDF6F3] rounded-full flex items-center justify-center text-[#2C1810]">
                <Award size={20} />
              </div>
              <h4 className="font-playfair font-bold text-sm uppercase tracking-wider">Sélection Prestige</h4>
              <p className="text-xs text-[#8B6860] leading-relaxed max-w-xs">
                Des cosmétiques les plus tendance aux maroquineries intemporelles, nous ne gardons que la crème de la crème.
              </p>
            </div>

            {/* Pilier 3 */}
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-10 h-10 bg-[#FDF6F3] rounded-full flex items-center justify-center text-[#2C1810]">
                <Truck size={20} />
              </div>
              <h4 className="font-playfair font-bold text-sm uppercase tracking-wider">Suivi Yalidine Pro</h4>
              <p className="text-xs text-[#8B6860] leading-relaxed max-w-xs">
                Une expédition ultra-rapide à domicile ou en bureau de retrait partout en Algérie, avec appel de confirmation systématique.
              </p>
            </div>

            {/* Pilier 4 */}
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-10 h-10 bg-[#FDF6F3] rounded-full flex items-center justify-center text-[#2C1810]">
                <Sparkles size={20} />
              </div>
              <h4 className="font-playfair font-bold text-sm uppercase tracking-wider">Service V.I.P</h4>
              <p className="text-xs text-[#8B6860] leading-relaxed max-w-xs">
                Une équipe à votre écoute par téléphone ou WhatsApp pour vous conseiller sur vos choix de teintes ou de fragrances.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}