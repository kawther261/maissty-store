"use client";
import { useState } from "react";
import { Phone, Mail, Instagram, Facebook, MessageCircle, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`✨ Merci ${formData.name}, votre message a bien été envoyé à l'équipe Maissty Store !`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#FDF6F3] text-[#2C1810] font-inter py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* En-tête de la page */}
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold tracking-[0.25em] uppercase">
            Contactez-nous
          </h1>
          <div className="w-16 h-[1.5px] bg-[#C9A96E]" />
          <p className="text-xs text-[#8B6860] max-w-sm leading-relaxed pt-1">
            Une question sur un parfum, un sac ou votre commande ? Notre équipe est à votre entière disposition.
          </p>
        </div>

        {/* Grille principale en 2 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* COLONNE GAUCHE : INFOS DE CONTACT & RÉSEAUX SOCIAUX */}
          <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DDD8]/60 shadow-sm flex flex-col justify-between space-y-8">
            
            <div className="space-y-6">
              <h3 className="font-playfair font-bold text-base uppercase tracking-wider text-neutral-900">
                Nos Coordonnées
              </h3>

              <div className="space-y-4 text-xs">
                {/* Téléphone / WhatsApp */}
                <a 
                  href="https://wa.me/213668163200" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3.5 bg-[#FDF6F3]/60 rounded-xl border border-[#F0DDD8]/30 hover:border-[#C9A96E] transition-all group"
                >
                  <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center group-hover:bg-[#C9A96E] transition-colors">
                    <MessageCircle size={15} />
                  </div>
                  <div>
                    <p className="font-bold text-[10px] uppercase tracking-wider text-[#8B6860]">WhatsApp & Service Client</p>
                    <p className="text-sm font-semibold text-neutral-800 mt-0.5">+213 668 16 32 00</p>
                  </div>
                </a>

                {/* Email */}
                <a 
                  href="mailto:Siadmaissa5@gmail.com" 
                  className="flex items-center gap-4 p-3.5 bg-[#FDF6F3]/60 rounded-xl border border-[#F0DDD8]/30 hover:border-[#C9A96E] transition-all group"
                >
                  <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center group-hover:bg-[#C9A96E] transition-colors">
                    <Mail size={15} />
                  </div>
                  <div>
                    <p className="font-bold text-[10px] uppercase tracking-wider text-[#8B6860]">Courrier Électronique</p>
                    <p className="text-sm font-semibold text-neutral-800 mt-0.5 truncate max-w-[200px]">Siadmaissa5@gmail.com</p>
                  </div>
                </a>

                {/* Horaires */}
                <div className="flex items-center gap-4 p-3.5 bg-[#FDF6F3]/40 rounded-xl border border-dashed border-[#F0DDD8] select-none">
                  <div className="w-8 h-8 bg-neutral-100 text-[#8B6860] rounded-lg flex items-center justify-center">
                    <Clock size={15} />
                  </div>
                  <div>
                    <p className="font-bold text-[10px] uppercase tracking-wider text-[#8B6860]">Disponibilité</p>
                    <p className="text-[11px] text-neutral-600 mt-0.5">7j/7 — Réponse en moins de 2 heures</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ✨ SECTION DEMANDÉE : LIENS INSTAGRAM & FACEBOOK PREMIUM */}
            <div className="space-y-3 pt-4 border-t border-[#F0DDD8]/60">
              <h4 className="font-inter font-bold text-[10px] uppercase tracking-[0.2em] text-[#8B6860]">
                Suivez notre univers
              </h4>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Lien Instagram */}
                <a 
                  href="http://instagram.com/maisstys___" // Remplace par ton vrai lien complet
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-[#F0DDD8] py-2.5 rounded-xl font-semibold bg-[#FDF6F3]/20 hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer"
                >
                  <Instagram size={14} /> Instagram
                </a>

                {/* Lien Facebook */}
                <a 
                  href="https://www.facebook.com/mayst.ie.2025" // Remplace par ton vrai lien complet
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-[#F0DDD8] py-2.5 rounded-xl font-semibold bg-[#FDF6F3]/20 hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer"
                >
                  <Facebook size={14} /> Facebook
                </a>
              </div>
            </div>

          </div>

          {/* COLONNE DROITE : FORMULAIRE DE CONTACT CHIC */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DDD8]/60 shadow-sm">
            <h3 className="font-playfair font-bold text-base uppercase tracking-wider text-neutral-900 mb-6">
              Écrivez-nous directement
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold uppercase tracking-wider text-[#8B6860] text-[10px]">Nom complet</label>
                <input 
                  type="text" 
                  placeholder="Ex: Yasmine Ben" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3]/40 outline-none text-sm focus:border-black transition-colors" 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold uppercase tracking-wider text-[#8B6860] text-[10px]">Adresse Email</label>
                <input 
                  type="email" 
                  placeholder="Ex: Siadmaissa5@gmail.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3]/40 outline-none text-sm focus:border-black transition-colors" 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold uppercase tracking-wider text-[#8B6860] text-[10px]">Votre Message</label>
                <textarea 
                  rows={4} 
                  placeholder="Comment pouvons-nous vous aider aujourd'hui ?" 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-[#F0DDD8] rounded-xl bg-[#FDF6F3]/40 outline-none text-sm focus:border-black transition-colors leading-relaxed resize-none" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-black text-white py-3.5 rounded-xl uppercase font-bold tracking-widest hover:bg-neutral-900 transition-all cursor-pointer flex items-center justify-center gap-2 text-[10px] pt-4"
              >
                <Send size={12} /> Envoyer le message
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}