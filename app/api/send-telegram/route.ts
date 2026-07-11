import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase"; // 🔌 Connexion directe et sécurisée à Supabase

export async function POST(request: Request) {
  try {
    const orderInfo = await request.json();

    // 💾 1. SAUVEGARDE DIRECTE DANS TA TABLE SUPABASE
    try {
      const { error: dbError } = await supabase
        .from("orders")
        .insert([
          {
            fullName: orderInfo.customerName || "Client",
            phone: orderInfo.phone || "",
            wilaya: orderInfo.wilaya || "",
            address: `${orderInfo.commune} - ${orderInfo.address}`, 
            instructions: orderInfo.items || "", 
            total: Number(orderInfo.totalPrice) || 0,
            status: "en_cours" // Aligné avec ton nouveau système admin
          }
        ]);

      if (dbError) throw dbError;
      console.log("✅ Commande enregistrée avec succès sur Supabase !");
    } catch (dbError: any) {
      console.error("❌ Erreur de sauvegarde Supabase:", dbError.message);
      // On laisse tourner la suite pour que tu reçoives quand même le Telegram si la DB a un problème
    }

    // 📢 2. TRANSMISSION TELEGRAM (Toujours 100% fonctionnelle)
    const botToken = "8640339011:AAFPTi3t_R-hl8mcjIao1qfbS8gCNLKcvPM"; 
    const chatId = "6188584965"; 

    const textMessage = 
      `🛍️ ✨ MAISSTY STORE - NOUVELLE COMMANDE !\n\n` +
      `👤 Client : ${orderInfo.customerName}\n` +
      `📞 Tél : ${orderInfo.phone}\n` +
      `📍 Destination : ${orderInfo.wilaya} - ${orderInfo.commune}\n` +
      `🏠 Mode : ${orderInfo.deliveryType}\n` +
      `📍 Adresse : ${orderInfo.address}\n\n` +
      `📦 Articles : ${orderInfo.items}\n` +
      `💰 Montant Total : ${orderInfo.totalPrice.toLocaleString()} DA\n\n` +
      `⚡ Va vite sur ton Admin pour préparer le colis !`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(textMessage)}`;
    const res = await fetch(url, { method: "GET" });
    
    if (!res.ok) {
      const errData = await res.json();
      return NextResponse.json({ error: errData.description }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}