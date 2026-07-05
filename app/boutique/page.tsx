"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "../../components/ProductCard";
import { X } from "lucide-react";

function BoutiqueContent() {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelectedCategory(params.get("category") || "all");
    setSearchQuery(params.get("search") || "");

    const loadBoutiqueProducts = async () => {
      try {
        // ✨ LE FIX ICI : On appelle l'API légère /api/products au lieu de /api/admin
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products) {
          const normalized = data.products.map((p: any) => ({
            ...p,
            img: p.images && p.images.length > 0 ? p.images[0] : p.img || "/placeholder.jpg",
            category: p.category?.name || p.category || "parfums"
          }));
          setProducts(normalized);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des produits de la boutique :", err);
      }
    };

    loadBoutiqueProducts();
  }, [searchParams]);

  const filteredProducts = products.filter((p) => {
    const name = (p?.name || "").toLowerCase();
    const desc = (p?.shortDesc || "").toLowerCase();
    const cat = (p?.category || "all").toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesCategory = selectedCategory === "all" || cat === selectedCategory.toLowerCase();
    const matchesSearch = !query || name.includes(query) || desc.includes(query) || cat.includes(query);

    return matchesCategory && matchesSearch;
  });

  const clearSearchFilter = () => {
    window.location.href = "/boutique" + (selectedCategory !== "all" ? `?category=${selectedCategory}` : "");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#F0DDD8] pb-6 mb-10 gap-4">
        <div className="space-y-1.5 text-center sm:text-left">
          <h1 className="font-playfair text-2xl font-bold uppercase tracking-wide">La Boutique</h1>
          {searchQuery && (
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#F0DDD8] w-fit text-[11px] font-medium mx-auto sm:mx-0 shadow-sm">
              <span>Résultats pour : <strong className="text-black italic">&ldquo;{searchQuery}&rdquo;</strong></span>
              <button onClick={clearSearchFilter} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors ml-1">
                <X size={12} />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider font-medium">
          {["all", "parfums", "sacs", "maquillage"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                window.location.href = `/boutique?category=${cat}` + (searchQuery ? `&search=${searchQuery}` : "");
              }}
              className={`px-4 py-2 rounded-full border transition-all cursor-pointer ${
                selectedCategory === cat ? "bg-black text-white border-black" : "bg-white text-[#8B6860] border-[#F0DDD8] hover:border-black"
              }`}
            >
              {cat === "all" ? "Tout voir" : cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#F0DDD8] shadow-sm max-w-xl mx-auto p-8 space-y-2">
          <p className="font-playfair font-bold text-base">Aucun résultat trouvé</p>
          <p className="text-xs text-[#8B6860]">Aucun article ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BoutiquePage() {
  return (
    <div className="min-h-screen bg-[#FDF6F3] text-[#2C1810] font-inter py-12">
      <Suspense fallback={<div className="text-center py-20 text-xs text-[#8B6860]">Chargement de la collection...</div>}>
        <BoutiqueContent />
      </Suspense>
    </div>
  );
}