import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 🔄 1. LIRE DEPUIS NEON ET TRADUIRE POUR TON DASHBOARD
export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    const rawOrders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    
    const orders = rawOrders.map(o => ({
      id: o.id,
      firstName: o.fullName,
      lastName: "",
      phone: o.phone,
      wilaya: o.wilaya,
      commune: "Disponible",
      address: o.address,
      deliveryType: "domicile",
      itemsSummary: o.instructions || "Articles",
      total: o.total,
      status: o.status === "LIVREE" ? "livre" : "en_cours"
    }));

    return NextResponse.json({ products, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 💾 2. ÉCRIRE / MODIFIER / SUPPRIMER SUR NEON
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (action === "SAVE_PRODUCT") {
      const generatedSlug = `${(data.name || "product").toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}-${Date.now()}`;

      const catName = (data.category || "parfums").trim();
      let category = await prisma.category.findFirst({
        where: { name: { equals: catName, mode: 'insensitive' } }
      });

      // ✨ BOUCLIER SÉCURITÉ DOUBLE-CLIC
      if (!category) {
        try {
          category = await prisma.category.create({
            data: { name: catName, slug: catName.toLowerCase().replace(/[\s_-]+/g, '-') }
          });
        } catch (createError) {
          // Si elle a été créée par un clic simultané, on la récupère simplement sans planter !
          category = await prisma.category.findFirst({
            where: { name: { equals: catName, mode: 'insensitive' } }
          });
        }
      }

      // Sécurité ultime au cas où
      if (!category) {
        return NextResponse.json({ error: "Erreur lors de la récupération de la catégorie." }, { status: 400 });
      }

      if (data.editingId) {
        const updated = await prisma.product.update({
          where: { id: data.editingId },
          data: {
            name: data.name,
            price: Number(data.price),
            shortDesc: data.shortDesc || "",
            description: data.shortDesc || "",
            images: data.images,
            categoryId: category.id,
            slug: generatedSlug,
            stock: 99
          }
        });
        return NextResponse.json({ success: true, product: updated });
      } else {
        const created = await prisma.product.create({
          data: {
            name: data.name,
            price: Number(data.price),
            shortDesc: data.shortDesc || "",
            description: data.shortDesc || "",
            images: data.images,
            categoryId: category.id,
            slug: generatedSlug,
            stock: 99
          }
        });
        return NextResponse.json({ success: true, product: created });
      }
    }

    if (action === "DELETE_PRODUCT") {
      await prisma.product.delete({ where: { id: data.id } });
      return NextResponse.json({ success: true });
    }

    if (action === "UPDATE_ORDER_STATUS") {
      const nextStatus = data.status === "livre" ? "LIVREE" : "EN_ATTENTE";
      await prisma.order.update({
        where: { id: data.id },
        data: { status: nextStatus as any }
      });
      return NextResponse.json({ success: true });
    }

    if (action === "DELETE_ORDER") {
      await prisma.order.delete({ where: { id: data.id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}