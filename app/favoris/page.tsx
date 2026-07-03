"use client";
import { useState, useEffect } from "react";
import { ShoppingBag, Trash2, Heart } from "lucide-react";
import Link from "next/link";

export default function FavorisPage() {
  const [favorites, setFavorites] = useState<any[]>([]);

  // 🔄 1. Charger les vrais favoris enregistrés par l'utilisateur
  useEffect(() => {
    const keyWith3S = localStorage.getItem("maisssty_favorites");
    const keyWith2S = localStorage.getItem("maissty_favorites");
    const savedFavorites = keyWith3S || keyWith2S;

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // ❌ 2. Fonction pour retirer un produit des favoris directement depuis cette page
  const removeFromFavorites = (id: string) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    
    // On sauvegarde la modification dans les deux clés par sécurité
    localStorage.setItem("maisssty_favorites", JSON.stringify(updated));
    localStorage.setItem("maissty_favorites", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#FDF6F3] text-[#2C1810] font-inter antialiased py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Titre principal de la page */}
        <div className="space-y-2">
          <h1 className="font-playfair text-xl sm:text-2xl font-bold tracking-wider uppercase">
            Mes Favoris
          </h1>
          <div className="w-12 h-[1px] bg-[#C9A96E]" />
        </div>

        {/* 🛒 ÉTAT VIDE : Si aucun produit n'a été mis en favoris */}
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#F0DDD8]/60 shadow-xs max-w-md mx-auto p-6 space-y-4">
            <div className="w-12 h-12 bg-[#FDF6F3] rounded-full flex items-center justify-center mx-auto text-[#8B6860]">
              <Heart size={20} />
            </div>
            <p className="text-xs text-[#8B6860] font-light leading-relaxed">
              Votre liste de favoris est vide pour le moment. Parcourez la boutique pour y ajouter vos coups de cœur !
            </p>
            <div className="pt-2">
              <Link 
                href="/boutique" 
                className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-neutral-900 transition-colors"
              >
                Découvrir la boutique
              </Link>
            </div>
          </div>
        ) : (
          /* 🛍️ GRILLE DYNAMIQUE : Si la cliente a des favoris */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {favorites.map((product) => {
              // Détecteur universel d'images (.images ou .img ou .image)
              const productImg = 
                (product.images && product.images.length > 0 ? product.images[0] : null) || 
                product.img || 
                product.image || 
                "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600";

              return (
                <div 
                  key={product.id} 
                  className="bg-white rounded-3xl border border-[#F0DDD8]/60 shadow-xs overflow-hidden flex flex-col justify-between group p-4 space-y-4 relative hover:shadow-md transition-all duration-300"
                >
                  {/* Bouton Supprimer des favoris (Petite corbeille ou croix discrète) */}
                  <button 
                    onClick={() => removeFromFavorites(product.id)}
                    className="absolute top-6 right-6 z-20 w-7 h-7 bg-white/80 backdrop-blur-xs text-red-500 rounded-full flex items-center justify-center border border-[#F0DDD8]/40 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer shadow-xs"
                    title="Retirer des favoris"
                  >
                    <Trash2 size={13} />
                  </button>

                  {/* Image cliquable vers le produit */}
                  <Link href={`/produit/${product.id}`} className="relative aspect-square w-full bg-[#FDF6F3] rounded-2xl overflow-hidden block">
                    <img 
                      src={productImg} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                    />
                  </Link>

                  {/* Infos & Boutons d'action */}
                  <div className="space-y-1 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-playfair font-bold text-xs sm:text-sm text-[#2C1810]">{product.name}</h3>
                      <p className="text-[11px] text-[#8B6860] line-clamp-1 mt-1 font-light">
                        {product.category || "Prestige"}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 mt-auto border-t border-[#FDF6F3]">
                      <span className="font-inter font-bold text-xs text-black">
                        {product.price?.toLocaleString()} DA
                      </span>
                      {/* Panier rapide */}
                      <button className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-neutral-900 transition-colors cursor-pointer">
                        <ShoppingBag size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}