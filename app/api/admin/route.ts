import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const COEUR_ARTICLES = [
  // --- ZONE IMAGE_895FB8.JPG (PRODUITS 1 À 9) ---
  {
    id: "prod-1",
    name: "Blush Poudre Dior Backstage Rosy Glow",
    price: 3500,
    shortDesc: "Le blush poudre iconique révélateur de couleur.",
    description: "Le blush poudre iconique révélateur de couleur.",
    images: ["/produits/1.jpg", "/produits/1'.jpg"],
    img: "/produits/1.jpg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-2",
    name: "Blush Make Me Blush YSL - Teinte 06",
    price: 2600,
    shortDesc: "Un blush floutant haut de gamme au fini mat velouté.",
    description: "Un blush floutant haut de gamme au fini mat velouté.",
    images: ["/produits/2 (2).jpg", "/produits/2'.jpg"],
    img: "/produits/2 (2).jpg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-3",
    name: "Dior Forever Cushion Case - Leather Cannage",
    price: 4500,
    shortDesc: "Boîtier compact couture en cuir noir signé CD.",
    description: "Boîtier compact couture en cuir noir signé CD.",
    images: ["/produits/3.jpg", "/produits/3'.jpg"],
    img: "/produits/3.jpg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-4",
    name: "Dior Forever Cushion Powder - Pink Limited",
    price: 4800,
    shortDesc: "Poudre libre fixatrice boîtier tissu cannage rose.",
    description: "Poudre libre fixatrice boîtier tissu cannage rose.",
    images: ["/produits/4.jpg", "/produits/4'.jpg"],
    img: "/produits/4.jpg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-5",
    name: "Dior Addict Lip Glow & Maximizer Mini Set",
    price: 5500,
    shortDesc: "Trousse découverte multi-teintes miniatures.",
    description: "Trousse découverte multi-teintes miniatures.",
    images: ["/produits/5.jpg", "/produits/5'.jpg"],
    img: "/produits/5.jpg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-6",
    name: "Coffret Miniatures Parfums Hermès",
    price: 7500,
    shortDesc: "Set de collection de fragrances de luxe Hermès.",
    description: "Set de collection de fragrances de luxe Hermès.",
    images: ["/produits/6.jpeg", "/produits/6'.jpeg"],
    img: "/produits/6.jpeg",
    category: "parfums",
    stock: 99
  },
  {
    id: "prod-7",
    name: "Pochette Maquillage Dior Floral Brodée",
    price: 6000,
    shortDesc: "Trousse de beauté luxe en édition limitée broderie fleurs.",
    description: "Trousse de beauté luxe en édition limitée broderie fleurs.",
    images: ["/produits/7.jpeg", "/produits/7'.jpeg"],
    img: "/produits/7.jpeg",
    category: "accessoires",
    stock: 99
  },
  {
    id: "prod-8",
    name: "Sac Pouch Rond Tissu Quilté Dior",
    price: 6500,
    shortDesc: "Mini sac pochette rond avec détails de couture.",
    description: "Mini sac pochette rond avec détails de couture.",
    images: ["/produits/8.jpeg", "/produits/8'.jpeg"],
    img: "/produits/8.jpeg",
    category: "accessoires",
    stock: 99
  },
  {
    id: "prod-9",
    name: "Kayali Miniature Fragrance Discovery Set",
    price: 8500,
    shortDesc: "Coffret de 4 parfums d'ambiance et de sillage Kayali.",
    description: "Coffret de 4 parfums d'ambiance et de sillage Kayali.",
    images: ["/produits/9.jpeg", "/produits/9'.jpeg"],
    img: "/produits/9.jpeg",
    category: "parfums",
    stock: 99
  },

  // --- ZONE IMAGE_896050.JPG (PRODUITS 10 À 21) ---
  {
    id: "prod-10",
    name: "Dior Skincare & Glow Trio Set",
    price: 5200,
    shortDesc: "Kit de routine éclat et miniatures soins Dior.",
    description: "Kit de routine éclat et miniatures soins Dior.",
    images: ["/produits/10.jpeg", "/produits/10'.jpeg"],
    img: "/produits/10.jpeg",
    category: "soins",
    stock: 99
  },
  {
    id: "prod-11",
    name: "Accessoire Luxe Dior Emballé Ruban",
    price: 2900,
    shortDesc: "Édition limitée sous emballage cadeau officiel.",
    description: "Édition limitée sous emballage cadeau officiel.",
    images: ["/produits/11.jpeg"],
    img: "/produits/11.jpeg",
    category: "accessoires",
    stock: 99
  },
  {
    id: "prod-12",
    name: "Huda Beauty Easy Bake Loose Powder",
    price: 4100,
    shortDesc: "Poudre libre fixatrice fini mat velouté.",
    description: "Poudre libre fixatrice fini mat velouté.",
    images: ["/produits/12.jpeg"],
    img: "/produits/12.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-13",
    name: "Sac Seau Quilté Monogramme CD Gold",
    price: 12000,
    shortDesc: "Sac à main style seau haut de gamme avec chaîne dorée.",
    description: "Sac à main style seau haut de gamme avec chaîne dorée.",
    images: ["/produits/13.jpeg", "/produits/13'.jpeg"],
    img: "/produits/13.jpeg",
    category: "accessoires",
    stock: 99
  },
  {
    id: "prod-14",
    name: "Porte-cartes Enveloppe Cuir Rose Luxury",
    price: 4500,
    shortDesc: "Petit portefeuille compact de luxe couleur pastel.",
    description: "Petit portefeuille compact de luxe couleur pastel.",
    images: ["/produits/14.jpeg"],
    img: "/produits/14.jpeg",
    category: "accessoires",
    stock: 99
  },
  {
    id: "prod-15",
    name: "Pochette Cuir Noir Monogramme Prestige",
    price: 5800,
    shortDesc: "Pochette de rangement ou soirée en cuir embossé noir.",
    description: "Pochette de rangement ou soirée en cuir embossé noir.",
    images: ["/produits/15.jpeg"],
    img: "/produits/15.jpeg",
    category: "accessoires",
    stock: 99
  },
  {
    id: "prod-16",
    name: "Portefeuille Long Blanc Multicolore Style LV",
    price: 6200,
    shortDesc: "Compagnon zippé en toile monogramme colorée.",
    description: "Compagnon zippé en toile monogramme colorée.",
    images: ["/produits/16.jpeg"],
    img: "/produits/16.jpeg",
    category: "accessoires",
    stock: 99
  },
  {
    id: "prod-17",
    name: "Sac à Main Top-Handle Monogramme Blanc & Rose",
    price: 14500,
    shortDesc: "Sac rigide de luxe style Alma avec bandoulière.",
    description: "Sac à main rigide de luxe avec finitions blush.",
    images: ["/produits/17.jpeg", "/produits/17'.jpeg", "/produits/17''.jpeg"],
    img: "/produits/17.jpeg",
    category: "accessoires",
    stock: 99
  },
  {
    id: "prod-18",
    name: "Coffret Miniature Parfums de Prestige Collection",
    price: 8900,
    shortDesc: "Set de 4 flacons de collection haute parfumerie.",
    description: "Set de 4 flacons de collection haute parfumerie.",
    images: ["/produits/18.jpeg", "/produits/18'.jpeg"],
    img: "/produits/18.jpeg",
    category: "parfums",
    stock: 99
  },
  {
    id: "prod-19",
    name: "YSL Luxury Cheek & Blush Face Palette",
    price: 5400,
    shortDesc: "Palette de fards à joues boîtier cuir chevron matelassé rose.",
    description: "Palette multi-teintes fards à joues haut de gamme YSL.",
    images: ["/produits/19.jpeg", "/produits/19'.jpeg", "/produits/19''.jpeg"],
    img: "/produits/19.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-20",
    name: "Sol de Janeiro Hair & Body Mist Discovery Set",
    price: 4900,
    shortDesc: "Coffret de brumes parfumées iconiques brésiliennes.",
    description: "Coffret de brumes parfumées iconiques brésiliennes.",
    images: ["/produits/20.jpeg", "/produits/20''.jpeg"],
    img: "/produits/20.jpeg",
    category: "parfums",
    stock: 99
  },
  {
    id: "prod-21",
    name: "Dior Skincare Capture Totale / Mist Set",
    price: 5600,
    shortDesc: "Duo soin de peau éclat et brume fraîcheur.",
    description: "Duo soin de peau éclat et brume fraîcheur.",
    images: ["/produits/21.jpeg", "/produits/21'.jpeg"],
    img: "/produits/21.jpeg",
    category: "soins",
    stock: 99
  },

  // --- ZONE IMAGE_896317.JPG (PRODUITS 22 À 33) ---
  {
    id: "prod-22",
    name: "Charlotte Tilbury Pillow Talk Face Palette",
    price: 5800,
    shortDesc: "Palette teint et joues éclat boîtier rose gold stellaire.",
    description: "Palette teint et joues éclat boîtier rose gold stellaire.",
    images: ["/produits/22.jpeg", "/produits/22'.jpeg"],
    img: "/produits/22.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-23",
    name: "Dior Backstage Rosy Glow Blush",
    price: 3100,
    shortDesc: "Le blush révélateur de couleur naturelle réactif au pH.",
    description: "Le blush révélateur de couleur naturelle réactif au pH.",
    images: ["/produits/23.jpeg"],
    img: "/produits/23.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-24",
    name: "Charlotte Tilbury Airbrush Flawless Foundation",
    price: 4600,
    shortDesc: "Teint haute couvrance et fini mat naturel longue tenue.",
    description: "Teint haute couvrance et fini mat naturel longue tenue.",
    images: ["/produits/24.jpeg"],
    img: "/produits/24.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-25",
    name: "Dior Forever Foundation & Lipstick Gift Box",
    price: 6800,
    shortDesc: "Coffret maquillage teint parfait et lèvres couture.",
    description: "Coffret maquillage teint parfait et lèvres couture.",
    images: ["/produits/25.jpeg", "/produits/25'.jpeg"],
    img: "/produits/25.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-26",
    name: "Prestige Mini Lipsticks Collection Box",
    price: 7200,
    shortDesc: "Écrin d'art contenant un assortiment de rouges à lèvres.",
    description: "Écrin d'art contenant un assortiment de rouges à lèvres.",
    images: ["/produits/26.jpeg"],
    img: "/produits/26.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-27",
    name: "YSL Make Me Blush Compact - Peachy Pink",
    price: 3400,
    shortDesc: "Blush compact boîtier rond matelassé rose.",
    description: "Blush compact boîtier rond matelassé rose.",
    images: ["/produits/27.jpeg", "/produits/27'.jpeg"],
    img: "/produits/27.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-28",
    name: "YSL Make Me Blush Compact - Radiant Fuchsia",
    price: 3400,
    shortDesc: "Fard à joues haut de gamme boîtier rond siglé or YSL.",
    description: "Fard à joues haut de gamme boîtier rond siglé or YSL.",
    images: ["/produits/28.jpeg", "/produits/28'.jpeg"],
    img: "/produits/28.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-29",
    name: "YSL Make Me Blush Compact - Coral Glow",
    price: 3400,
    shortDesc: "Poudre joues texture veloutée boîtier couture.",
    description: "Poudre joues texture veloutée boîtier couture.",
    images: ["/produits/29.jpeg", "/produits/29'.jpeg"],
    img: "/produits/29.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-30",
    name: "Dior Backstage Glow Face Palette",
    price: 4900,
    shortDesc: "Palette d'enlumineurs et fards 4 quadrants multi-usage.",
    description: "Palette d'enlumineurs et fards 4 quadrants multi-usage.",
    images: ["/produits/30.jpeg", "/produits/30'.jpeg"],
    img: "/produits/30.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-31",
    name: "Dior Mono Couleur Couture Eyeshadow",
    price: 2800,
    shortDesc: "Fard à paupières ou joues individuel haute pigmentation.",
    description: "Fard à paupières ou joues individuel haute pigmentation.",
    images: ["/produits/31.jpeg", "/produits/31'.jpeg"],
    img: "/produits/31.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-32",
    name: "YSL All Hours Compact Powder",
    price: 4200,
    shortDesc: "Poudre de finition ou bronzante boîtier cuir marron.",
    description: "Poudre de finition ou bronzante boîtier cuir marron.",
    images: ["/produits/32.jpeg", "/produits/32'.jpeg"],
    img: "/produits/32.jpeg",
    category: "maquillage",
    stock: 99
  },
  {
    id: "prod-33",
    name: "Charlotte Tilbury Heart Blush Glow Duo",
    price: 3900,
    shortDesc: "Duo enlumineur et blush en forme de cœur romantique.",
    description: "Duo enlumineur et blush en forme de cœur romantique.",
    images: ["/produits/33.jpeg"],
    img: "/produits/33.jpeg",
    category: "maquillage",
    stock: 99
  },

  // --- ZONE DE RÉSERVE (34 À 43) ---
  { id: "prod-34", name: "Article Sélection Luxe 34", price: 3000, shortDesc: "Produit de beauté.", description: "A venir.", images: ["/produits/34.jpeg"], img: "/produits/34.jpeg", category: "maquillage", stock: 99 },
  { id: "prod-35", name: "Article Sélection Luxe 35", price: 3000, shortDesc: "Produit de beauté.", description: "A venir.", images: ["/produits/35.jpeg"], img: "/produits/35.jpeg", category: "maquillage", stock: 99 },
  { id: "prod-36", name: "Article Sélection Luxe 36", price: 3000, shortDesc: "Produit de beauté.", description: "A venir.", images: ["/produits/36.jpeg"], img: "/produits/36.jpeg", category: "maquillage", stock: 99 },
  { id: "prod-37", name: "Article Sélection Luxe 37", price: 3000, shortDesc: "Produit de beauté.", description: "A venir.", images: ["/produits/37.jpeg"], img: "/produits/37.jpeg", category: "maquillage", stock: 99 },
  { id: "prod-38", name: "Article Sélection Luxe 38", price: 3000, shortDesc: "Produit de beauté.", description: "A venir.", images: ["/produits/38.jpeg"], img: "/produits/38.jpeg", category: "maquillage", stock: 99 },
  { id: "prod-39", name: "Article Sélection Luxe 39", price: 3000, shortDesc: "Produit de beauté.", description: "A venir.", images: ["/produits/39.jpeg"], img: "/produits/39.jpeg", category: "maquillage", stock: 99 },
  { id: "prod-40", name: "Article Sélection Luxe 40", price: 3000, shortDesc: "Produit de beauté.", description: "A venir.", images: ["/produits/40.jpeg"], img: "/produits/40.jpeg", category: "maquillage", stock: 99 },
  { id: "prod-41", name: "Article Sélection Luxe 41", price: 3000, shortDesc: "Produit de beauté.", description: "A venir.", images: ["/produits/41.jpeg"], img: "/produits/41.jpeg", category: "maquillage", stock: 99 },
  { id: "prod-42", name: "Article Sélection Luxe 42", price: 3000, shortDesc: "Produit de beauté.", description: "A venir.", images: ["/produits/42.jpeg"], img: "/produits/42.jpeg", category: "maquillage", stock: 99 },
  { id: "prod-43", name: "Article Sélection Luxe 43", price: 3000, shortDesc: "Produit de beauté.", description: "A venir.", images: ["/produits/43.jpeg"], img: "/produits/43.jpeg", category: "maquillage", stock: 99 },

  // --- ZONE IMAGE_896353.JPG (PRODUITS 44 À 46) ---
  {
    id: "prod-44",
    name: "Tom Ford Private Blend Fragrance Set",
    price: 13500,
    shortDesc: "Coffret d'exception contenant 4 flacons signatures Tom Ford.",
    description: "Coffret d'exception contenant 4 flacons signatures Tom Ford.",
    images: ["/produits/44.jpeg", "/produits/44'.jpeg"],
    img: "/produits/44.jpeg",
    category: "parfums",
    stock: 99
  },
  {
    id: "prod-45",
    name: "One Step Hair Dryer & Volumizer Styler (Pink)",
    price: 4500,
    shortDesc: "Brosse soufflante et coiffante rotative avec gant thermique.",
    description: "Brosse séchante, lissante et volumisante fushia et noire.",
    images: ["/produits/45.jpeg", "/produits/45'.jpeg", "/produits/45''.jpg"],
    img: "/produits/45.jpeg",
    category: "appareils",
    stock: 99
  },
  {
    id: "prod-46",
    name: "One Step Pro Air Styler Brush (Green Premium)",
    price: 4900,
    shortDesc: "Brosse chauffante lissante professionnelle couleur vert émeraude.",
    description: "Brosse chauffante lissante professionnelle couleur vert émeraude.",
    images: ["/produits/46.jpeg", "/produits/46'.jpg"],
    img: "/produits/46.jpeg",
    category: "appareils",
    stock: 99
  }
];

export async function GET() {
  try {
    let orders: any[] = [];
    try {
      const rawOrders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
      orders = rawOrders.map(o => ({
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
    } catch (dbError) {
      console.error("Base de données injoignable pour le tableau admin", dbError);
    }

    return NextResponse.json({ products: COEUR_ARTICLES, orders });
  } catch (error: any) {
    return NextResponse.json({ products: COEUR_ARTICLES, orders: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (action === "SAVE_PRODUCT") {
      return NextResponse.json({ success: true, message: "Modifie le fichier local !" });
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

    return NextResponse.json({ error: "Action non gérée" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}