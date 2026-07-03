"use client";
import { useState, useEffect } from "react";
import { Hero } from "../components/Hero";
import { ProductCard } from "../components/ProductCard";
import { Testimonials } from "../components/Testimonials";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  // 🔄 Chargement dynamique des vrais produits depuis l'espace Admin (localStorage)
  useEffect(() => {
    const savedProducts = localStorage.getItem("maisssty_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Sélectionner les 4 derniers produits ajoutés pour la section Nouveautés
  const latestProducts = products.slice(0, 4);

  return (
    <div className="bg-maisssty-bg min-h-screen antialiased">
      {/* Écran de bannière principal dynamique */}
      <Hero />
      
      {/* Section Catégories - Synchronisée sur image_842dfd.jpg */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-sm tracking-[0.3em] text-[#2C1810] font-playfair font-bold uppercase">
            Nos Catégories
          </h2>
          <div className="w-12 h-[1px] bg-[#C9A96E] mx-auto mt-3" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { cat: "Parfums", filter: "parfums", img: "/cat-parfum.jpg" },
            { cat: "Sacs", filter: "sacs", img: "/cat-sac.jpg" },
            { cat: "Maquillage", filter: "maquillage", img: "/cat-maquillage.jpg" }
          ].map((item, index) => (
            <Link 
              key={index} 
              href={`/boutique?category=${item.filter}`} 
              className="group relative h-64 rounded-2xl overflow-hidden block border border-[#F0DDD8]/40 shadow-sm transition-all duration-500 hover:-translate-y-1"
            >
              {/* Voile d'assombrissement au survol */}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors z-10" />
              
              {/* Badge Blanc Central */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-[#2C1810] font-playfair uppercase tracking-[0.2em] text-[11px] font-medium bg-white px-7 py-3.5 rounded-sm shadow-sm border border-[#F0DDD8] transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:border-black">
                  {item.cat}
                </span>
              </div>

              {/* Rendu de votre image personnelle */}
              <Image 
                src={item.img}
                alt={item.cat}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-103"
                sizes="(max-w-7xl) 33vw, 100vw"
                priority={index === 0}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Section Nouveautés Dynamiques Réparée */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
        <div className="text-center mb-10">
          <h2 className="text-sm tracking-[0.3em] text-[#2C1810] font-playfair font-bold uppercase">
            Nouveautés
          </h2>
          <div className="w-12 h-[1px] bg-[#C9A96E] mx-auto mt-3" />
        </div>

        {latestProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-[#8B6860]">Aucun produit en ligne pour le moment. Connectez-vous sur votre tableau de bord admin pour ajouter des articles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {latestProducts.map((prod) => {
              
              // 🪄 DETECTEUR AUTOMATIQUE D'IMAGE : Capte .images, .img ou .image envoyé par l'admin
              const targetImg = 
                (prod.images && prod.images.length > 0 ? prod.images[0] : null) || 
                prod.img || 
                prod.image || 
                "/placeholder.jpg";

              return (
                <ProductCard 
                  key={prod.id} 
                  product={{
                    id: prod.id,
                    name: prod.name,
                    price: prod.price,
                    images: [targetImg], // Convertit proprement la bonne image en tableau pour ton ProductCard
                    shortDesc: prod.shortDesc || ""
                  }} 
                />
              );
            })}
          </div>
        )}
      </section>

      <Testimonials />
    </div>
  );
}