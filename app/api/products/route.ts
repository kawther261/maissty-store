import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

// 🛡️ On force le site à être toujours en direct, sans cache bloquant
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id") || searchParams.get("slug");

    // ⚡ 1. CHERCHER UN PRODUIT UNIQUE
    if (idParam) {
      let product = null;
      try {
        product = await prisma.product.findUnique({
          where: { id: idParam },
          include: { category: true }
        });
      } catch (e) {}

      if (!product && /^\d+$/.test(idParam)) {
        try {
          product = await prisma.product.findUnique({
            where: { id: parseInt(idParam, 10) as any },
            include: { category: true }
          });
        } catch (e) {}
      }

      if (!product) {
        try {
          product = await prisma.product.findFirst({
            where: { slug: idParam },
            include: { category: true }
          });
        } catch (e) {}
      }

      return NextResponse.json({ product });
    }

    // ⚡ 2. BOUTIQUE GLOBALE
    const products = await prisma.product.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { category: true } 
    });

    return NextResponse.json({ products });

  } catch (error: any) {
    console.error("Prisma error:", error.message);
    // En cas d'erreur de réveil, on renvoie un tableau vide plutôt qu'un crash 500
    return NextResponse.json({ products: [] });
  }
}