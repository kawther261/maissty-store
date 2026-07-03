"use client";
import { useState, useEffect } from "react";
import { Star, PenLine, X } from "lucide-react";

export function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Formulaire d'avis
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  // Charger les vrais avis depuis la mémoire locale
  useEffect(() => {
    const saved = localStorage.getItem("maisssty_real_reviews");
    if (saved) {
      setReviews(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview = {
      id: Date.now(),
      name: name.trim().toUpperCase(), // Pour le style en majuscules comme sur la photo
      comment: comment.trim(),
      rating: rating,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem("maisssty_real_reviews", JSON.stringify(updated));

    // Reset
    setName("");
    setComment("");
    setRating(5);
    setIsOpen(false);
  };

  return (
    <section className="w-full bg-[#FDF6F3] py-16 text-[#2C1810] font-inter select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Titre et ligne dorée identiques à image_2adf5a.png */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <h2 className="font-playfair text-xl sm:text-2xl font-bold tracking-[0.3em] uppercase text-center">
            Reviews
          </h2>
          <div className="w-16 h-[1.5px] bg-[#C9A96E]" />
        </div>

        {/* SI AUCUN AVIS : Bouton d'invitation chic "Give us a review" */}
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <p className="text-xs italic text-[#8B6860] font-light">
              Aucun avis pour le moment. Soyez la première à partager votre expérience !
            </p>
            <button 
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-xl hover:bg-neutral-950 transition-all cursor-pointer shadow-sm"
            >
              <PenLine size={12} /> Laissez-nous un avis
            </button>
          </div>
        ) : (
          /* SI DES AVIS EXISTENT : On affiche les vraies cartes fidèles à ta photo */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0DDD8]/40 shadow-sm flex flex-col justify-between space-y-4 min-h-[160px]"
                >
                  <div className="space-y-3">
                    {/* Étoiles dorées de ta maquette */}
                    <div className="flex items-center gap-0.5 text-[#C9A96E]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-neutral-200"} />
                      ))}
                    </div>
                    {/* Message */}
                    <p className="text-xs sm:text-sm text-neutral-700 italic leading-relaxed font-light">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                  {/* Nom au format — NOM B. */}
                  <div className="text-[10px] font-bold tracking-widest text-[#2C1810]">
                    — {rev.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Petit bouton d'ajout discret sous les avis existants */}
            <div className="flex justify-center pt-2">
              <button 
                onClick={() => setIsOpen(true)}
                className="text-[10px] font-bold uppercase tracking-wider text-[#8B6860] hover:text-black underline cursor-pointer"
              >
                + Ajouter un témoignage
              </button>
            </div>
          </div>
        )}

        {/* 📋 POPUP / MODAL POP-UP POUR ÉCRIRE L'AVIS SANS CASSER LA PAGE */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm p-6 rounded-3xl border border-[#F0DDD8]/60 shadow-lg space-y-4 relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="text-center space-y-1">
                <h3 className="font-playfair font-bold text-base uppercase tracking-wider">Votre avis compte</h3>
                <p className="text-[11px] text-[#8B6860]">Aidez notre communauté d&apos;achats</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[#8B6860] text-[10px]">Votre Prénom</label>
                  <input type="text" placeholder="Ex: Amel B." value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3] outline-none" required />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[#8B6860] text-[10px]">Note</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3] outline-none font-semibold">
                    <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                    <option value="4">⭐⭐⭐⭐ (Très bon)</option>
                    <option value="3">⭐⭐⭐ (Moyen)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[#8B6860] text-[10px]">Votre Message</label>
                  <textarea rows={3} placeholder="Partagez votre expérience avec authenticité..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full px-4 py-2.5 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3] outline-none leading-relaxed resize-none" required />
                </div>

                <button type="submit" className="w-full bg-black text-white py-3 rounded-xl uppercase font-bold tracking-widest hover:bg-neutral-900 transition-colors text-[10px] cursor-pointer pt-3">
                  Envoyer l&apos;avis
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}