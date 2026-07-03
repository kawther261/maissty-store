"use client";
import { useState, useEffect } from "react";
import { ShoppingBag, MapPin, Phone, User, CheckCircle, Home, Building } from "lucide-react";

// 🤖 1. LA FONCTION TELEGRAM DIRECTE (MÉTHODE LINK)
const sendTelegramOrderAlert = async (orderInfo: {
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  deliveryType: string;
  items: string;
  totalPrice: number;
}) => {
  const botToken = "8640339011:AAFPTi3t_R-hl8mcjIao1qfbS8gCNLKcvPM"; 
  const chatId = "6188584965"; 

  const textMessage = 
    `🛍️ ✨ MAISSTY STORE - NOUVELLE COMMANDE !\n\n` +
    `👤 Client : ${orderInfo.customerName}\n` +
    `📞 Tél : ${orderInfo.phone}\n` +
    `📍 Destination : ${orderInfo.wilaya} - ${orderInfo.commune}\n` +
    `🏠 Mode : ${orderInfo.deliveryType === "domicile" ? "🏠 Domicile" : "🏢 Retrait Bureau"}\n` +
    `📍 Adresse : ${orderInfo.address || "Retrait Agence"}\n\n` +
    `📦 Articles : ${orderInfo.items}\n` +
    `💰 Montant Total : ${orderInfo.totalPrice.toLocaleString()} DA\n\n` +
    `⚡ Va vite sur ton Admin pour préparer le colis !`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(textMessage)}`;

  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      const errData = await res.json();
      alert(`🚨 Telegram a refusé le message : ${errData.description}`);
    } else {
      console.log("🚀 Envoyé à Telegram !");
    }
  } catch (error: any) {
    alert(`❌ Le navigateur a bloqué la requête Telegram : ${error.message}`);
  }
};

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isOrdered, setIsOrdered] = useState(false);

  // Formulaire
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("domicile"); 

  // Charger le panier local de la boutique
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("maisssty_cart") || localStorage.getItem("maissty_cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        // Mode démo si le panier est vide
        setCartItems([
          { id: "demo1", name: "Louis Vuitton Capucine", price: 11000, quantity: 1 }
        ]);
      }
    } catch (e) {
      console.error("Erreur panier", e);
    }
  }, []);

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  // ⚡ ACTION DE SOUUMISSION DU FORMULAIRE PROTEGEE
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Protection 1 : Champs vides
    if (!firstName || !lastName || !phone || !wilaya || !commune) {
      alert("⚠️ Attention : Tu dois remplir toutes les cases obligatoires !");
      return;
    }

    try {
      // Protection 2 : Panier vide ou mal structuré
      if (!cartItems || cartItems.length === 0) {
        alert("⚠️ Ton panier semble vide. Ajoute un article avant de tester.");
        return;
      }

      const itemsSummary = cartItems
        .map((item) => `${item.name || "Produit"} (x${item.quantity || 1})`)
        .join(", ");

      const newOrder = {
        id: "ORDER-" + Date.now().toString(),
        firstName,
        lastName,
        phone,
        wilaya,
        commune,
        address: deliveryType === "domicile" ? address : "Retrait Bureau",
        deliveryType,
        itemsSummary,
        total,
        status: "en_cours" 
      };

      // Sauvegarde locale pour l'Admin
      const savedOrders = localStorage.getItem("maisssty_orders");
      const currentOrders = savedOrders ? JSON.parse(savedOrders) : [];
      localStorage.setItem("maisssty_orders", JSON.stringify([newOrder, ...currentOrders]));

      // 🔥 ENVOI TELEGRAM
      await sendTelegramOrderAlert({
        customerName: `${lastName.toUpperCase()} ${firstName}`,
        phone,
        wilaya,
        commune,
        address: deliveryType === "domicile" ? address : "Retrait Bureau",
        deliveryType,
        items: itemsSummary,
        totalPrice: total
      });

      // Vider le panier et valider l'écran
      localStorage.removeItem("maisssty_cart");
      localStorage.removeItem("maissty_cart");
      setIsOrdered(true);

    } catch (crashError: any) {
      // 🚨 Si le code plante, cette alerte te dira EXACTEMENT quelle ligne pose problème !
      alert(`🚨 Le code a crashé avant l'envoi ! Raison : ${crashError.message}`);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-[#FDF6F3] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-[#F0DDD8] text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle size={24} /></div>
          <h2 className="font-playfair text-xl font-bold">Commande Réussie !</h2>
          <p className="text-xs text-[#8B6860]">Vérifie maintenant ton application Telegram !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6F3] text-[#2C1810] font-inter py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#F0DDD8] shadow-xs">
        <h2 className="font-playfair text-lg font-bold uppercase tracking-wider mb-6">Finaliser la Commande Maissty</h2>
        
        <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom de famille" className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded-xl outline-none bg-[#FDF6F3]/40" required />
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom" className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded-xl outline-none bg-[#FDF6F3]/40" required />
          </div>

          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Numéro de Téléphone (Ex: 0550112233)" className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded-xl outline-none bg-[#FDF6F3]/40 font-mono" required />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={wilaya} onChange={(e) => setWilaya(e.target.value)} placeholder="Wilaya (Ex: Alger)" className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded-xl outline-none bg-[#FDF6F3]/40" required />
            <input type="text" value={commune} onChange={(e) => setCommune(e.target.value)} placeholder="Commune" className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded-xl outline-none bg-[#FDF6F3]/40" required />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={() => setDeliveryType("domicile")} className={`py-2.5 rounded-xl border font-medium transition-all ${deliveryType === "domicile" ? "bg-black text-white" : "bg-neutral-50"}`}>🏠 Domicile</button>
            <button type="button" onClick={() => setDeliveryType("bureau")} className={`py-2.5 rounded-xl border font-medium transition-all ${deliveryType === "bureau" ? "bg-black text-white" : "bg-neutral-50"}`}>🏢 Bureau Yalidine</button>
          </div>

          {deliveryType === "domicile" && (
            <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Adresse complète (N° de rue, quartier...)" className="w-full px-3 py-2.5 border border-[#F0DDD8] rounded-xl outline-none bg-[#FDF6F3]/40" required></textarea>
          )}

          <div className="bg-[#FDF6F3] p-3 rounded-xl border text-[11px] font-bold flex justify-between items-center my-4">
            <span>Total à payer :</span>
            <span className="text-sm font-black">{total.toLocaleString()} DA</span>
          </div>

          <button type="submit" className="w-full bg-black text-white py-3.5 rounded-xl uppercase font-bold tracking-wider cursor-pointer hover:bg-neutral-900 transition-colors">
            🔥 Confirmer et Envoyer la Commande
          </button>
        </form>
      </div>
    </div>
  );
}