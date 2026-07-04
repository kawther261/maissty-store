import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

      // Étape 1 : On tente de chercher par ID direct (si c'est un texte/UUID/CUID)
      try {
        product = await prisma.product.findUnique({
          where: { id: idParam },
          include: { category: true }
        });
      } catch (e) {}

      // Étape 2 : Si rien n'est trouvé et que c'est un nombre, on tente la conversion en entier (Int)
      if (!product && /^\d+$/.test(idParam)) {
        try {
          product = await prisma.product.findUnique({
            where: { id: parseInt(idParam, 10) as any },
            include: { category: true }
          });
        } catch (e) {}
      }

      // Étape 3 : Si toujours rien, on cherche par le Slug textuel
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

    // ⚡ LOGIQUE BOUTIQUE GLOBALE
    const products = await prisma.product.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { category: true } 
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}