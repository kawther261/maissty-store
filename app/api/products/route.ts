import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ✨ LE FIX : On réutilise la même connexion entre les clics (Ultra rapide !)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id") || searchParams.get("slug");

    // ⚡ SI ON CHERCHE UN PRODUIT UNIQUE
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

    // ⚡ LOGIQUE BOUTIQUE GLOBALE : REQUÊTE DIRECTE ET RAPIDE
    const products = await prisma.product.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { category: true } 
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}