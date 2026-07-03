"use client";
import { useState } from "react";
import { useCartStore } from "../../store/useCartStore";
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Minus, Plus } from "lucide-react";
import Image from "next/image";

// 🇩🇿 Liste officielle des Wilayas d'Algérie
const ALGERIAN_WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira",
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou", "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda",
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine", "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla",
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerdès", "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma", "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane",
  "49 - El M'Ghair", "50 - El Meniaa", "51 - Ouled Djellal", "52 - Bordj Badji Mokhtar", "53 - Béni Abbès", "54 - Timimoun", "55 - Touggourt", "56 - Djanet", "57 - In Salah", "58 - In Guezzam"
];

export default function PanierPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const [step, setStep] = useState<"cart" | "checkout">("cart");

  // Coordonnées de base du client
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  
  // Champs dynamiques pour la livraison à domicile
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState<"domicile" | "bureau">("domicile");

  // ⚡ FONCTION DE VALIDATION CONNECTÉE À TELEGRAM
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations de base
    if (!firstName || !lastName || !phone || !wilaya) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Validation stricte si livraison à domicile
    if (deliveryType === "domicile" && (!commune || !address)) {
      alert("Pour une livraison à domicile, la commune et l'adresse complète sont obligatoires.");
      return;
    }

    const itemsSummary = items.map((i) => `${i.name} (x${i.quantity})`).join(", ");
    const totalAmount = totalPrice();

    try {
      // 🚀 Branchement de la passerelle API sans blocage de navigateur
      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${lastName.toUpperCase()} ${firstName}`,
          phone,
          wilaya,
          commune: deliveryType === "domicile" ? commune : "N/A (Retrait Agence)",
          address: deliveryType === "domicile" ? address : "Retrait Bureau Yalidine",
          deliveryType: deliveryType === "domicile" ? "🏠 À Domicile" : "🏢 Au Bureau (Agence Yalidine)",
          items: itemsSummary,
          totalPrice: totalAmount,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(`🚨 Transmission Telegram échouée : ${errData.error}`);
        return;
      }

      // 💾 Enregistrement historique local dans l'Admin comme avant
      const currentOrders = JSON.parse(localStorage.getItem("maisssty_orders") || "[]");
      
      const newOrder = {
        id: "CMD-" + Date.now().toString().slice(-6),
        firstName,
        lastName,
        phone,
        wilaya,
        deliveryType,
        commune: deliveryType === "domicile" ? commune : "N/A (Retrait Agence)",
        address: deliveryType === "domicile" ? address : "N/A (Retrait Agence)",
        total: totalAmount,
        itemsSummary,
        date: new Date().toLocaleDateString("fr-FR")
      };

      localStorage.setItem("maisssty_orders", JSON.stringify([newOrder, ...currentOrders]));
      
      alert("✨ Votre commande a été enregistrée avec succès ! Notre équipe va vous appeler sur votre mobile pour confirmer l'expédition.");
      clearCart();
      window.location.href = "/";

    } catch (error: any) {
      alert(`❌ Erreur réseau lors de la communication : ${error.message}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF6F3] flex flex-col items-center justify-center p-6 text-center font-inter">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-[#F0DDD8] mb-4 text-[#8B6860]">
          <ShoppingBag size={24} />
        </div>
        <h2 className="font-playfair text-lg font-bold text-[#2C1810]">Votre panier Maisssty is vide</h2>
        <p className="text-xs text-[#8B6860] mt-1 max-w-xs">Découvrez nos collections pour ajouter vos parfums et sacs préférés.</p>
        <a href="/boutique" className="mt-6 bg-black text-white px-6 py-3 text-xs uppercase tracking-wider font-semibold">Retour à la boutique</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6F3] text-[#2C1810] font-inter py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {step === "cart" ? (
          /* ÉTAPE 1 : RÉCAPITULATIF DU PANIER */
          <div className="bg-white rounded-2xl border border-[#F0DDD8] p-6 shadow-sm space-y-6">
            <h2 className="font-playfair text-xl font-bold flex items-center gap-2"><ShoppingBag size={18} /> Votre Panier ({items.length})</h2>
            
            <div className="divide-y divide-[#F0DDD8] border-y border-[#F0DDD8]">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-4">
                    <img src={item.img} alt="" className="w-16 h-16 rounded-xl object-cover border" />
                    <div>
                      <h3 className="font-playfair font-bold text-sm">{item.name}</h3>
                      <p className="text-[#8B6860] text-[11px] mt-0.5">{item.price.toLocaleString()} DA</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center border border-[#F0DDD8] bg-[#FDF6F3] rounded">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-[#8B6860] hover:text-black"><Minus size={12} /></button>
                      <span className="px-3 font-bold text-sm">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-[#8B6860] hover:text-black"><Plus size={12} /></button>
                    </div>
                    
                    <p className="font-bold text-sm w-24 text-right">{(item.price * item.quantity).toLocaleString()} DA</p>
                    
                    <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-end space-y-4 pt-2">
              <div className="text-right">
                <p className="text-xs text-[#8B6860] uppercase tracking-wider">Montant total hors livraison :</p>
                <p className="text-2xl font-bold font-playfair text-[#2C1810] mt-1">{totalPrice().toLocaleString()} DA</p>
              </div>

              <button 
                onClick={() => setStep("checkout")}
                className="w-full sm:w-72 bg-black text-white py-3.5 font-inter text-[11px] font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-900 transition-colors"
              >
                Lancer la commande <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* ÉTAPE 2 : FORMULAIRE DYNAMIQUE DE LIVRAISON */
          <div className="bg-white rounded-2xl border border-[#F0DDD8] overflow-hidden shadow-sm animate-fade-in">
            <div className="bg-[#2C1810] text-white p-6">
              <h2 className="font-playfair text-lg font-bold">Informations de livraison</h2>
              <p className="text-[11px] text-[#C9A96E] uppercase tracking-wider mt-1">Expédition rapide par Yalidine Express</p>
            </div>

            <form onSubmit={handleConfirmOrder} className="p-6 space-y-5 text-xs">
              
              {/* Commutateur de Type de Livraison */}
              <div>
                <label className="block font-bold uppercase tracking-wider mb-2 text-[#8B6860]">Mode de réception de votre colis</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    onClick={() => setDeliveryType("domicile")}
                    className={`py-3 rounded border font-semibold uppercase tracking-wider transition-all cursor-pointer ${deliveryType === "domicile" ? "border-black bg-black text-white" : "border-[#F0DDD8] bg-white text-[#8B6860]"}`}
                  >
                    🏠 À Domicile
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setDeliveryType("bureau")}
                    className={`py-3 rounded border font-semibold uppercase tracking-wider transition-all cursor-pointer ${deliveryType === "bureau" ? "border-black bg-black text-white" : "border-[#F0DDD8] bg-white text-[#8B6860]"}`}
                  >
                    🏢 Au Bureau (Agence)
                  </button>
                </div>
              </div>

              {/* Informations Personnelles */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1 text-[#8B6860]">Nom *</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Votre nom" className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded outline-none bg-[#FDF6F3] focus:border-black" required />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1 text-[#8B6860]">Prénom *</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Votre prénom" className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded outline-none bg-[#FDF6F3] focus:border-black" required />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-1 text-[#8B6860]">Numéro de téléphone mobile *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ex: 0550XXXXXX" className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded outline-none bg-[#FDF6F3] focus:border-black font-mono text-sm font-bold" required />
              </div>

              {/* 📊 MENU DÉROULANT DES 58 WILAYAS */}
              <div>
                <label className="block font-bold uppercase tracking-wider mb-1 text-[#8B6860]">Wilaya de destination *</label>
                <select 
                  value={wilaya} 
                  onChange={(e) => setWilaya(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded outline-none bg-[#FDF6F3] focus:border-black font-medium"
                  required
                >
                  <option value="">-- Sélectionnez votre Wilaya --</option>
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* 🏠 CHAMPS COMPLÉMENTAIRES DYNAMIQUES */}
              {deliveryType === "domicile" && (
                <div className="space-y-5 border-l-2 border-[#2C1810] pl-4 pt-1 animate-fade-in">
                  <div>
                    <label className="block font-bold uppercase tracking-wider mb-1 text-[#8B6860]">Commune de livraison *</label>
                    <input 
                      type="text" 
                      value={commune} 
                      onChange={(e) => setCommune(e.target.value)} 
                      placeholder="Ex: Bab Ezzouar, Boumerdès Centre..." 
                      className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded outline-none bg-[#FDF6F3] focus:border-black" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider mb-1 text-[#8B6860]">Adresse résidentielle complète *</label>
                    <textarea 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder="N° de rue, quartier, bâtiment, numéro d'appartement..." 
                      rows={2}
                      className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded outline-none bg-[#FDF6F3] focus:border-black resize-none" 
                      required 
                    />
                  </div>
                </div>
              )}

              {/* Fin de formulaire et résumé de paiement */}
              <div className="pt-4 border-t border-[#F0DDD8] space-y-4">
                <div className="flex items-center gap-2 text-green-800 bg-green-50 p-3 rounded border border-green-200">
                  <ShieldCheck size={16} />
                  <p className="font-medium text-[11px]">Paiement en espèces à la réception du colis. Total : <span className="font-bold">{totalPrice().toLocaleString()} DA</span></p>
                </div>

                <div className="flex justify-between gap-4">
                  <button type="button" onClick={() => setStep("cart")} className="px-4 py-3 border border-[#F0DDD8] rounded font-semibold uppercase tracking-wider text-[#8B6860]">Retour</button>
                  <button type="submit" className="flex-grow bg-[#2C1810] text-white py-3.5 font-inter text-[11px] font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-black transition-colors">Confirmer ma commande</button>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}