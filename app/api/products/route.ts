import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id") || searchParams.get("slug");

    // ⚡ 1. SI ON CHERCHE UN PRODUIT UNIQUE (Pas de cache long pour les actions immédiates)
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

      return NextResponse.json({ product }, {
        headers: { 'Cache-Control': 'no-store, must-revalidate' }
      });
    }

    // ⚡ 2. BOUTIQUE GLOBALE : CACHE EDGE DE VERCEL (SECRET DE LA VITESSE INSTANTANÉE) 🏎️
    const products = await prisma.product.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { category: true } 
    });

    // On dit à Vercel de garder la liste en mémoire pendant 30 secondes.
    // Les requêtes suivantes répondront instantanément depuis le CDN.
    return NextResponse.json({ products }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}