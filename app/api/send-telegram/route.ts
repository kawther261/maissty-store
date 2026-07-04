import { NextResponse } from "next/server";
// 🔌 Connexion à Prisma pour Neon Cloud
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request: Request) {
  try {
    const orderInfo = await request.json();

    // 💾 1. SAUVEGARDE DIRECTE DANS NEON CLOUD (Alignée sur ton schema.prisma)
    try {
      await prisma.order.create({
        data: {
          id: "ORD-" + Date.now().toString(),
          fullName: orderInfo.customerName || "Client",
          phone: orderInfo.phone || "",
          wilaya: orderInfo.wilaya || "",
          // ✨ Astuce : Comme ton schéma n'a pas de colonne "commune", on fusionne la commune et l'adresse pour ne rien perdre
          address: `${orderInfo.commune} - ${orderInfo.address}`, 
          instructions: orderInfo.items || "", // Contient la liste de tes articles en texte
          total: Number(orderInfo.totalPrice) || 0,
          status: "EN_ATTENTE" as any // Respecte l'enum de ton schéma
        }
      });
      console.log("✅ Commande enregistrée avec succès sur Neon Cloud !");
    } catch (dbError) {
      // Si la base de données a un problème, on l'affiche mais on ne bloque pas l'envoi du Telegram
      console.error("❌ Erreur de sauvegarde Neon:", dbError);
    }

    // 📢 2. TON CODE TELEGRAM D'ORIGINE (100% intact)
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