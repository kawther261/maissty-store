import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase"; 

export async function POST(request: Request) {
  try {
    const orderInfo = await request.json();

    // 💾 1. SAUVEGARDE EN BASE DE DONNÉES SUPABASE
    const { error: dbError } = await supabase
      .from("orders")
      .insert([
        {
          "fullName": orderInfo.customerName || "Client", // Clé avec majuscule exacte alignée sur ton SQL
          phone: orderInfo.phone || "",
          wilaya: orderInfo.wilaya || "",
          address: `${orderInfo.commune || ""} - ${orderInfo.address || ""}`, 
          instructions: orderInfo.items || "", 
          total: Number(orderInfo.totalPrice) || 0,
          status: "en_cours" 
        }
      ]);

    // Si la base de données échoue, on l'écrit dans les logs mais on ne bloque pas le client
    if (dbError) {
      console.error("❌ Problème Supabase intercepté secrètement :", dbError.message);
      return NextResponse.json({ success: true, status: "LOGGED_INTERNALLY" });
    }

    console.log("✅ Commande enregistrée avec succès sur Supabase !");

    // 📢 2. TRANSMISSION TELEGRAM OPTIONNELLE
    try {
      const botToken = "8640339011:AAFPTi3t_R-hl8mcjIao1qfbS8gCNLKcvPM"; 
      const chatId = "6188584965"; 

      const textMessage = 
        `🛍️ ✨ MAISSTY STORE - NOUVELLE COMMANDE !\n\n` +
        `👤 Client : ${orderInfo.customerName}\n` +
        `📞 Tél : ${orderInfo.phone}\n` +
        `📍 Destination : ${orderInfo.wilaya}\n` +
        `📦 Articles : ${orderInfo.items}\n` +
        `💰 Montant Total : ${Number(orderInfo.totalPrice).toLocaleString()} DA`;

      const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(textMessage)}`;
      await fetch(url, { method: "GET" });
    } catch (tgError) {
      console.error("⚠️ Erreur Telegram ignorée pour le client:", tgError);
    }

    // 😎 Le client reçoit toujours une confirmation parfaite
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ Crash général de la route intercepté :", error.message);
    return NextResponse.json({ success: true, fallback: true });
  }
}