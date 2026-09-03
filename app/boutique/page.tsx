"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "../../components/ProductCard";
import { X } from "lucide-react";

// Helper to fix Cloudinary URLs or relative paths automatically
const cleanImageUrl = (url: any) => {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")) return url;
  const filename = url.split("/").pop() || "";
  return filename ? `https://res.cloudinary.com/wigng2m5/image/upload/${filename}` : "";
};

function BoutiqueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const categoryParam = searchParams.get("category") || "all";
    const searchParam = searchParams.get("search") || "";

    setSelectedCategory(categoryParam);
    setSearchQuery(searchParam);

    const loadBoutiqueProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();

        const rawList = Array.isArray(data) ? data : (data && Array.isArray(data.products) ? data.products : []);

        if (rawList.length > 0) {
          const normalized = rawList
            .map((p: any) => {
              if (!p) return null;

              let imagesArr: string[] = [];
              if (Array.isArray(p.images)) {
                imagesArr = p.images
                  .map((img: any) => cleanImageUrl(img))
                  .filter((url: string) => url !== "");
              }

              let mainImg = cleanImageUrl(p.img);
              if (!mainImg && imagesArr.length > 0) {
                mainImg = imagesArr[0];
              }

              if (!mainImg) {
                mainImg =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' fill='%23f0ddd8'><rect width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%238b6860' font-family='sans-serif' font-size='14'>Pas d'image</text></svg>";
              }

              let catStr = "parfums";
              if (typeof p.category === "string") {
                catStr = p.category;
              } else if (p.category && typeof p.category.name === "string") {
                catStr = p.category.name;
              }

              return {
                id: p.id ? String(p.id) : String(Math.random()),
                name: typeof p.name === "string" ? p.name : "Produit Sans Nom",
                price: typeof p.price === "number" ? p.price : Number(p.price) || 0,
                img: mainImg,
                images: imagesArr.length > 0 ? imagesArr : [mainImg],
                category: catStr,
                shortDesc:
                  typeof p.description === "string"
                    ? p.description
                    : typeof p.shortDesc === "string"
                    ? p.shortDesc
                    : ""
              };
            })
            .filter(Boolean);

          setProducts(normalized);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadBoutiqueProducts();
  }, [searchParams]);

  const filteredProducts = products.filter((p) => {
    if (!p) return false;
    const name = String(p.name || "").toLowerCase();
    const desc = String(p.shortDesc || p.description || "").toLowerCase();
    const cat = String(p.category || "all").toLowerCase();
    const query = String(searchQuery || "").toLowerCase().trim();

    const matchesCategory =
      selectedCategory === "all" || cat.includes(selectedCategory.toLowerCase());
    const matchesSearch =
      !query || name.includes(query) || desc.includes(query) || cat.includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", cat);
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    router.push(`/boutique?${params.toString()}`);
  };

  const clearSearchFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/boutique?${params.toString()}`);
  };

  const handleAddToCart = () => {
    router.push("/panier");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#F0DDD8] pb-6 mb-10 gap-4">
        <div className="space-y-1.5 text-center sm:text-left">
          <h1 className="font-playfair text-2xl font-bold uppercase tracking-wide">
            La Boutique
          </h1>
          {searchQuery && (
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#F0DDD8] w-fit text-[11px] font-medium mx-auto sm:mx-0 shadow-sm">
              <span>
                Résultats pour :{" "}
                <strong className="text-black italic">&ldquo;{searchQuery}&rdquo;</strong>
              </span>
              <button
                onClick={clearSearchFilter}
                className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors ml-1"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider font-medium">
          {["all", "parfums", "sacs", "maquillage"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-black text-white border-black"
                  : "bg-white text-[#8B6860] border-[#F0DDD8] hover:border-black"
              }`}
            >
              {cat === "all" ? "Tout voir" : cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#F0DDD8] shadow-sm max-w-xl mx-auto p-8 space-y-2">
          <p className="animate-pulse text-xs text-[#8B6860]">
            Chargement de la collection Maisssty...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#F0DDD8] shadow-sm max-w-xl mx-auto p-8 space-y-2">
          <p className="font-playfair font-bold text-base">Aucun résultat trouvé</p>
          <p className="text-xs text-[#8B6860]">
            Aucun article ne correspond à votre recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BoutiquePage() {
  return (
    <div className="min-h-screen bg-[#FDF6F3] text-[#2C1810] font-inter py-12">
      <Suspense
        fallback={
          <div className="text-center py-20 text-xs text-[#8B6860]">
            Chargement de la collection...
          </div>
        }
      >
        <BoutiqueContent />
      </Suspense>
    </div>
  );
}