import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase"; 

export async function POST(request: Request) {
  try {
    const orderInfo = await request.json();

    // 💾 1. SAUVEGARDE DANS LA BASE DE DONNÉES SUPABASE
    const { error: dbError } = await supabase
      .from("orders")
      .insert([
        {
          id: "ORD-" + Date.now().toString(), // Identifiant unique requis par Supabase
          fullName: orderInfo.customerName || "Client",
          phone: orderInfo.phone || "",
          wilaya: orderInfo.wilaya || "",
          address: `${orderInfo.commune || ""} - ${orderInfo.address || ""}`, 
          instructions: orderInfo.items || "", 
          total: Number(orderInfo.totalPrice) || 0,
          status: "en_cours" 
        }
      ]);

    // Si la base de données échoue (vrai problème), on bloque l'utilisateur
    if (dbError) {
      console.error("❌ Erreur d'enregistrement Supabase :", dbError.message);
      return NextResponse.json({ success: false, error: `Supabase: ${dbError.message}` }, { status: 400 });
    }

    console.log("✅ Commande enregistrée avec succès sur Supabase !");

    // 📢 2. TRANSMISSION TELEGRAM (Isolée pour ne JAMAIS bloquer le client)
    try {
      const botToken = "8640339011:AAFPTi3t_R-hl8mcjIao1qfbS8gCNLKcvPM"; 
      const chatId = "6188584965"; 

      const textMessage = 
        `🛍️ ✨ MAISSTY STORE - NOUVELLE COMMANDE !\n\n` +
        `👤 Client : ${orderInfo.customerName}\n` +
        `📞 Tél : ${orderInfo.phone}\n` +
        `📍 Destination : ${orderInfo.wilaya} - ${orderInfo.commune || ""}\n` +
        `🏠 Mode : ${orderInfo.deliveryType || "Domicile"}\n` +
        `📍 Adresse : ${orderInfo.address || ""}\n\n` +
        `📦 Articles : ${orderInfo.items}\n` +
        `💰 Montant Total : ${Number(orderInfo.totalPrice).toLocaleString()} DA\n\n` +
        `⚡ Va vite sur ton Admin pour préparer le colis !`;

      const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(textMessage)}`;
      
      // On tente l'envoi mais on ignore l'échec si le token est invalide
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) {
        console.warn("⚠️ Telegram a refusé le message (Token invalide ou révoqué). Pas de problème, la commande est quand même sauvegardée en base de données !");
      }
    } catch (tgError) {
      // Évite le crash si problème de réseau ou d'API avec Telegram
      console.error("⚠️ Erreur réseau Telegram secondaire :", tgError);
    }

    // 😎 LE CLIENT VOIT TOUJOURS UN SUCCÈS SI LA DB EST MISE À JOUR
    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}