import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 🌟 NOS PRODUITS DE SECOURS SI LA BASE DE DONNÉES EST VIDE
const MOCK_PRODUCTS = [
  {
    id: "dior-blush",
    slug: "dior-blush",
    name: "Blush Poudre Dior Backstage Rosy Glow",
    price: 2500,
    shortDesc: "Le blush poudre iconique révélateur de couleur qui réagit à l'humidité de la peau pour offrir un effet bonne mine sur mesure.",
    images: ["https://images.unsplash.com/photo-1631214524020-5e18d976523b?w=600"],
    category: "maquillage"
  },
  {
    id: "ysl-blush",
    slug: "ysl-blush",
    name: "Blush Make Me Blush YSL - Teinte 06",
    price: 2600,
    shortDesc: "Un blush floutant haut de gamme au fini mat velouté pour rehausser les joues d'un éclat corail frais et élégant.",
    images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600"],
    category: "maquillage"
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id") || searchParams.get("slug");

    // ⚡ 1. RECHERCHE D'UN PRODUIT UNIQUE
    if (idParam) {
      let product: any = null;

      try {
        product = await prisma.product.findUnique({
          where: { id: idParam },
          include: { category: true }
        });
      } catch (e) {}

      if (!product) {
        try {
          product = await prisma.product.findFirst({
            where: { slug: idParam },
            include: { category: true }
          });
        } catch (e) {}
      }

      // Sécurité fallback
      if (!product) {
        product = MOCK_PRODUCTS.find(p => p.id === idParam || p.slug === idParam) || null;
      }

      return NextResponse.json({ product });
    }

    // ⚡ 2. RECHERCHE DE TOUS LES PRODUITS (BOUTIQUE)
    // ✨ LE FIX EST ICI : On ajoute ": any[]" pour satisfaire TypeScript !
    let products: any[] = [];
    try {
      products = await prisma.product.findMany({ 
        orderBy: { createdAt: 'desc' },
        include: { category: true } 
      });
    } catch (e) {
      console.error("Neon en attente, bascule sur les données de secours.");
    }

    if (!products || products.length === 0) {
      products = MOCK_PRODUCTS;
    }

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ products: MOCK_PRODUCTS });
  }
}