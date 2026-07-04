"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCartStore } from "../../../store/useCartStore"; 
import { ShoppingBag, Star, ArrowLeft, Heart, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const addItem = useCartStore((state: any) => state.addItem);
  const [product, setProduct] = useState<any>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // 📝 ÉTATS POUR LES VRAIS AVIS
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Charger le produit depuis Neon Cloud et ses avis correspondants
  useEffect(() => {
    if (!productId) return;
    
    const loadProductAndReviews = async () => {
      try {
        // 1. Charger le produit en direct depuis Neon Cloud par son ID
        const res = await fetch(`/api/products?id=${productId}`, { cache: "no-store" });
        const data = await res.json();
        
        if (data.product) {
          const p = data.product;
          // Normalisation des données pour ton interface graphique
          setProduct({
            ...p,
            category: p.category?.name || p.category || "parfums"
          });
        }
      } catch (err) {
        console.error("Erreur lors du chargement du produit depuis Neon :", err);
      } finally {
        setLoading(false);
      }

      // 2. Charger les vrais avis de ce produit spécifique (conserve le localStorage pour les avis)
      const savedReviews = localStorage.getItem(`maisssty_reviews_${productId}`);
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        const defaultReviews = [
          { id: 1, name: "Amel B.", rating: 5, comment: "La qualité du cuir est incroyable, les finitions sont parfaites. Je recommande !", date: "12/05/2026" },
          { id: 2, name: "Yasmine K.", rating: 4, comment: "Très beau sac, emballage soigné et livraison rapide en 48h.", date: "02/06/2026" }
        ];
        setReviews(defaultReviews);
        localStorage.setItem(`maisssty_reviews_${productId}`, JSON.stringify(defaultReviews));
      }
    };

    loadProductAndReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6F3] flex flex-col items-center justify-center text-xs text-[#8B6860]">
        <p>Chargement de votre article Maisssty...</p>
        <Link href="/boutique" className="mt-4 text-black underline">Retourner à la boutique</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDF6F3] flex flex-col items-center justify-center text-xs text-[#8B6860]">
        <p>Article introuvable ou inexistant.</p>
        <Link href="/boutique" className="mt-4 text-black underline">Retourner à la boutique</Link>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.img || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1000"];

  const handlePrevImage = () => {
    setActiveImageIdx((prevIdx) => prevIdx === 0 ? productImages.length - 1 : prevIdx - 1);
  };

  const handleNextImage = () => {
    setActiveImageIdx((prevIdx) => prevIdx === productImages.length - 1 ? 0 : prevIdx + 1);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    alert(`✨ ${quantity}x ${product.name} ajouté(s) au panier !`);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newReview = {
      id: Date.now(),
      name: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toLocaleDateString("fr-FR")
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`maisssty_reviews_${productId}`, JSON.stringify(updatedReviews));

    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewRating(5);
    alert("❤️ Merci ! Votre avis a été publié avec succès.");
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "5.0";

  return (
    <div className="min-h-screen bg-[#FDF6F3] text-[#2C1810] font-inter py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <Link href="/boutique" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8B6860] hover:text-black transition-colors">
          <ArrowLeft size={14} /> Retour aux collections
        </Link>

        {/* SECTION PRODUIT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start bg-white p-6 sm:p-10 rounded-3xl border border-[#F0DDD8]/60 shadow-sm">
          
          {/* GALERIE IMAGES */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FDF6F3] border border-[#F0DDD8]/30 group">
              <img src={productImages[activeImageIdx]} alt={product.name} className="w-full h-full object-cover select-none" />
              {productImages.length > 1 && (
                <>
                  <button onClick={handlePrevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-black shadow-sm hover:bg-white"><ChevronLeft size={18} /></button>
                  <button onClick={handleNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-black shadow-sm hover:bg-white"><ChevronRight size={18} /></button>
                </>
              )}
              <button className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-sm text-neutral-400 hover:text-red-500"><Heart size={16} /></button>
            </div>

            {productImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {productImages.map((imageSrc: string, idx: number) => (
                  <button key={idx} type="button" onClick={() => setActiveImageIdx(idx)} className={`relative w-16 h-16 rounded-xl overflow-hidden bg-[#FDF6F3] border-2 transition-all cursor-pointer flex-shrink-0 ${idx === activeImageIdx ? "border-black scale-95 shadow-sm" : "border-[#F0DDD8]/60"}`}>
                    <img src={imageSrc} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DÉTAILS DU TEXTE */}
          <div className="md:col-span-6 space-y-6 pt-2">
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9A96E]">{product.category}</p>
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"} className={i < Math.round(Number(averageRating)) ? "" : "text-neutral-300"} />
                ))}
                <span className="text-[11px] text-[#8B6860] font-medium ml-2">({averageRating} / 5 basé sur {reviews.length} avis)</span>
              </div>
            </div>

            <p className="font-inter font-bold text-2xl text-black">{product.price?.toLocaleString()} DA</p>
            <div className="w-12 h-[1px] bg-[#F0DDD8]" />

            <div className="space-y-2">
              <h4 className="text-[11px] uppercase font-bold text-[#8B6860]">Description</h4>
              <p className="text-xs sm:text-sm text-[#8B6860] leading-relaxed whitespace-pre-line">{product.shortDesc || "Aucune description rédigée."}</p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#F0DDD8] bg-[#FDF6F3] rounded h-11">
                  <button type="button" onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="px-3 py-1 font-bold text-sm text-[#8B6860]">-</button>
                  <span className="px-3 font-bold text-xs w-6 text-center">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(prev => prev + 1)} className="px-3 py-1 font-bold text-sm text-[#8B6860]">+</button>
                </div>
                <button onClick={handleAddToCart} className="flex-grow bg-black text-white h-11 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-neutral-900 transition-colors shadow-sm cursor-pointer">
                  <ShoppingBag size={14} /> Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION AVIS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DDD8]/60 shadow-sm space-y-6">
            <h2 className="font-playfair font-bold text-lg flex items-center gap-2">
              <MessageSquare size={18} /> Évaluations des clientes ({reviews.length})
            </h2>
            
            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
              {reviews.map((rev: any) => (
                <div key={rev.id} className="border-b border-[#FDF6F3] pb-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2C1810]">{rev.name}</span>
                    <span className="text-[10px] text-neutral-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-neutral-200"} />)}
                  </div>
                  <p className="text-[#8B6860] italic leading-relaxed font-light">&ldquo; {rev.comment} &rdquo;</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DDD8]/60 shadow-sm space-y-4">
            <h3 className="font-playfair font-bold text-base">Donner votre avis</h3>
            
            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-[#8B6860] uppercase tracking-wider">Votre Nom / Pseudo</label>
                <input type="text" placeholder="Ex: Rania S." value={newReviewName} onChange={(e) => setNewReviewName(e.target.value)} className="w-full px-4 py-2.5 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3] outline-none text-xs" required />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#8B6860] uppercase tracking-wider">Note de l&apos;article</label>
                <select value={newReviewRating} onChange={(e) => setNewReviewRating(Number(e.target.value))} className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3] outline-none text-xs font-semibold">
                  <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                  <option value="4">⭐⭐⭐⭐ (Très bon)</option>
                  <option value="3">⭐⭐⭐ (Moyen)</option>
                  <option value="2">⭐⭐ (Décevant)</option>
                  <option value="1">⭐ (Mauvais)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#8B6860] uppercase tracking-wider">Votre Message</label>
                <textarea rows={3} placeholder="Partagez votre expérience avec ce produit..." value={newReviewComment} onChange={(e) => setNewReviewComment(e.target.value)} className="w-full px-4 py-2.5 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3] outline-none text-xs leading-relaxed resize-none" required />
              </div>

              <button type="submit" className="w-full bg-black text-white py-3 rounded-xl uppercase font-bold tracking-widest hover:bg-neutral-900 transition-colors cursor-pointer">
                Publier mon avis
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}