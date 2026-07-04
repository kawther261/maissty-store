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
    const slug = searchParams.get("slug");

    // ⚡ SI ON DEMANDE UN SEUL PRODUIT (URGENT POUR LA PAGE DÉTAIL)
    if (slug) {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true }
      });
      return NextResponse.json({ product });
    }

    // ⚡ LOGIQUE BOUTIQUE : ON NE CHARGE QUE LES PRODUITS (PAS LES COMMANDES)
    const products = await prisma.product.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { category: true } 
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}