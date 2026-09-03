"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "../store/useCartStore";

interface ProductCardProps {
  product?: {
    id: string | number;
    name?: string;
    price?: number;
    images?: string[];
    img?: string;
    image?: string;
    category?: string;
    shortDesc?: string;
  };
  onAddToCart?: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  // 🛠️ SANITIZE ID: Strips non-numeric prefixes (e.g., "prod-12" -> "12")
  const rawId = product?.id ? String(product.id) : "unknown";
  const cleanId = rawId.replace(/\D/g, "") || rawId;

  const productName = typeof product?.name === "string" ? product.name : "Produit";
  const productPrice = typeof product?.price === "number" ? product.price : Number(product?.price) || 0;
  const productCategory = typeof product?.category === "string" ? product.category : "";
  const productDesc = typeof product?.shortDesc === "string" ? product.shortDesc : "Produit exclusif Maissty Store.";

  // Helper function to pick the first valid HTTPS / Cloudinary URL
  const getValidImageUrl = () => {
    if (!product) {
      return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' fill='%23f0ddd8'><rect width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%238b6860' font-family='sans-serif' font-size='14'>Pas d'image</text></svg>";
    }

    const rawImages = Array.isArray(product.images) ? product.images : [];
    
    const candidates = [
      product.img,
      product.image,
      ...rawImages
    ].filter((item): item is string => typeof item === "string" && item.trim().length > 0);

    const validHttpUrl = candidates.find((url) => url.startsWith("http"));
    if (validHttpUrl) return validHttpUrl;

    return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' fill='%23f0ddd8'><rect width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%238b6860' font-family='sans-serif' font-size='14'>Pas d'image</text></svg>";
  };

  const productImg = getValidImageUrl();

  useEffect(() => {
    if (!cleanId || cleanId === "unknown") return;

    try {
      const keyWith3S = localStorage.getItem("maisssty_favorites");
      const keyWith2S = localStorage.getItem("maissty_favorites");
      const saved = keyWith3S || keyWith2S;
      
      if (saved) {
        const favorites = JSON.parse(saved);
        if (Array.isArray(favorites)) {
          const found = favorites.some((fav: any) => fav && String(fav.id) === cleanId);
          setIsFavorite(found);
        }
      }
    } catch (err) {
      console.error("Error reading favorites:", err);
    }
  }, [cleanId]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cleanId || cleanId === "unknown") return;

    try {
      const keyWith3S = localStorage.getItem("maisssty_favorites");
      const keyWith2S = localStorage.getItem("maissty_favorites");
      const saved = keyWith3S || keyWith2S;
      
      let currentFavorites: any[] = [];
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          currentFavorites = parsed;
        }
      }

      if (isFavorite) {
        currentFavorites = currentFavorites.filter((fav: any) => fav && String(fav.id) !== cleanId);
        setIsFavorite(false);
      } else {
        currentFavorites.push({
          id: cleanId,
          name: productName,
          price: productPrice,
          images: [productImg],
          category: productCategory,
          shortDesc: productDesc
        });
        setIsFavorite(true);
      }

      const stringified = JSON.stringify(currentFavorites);
      localStorage.setItem("maisssty_favorites", stringified);
      localStorage.setItem("maissty_favorites", stringified);
    } catch (err) {
      console.error("Error updating favorites in localStorage:", err);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: cleanId,
      name: productName,
      price: productPrice,
      img: productImg,
      quantity: 1,
    });

    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#F0DDD8]/60 shadow-xs overflow-hidden flex flex-col justify-between group p-4 space-y-4 relative hover:shadow-md transition-all duration-300">
      
      {/* Heart Button */}
      <button 
        onClick={toggleFavorite}
        className="absolute top-6 right-6 z-30 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-md border border-[#F0DDD8]/40 hover:scale-105 transition-transform cursor-pointer"
        type="button"
      >
        <Heart 
          size={14} 
          className={`transition-colors duration-300 ${
            isFavorite ? "fill-red-500 text-red-500" : "text-neutral-400"
          }`} 
        />
      </button>

      {/* Product Image Link with Clean Numeric ID */}
      <Link href={`/produit/${cleanId}`} className="relative aspect-square w-full bg-[#FDF6F3] rounded-2xl overflow-hidden block">
        <img 
          src={productImg} 
          alt={productName} 
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
        />
      </Link>

      {/* Product Details */}
      <div className="space-y-1 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-playfair font-bold text-xs sm:text-sm text-[#2C1810]">{productName}</h3>
          <p className="text-[11px] text-[#8B6860] line-clamp-2 mt-1 leading-relaxed font-light">
            {productDesc}
          </p>
        </div>
        
        {/* Price & Cart */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-[#FDF6F3]">
          <span className="font-inter font-bold text-xs text-black">
            {productPrice.toLocaleString("fr-FR")} DA
          </span>
          <button 
            onClick={handleAddToCart}
            className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-neutral-900 transition-colors cursor-pointer" 
            type="button"
            aria-label="Ajouter au panier"
          >
            <ShoppingBag size={13} />
          </button>
        </div>
      </div>

    </div>
  );
}