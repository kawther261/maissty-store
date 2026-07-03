"use client";
import { useState, useEffect } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    img?: string;
    image?: string;
    category?: string;
    shortDesc?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Détecteur d'image universel
  const productImg = 
    (product.images && product.images.length > 0 ? product.images[0] : null) || 
    product.img || 
    product.image || 
    "/placeholder.jpg";

  // 🔄 1. Vérifier si ce produit est déjà dans les favoris au chargement de la page
  useEffect(() => {
    const keyWith3S = localStorage.getItem("maisssty_favorites");
    const keyWith2S = localStorage.getItem("maissty_favorites");
    const saved = keyWith3S || keyWith2S;
    
    if (saved) {
      const favorites = JSON.parse(saved);
      const found = favorites.some((fav: any) => fav.id === product.id);
      setIsFavorite(found);
    }
  }, [product.id]);

  // 🪄 2. Fonction de clic pour Ajouter / Retirer des favoris instantanément
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // 🛑 Empêche d'ouvrir la page produit lors du clic sur le cœur
    e.stopPropagation(); // 🛑 Bloque la propagation du clic au reste de la carte

    const keyWith3S = localStorage.getItem("maisssty_favorites");
    const keyWith2S = localStorage.getItem("maissty_favorites");
    const saved = keyWith3S || keyWith2S;
    
    let currentFavorites = saved ? JSON.parse(saved) : [];

    if (isFavorite) {
      // Si déjà dans les favoris : on l'enlève
      currentFavorites = currentFavorites.filter((fav: any) => fav.id !== product.id);
      setIsFavorite(false);
    } else {
      // Si pas dans les favoris : on l'ajoute avec toutes ses données pour la page Favoris
      currentFavorites.push({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images || [productImg],
        category: product.category || "",
        shortDesc: product.shortDesc || ""
      });
      setIsFavorite(true);
    }

    // Sauvegarde immédiate dans la mémoire du navigateur (les deux clés par sécurité)
    localStorage.setItem("maisssty_favorites", JSON.stringify(currentFavorites));
    localStorage.setItem("maissty_favorites", JSON.stringify(currentFavorites));
  };

  return (
    <div className="bg-white rounded-3xl border border-[#F0DDD8]/60 shadow-xs overflow-hidden flex flex-col justify-between group p-4 space-y-4 relative hover:shadow-md transition-all duration-300">
      
      {/* ❤️ LE BOUTON CŒUR INTERACTIF (Synchronisé avec image_56217e.jpg) */}
      <button 
        onClick={toggleFavorite}
        className="absolute top-6 right-6 z-30 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-md border border-[#F0DDD8]/40 hover:scale-105 transition-transform cursor-pointer"
      >
        <Heart 
          size={14} 
          className={`transition-colors duration-300 ${
            isFavorite ? "fill-red-500 text-red-500" : "text-neutral-400"
          }`} 
        />
      </button>

      {/* Image du produit */}
      <Link href={`/produit/${product.id}`} className="relative aspect-square w-full bg-[#FDF6F3] rounded-2xl overflow-hidden block">
        <img 
          src={productImg} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
        />
      </Link>

      {/* Informations textuelles */}
      <div className="space-y-1 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-playfair font-bold text-xs sm:text-sm text-[#2C1810]">{product.name}</h3>
          <p className="text-[11px] text-[#8B6860] line-clamp-2 mt-1 leading-relaxed font-light">
            {product.shortDesc || "Produit exclusif Maissty Store."}
          </p>
        </div>
        
        {/* Prix et Panier */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-[#FDF6F3]">
          <span className="font-inter font-bold text-xs text-black">
            {product.price?.toLocaleString()} DA
          </span>
          <button className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-neutral-900 transition-colors cursor-pointer">
            <ShoppingBag size={13} />
          </button>
        </div>
      </div>

    </div>
  );
}