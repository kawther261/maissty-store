import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COEUR_ARTICLES = [
  {
    id: "prod-1",
    name: "Blush Poudre Dior Backstage Rosy Glow",
    price: 3500,
    category: "maquillage",
    img: "/produits/1.jpg",
    images: ["/produits/1.jpg", "/produits/1'.jpg"],
    shortDesc: "Le blush poudre iconique révélateur de couleur.",
    description: "Le blush poudre iconique révélateur de couleur.",
    stock: 99
  },
  {
    id: "prod-2",
    name: "Blush Make Me Blush YSL - Teinte 06",
    price: 2600,
    category: "maquillage",
    img: "/produits/2 (2).jpg",
    images: ["/produits/2 (2).jpg", "/produits/2'.jpg"],
    shortDesc: "Un blush floutant haut de gamme au fini mat velouté.",
    description: "Un blush floutant haut de gamme au fini mat velouté.",
    stock: 99
  },
  {
    id: "prod-3",
    name: "Dior Forever Cushion Case - Leather Cannage",
    price: 4500,
    category: "maquillage",
    img: "/produits/3.jpg",
    images: ["/produits/3.jpg", "/produits/3'.jpg"],
    shortDesc: "Boîtier compact couture en cuir noir signé CD.",
    description: "Boîtier compact couture en cuir noir signé CD.",
    stock: 99
  },
  {
    id: "prod-4",
    name: "Dior Forever Cushion Powder - Pink Limited",
    price: 4800,
    category: "maquillage",
    img: "/produits/4.jpg",
    images: ["/produits/4.jpg", "/produits/4'.jpg"],
    shortDesc: "Poudre libre fixatrice boîtier tissu cannage rose.",
    description: "Poudre libre fixatrice boîtier tissu cannage rose.",
    stock: 99
  },
  {
    id: "prod-5",
    name: "Dior Addict Lip Glow & Maximizer Mini Set",
    price: 5500,
    category: "maquillage",
    img: "/produits/5.jpg",
    images: ["/produits/5.jpg", "/produits/5'.jpg"],
    shortDesc: "Trousse découverte multi-teintes miniatures.",
    description: "Trousse découverte multi-teintes miniatures.",
    stock: 99
  },
  {
    id: "prod-6",
    name: "Coffret Miniatures Parfums Hermès",
    price: 7500,
    category: "parfums",
    img: "/produits/6.jpeg",
    images: ["/produits/6.jpeg", "/produits/6'.jpeg"],
    shortDesc: "Set de collection de fragrances de luxe Hermès.",
    description: "Set de collection de fragrances de luxe Hermès.",
    stock: 99
  },
  {
    id: "prod-7",
    name: "Pochette Maquillage Dior Floral Brodée",
    price: 6000,
    category: "sacs",
    img: "/produits/7.jpeg",
    images: ["/produits/7.jpeg", "/produits/7'.jpeg"],
    shortDesc: "Trousse de beauté luxe en édition limitée broderie fleurs.",
    description: "Trousse de beauté luxe en édition limitée broderie fleurs.",
    stock: 99
  },
  {
    id: "prod-8",
    name: "Sac Pouch Rond Tissu Quilté Dior",
    price: 6500,
    category: "sacs",
    img: "/produits/8.jpeg",
    images: ["/produits/8.jpeg", "/produits/8'.jpeg"],
    shortDesc: "Mini sac pochette rond avec détails de couture.",
    description: "Mini sac pochette rond avec détails de couture.",
    stock: 99
  },
  {
    id: "prod-9",
    name: "Kayali Miniature Fragrance Discovery Set",
    price: 8500,
    category: "parfums",
    img: "/produits/9.jpeg",
    images: ["/produits/9.jpeg", "/produits/9'.jpeg"],
    shortDesc: "Coffret de 4 parfums d'ambiance et de sillage Kayali.",
    description: "Coffret de 4 parfums d'ambiance et de sillage Kayali.",
    stock: 99
  },
  {
    id: "prod-10",
    name: "Dior Skincare & Glow Trio Set",
    price: 5200,
    category: "parfums",
    img: "/produits/10.jpeg",
    images: ["/produits/10.jpeg", "/produits/10'.jpeg"],
    shortDesc: "Kit de routine éclat et miniatures soins Dior.",
    description: "Kit de routine éclat et miniatures soins Dior.",
    stock: 99
  },
  {
    id: "prod-11",
    name: "Accessoire Luxe Dior Emballé Ruban",
    price: 2900,
    category: "sacs",
    img: "/produits/11.jpeg",
    images: ["/produits/11.jpeg"],
    shortDesc: "Édition limitée sous emballage cadeau officiel.",
    description: "Édition limitée sous emballage cadeau officiel.",
    stock: 99
  },
  {
    id: "prod-12",
    name: "Huda Beauty Easy Bake Loose Powder",
    price: 4100,
    category: "maquillage",
    img: "/produits/12.jpeg",
    images: ["/produits/12.jpeg"],
    shortDesc: "Poudre libre fixatrice fini mat velouté.",
    description: "Poudre libre fixatrice fini mat velouté.",
    stock: 99
  },
  {
    id: "prod-13",
    name: "Sac Seau Quilté Monogramme CD Gold",
    price: 12000,
    category: "sacs",
    img: "/produits/13.jpeg",
    images: ["/produits/13.jpeg", "/produits/13'.jpeg"],
    shortDesc: "Sac à main style seau haut de gamme avec chaîne dorée.",
    description: "Sac à main style seau haut de gamme avec chaîne dorée.",
    stock: 99
  },
  {
    id: "prod-14",
    name: "Porte-cartes Enveloppe Cuir Rose Luxury",
    price: 4500,
    category: "sacs",
    img: "/produits/14.jpeg",
    images: ["/produits/14.jpeg"],
    shortDesc: "Petit portefeuille compact de luxe couleur pastel.",
    description: "Petit portefeuille compact de luxe couleur pastel.",
    stock: 99
  },
  {
    id: "prod-15",
    name: "Pochette Cuir Noir Monogramme Prestige",
    price: 5800,
    category: "sacs",
    img: "/produits/15.jpeg",
    images: ["/produits/15.jpeg"],
    shortDesc: "Pochette de rangement ou soirée en cuir embossé noir.",
    description: "Pochette de rangement ou soirée en cuir embossé noir.",
    stock: 99
  },
  {
    id: "prod-16",
    name: "Portefeuille Long Blanc Multicolore Style LV",
    price: 6200,
    category: "sacs",
    img: "/produits/16.jpeg",
    images: ["/produits/16.jpeg"],
    shortDesc: "Compagnon zippé en toile monogramme colorée.",
    description: "Compagnon zippé en toile monogramme colorée.",
    stock: 99
  },
  {
    id: "prod-17",
    name: "Sac à Main Top-Handle Monogramme Blanc & Rose",
    price: 14500,
    category: "sacs",
    img: "/produits/17.jpeg",
    images: ["/produits/17.jpeg", "/produits/17'.jpeg", "/produits/17''.jpeg"],
    shortDesc: "Sac rigide de luxe style Alma avec bandoulière.",
    description: "Sac à main rigide de luxe avec finitions blush.",
    stock: 99
  },
  {
    id: "prod-18",
    name: "Coffret Miniature Parfums de Prestige Collection",
    price: 8900,
    category: "parfums",
    img: "/produits/18.jpeg",
    images: ["/produits/18.jpeg", "/produits/18'.jpeg"],
    shortDesc: "Set de 4 flacons de collection haute parfumerie.",
    description: "Set de 4 flacons de collection haute parfumerie.",
    stock: 99
  },
  {
    id: "prod-19",
    name: "YSL Luxury Cheek & Blush Face Palette",
    price: 5400,
    category: "maquillage",
    img: "/produits/19.jpeg",
    images: ["/produits/19.jpeg", "/produits/19'.jpeg", "/produits/19''.jpeg"],
    shortDesc: "Palette de fards à joues boîtier cuir chevron matelassé rose.",
    description: "Palette multi-teintes fards à joues haut de gamme YSL.",
    stock: 99
  },
  {
    id: "prod-20",
    name: "Sol de Janeiro Hair & Body Mist Discovery Set",
    price: 4900,
    category: "parfums",
    img: "/produits/20.jpeg",
    images: ["/produits/20.jpeg", "/produits/20''.jpeg"],
    shortDesc: "Coffret de brumes parfumées iconiques brésiliennes.",
    description: "Coffret de brumes parfumées iconiques brésiliennes.",
    stock: 99
  },
  {
    id: "prod-21",
    name: "Dior Skincare Capture Totale / Mist Set",
    price: 5600,
    category: "parfums",
    img: "/produits/21.jpeg",
    images: ["/produits/21.jpeg", "/produits/21'.jpeg"],
    shortDesc: "Duo soin de peau éclat et brume fraîcheur.",
    description: "Duo soin de peau éclat et brume fraîcheur.",
    stock: 99
  },
  {
    id: "prod-22",
    name: "Charlotte Tilbury Pillow Talk Face Palette",
    price: 5800,
    category: "maquillage",
    img: "/produits/22.jpeg",
    images: ["/produits/22.jpeg", "/produits/22'.jpeg"],
    shortDesc: "Palette teint et joues éclat boîtier rose gold stellaire.",
    description: "Palette teint et joues éclat boîtier rose gold stellaire.",
    stock: 99
  },
  {
    id: "prod-23",
    name: "Dior Backstage Rosy Glow Blush",
    price: 3100,
    category: "maquillage",
    img: "/produits/23.jpeg",
    images: ["/produits/23.jpeg"],
    shortDesc: "Le blush révélateur de couleur naturelle réactif au pH.",
    description: "Le blush révélateur de couleur naturelle réactif au pH.",
    stock: 99
  },
  {
    id: "prod-24",
    name: "Charlotte Tilbury Airbrush Flawless Foundation",
    price: 4600,
    category: "maquillage",
    img: "/produits/24.jpeg",
    images: ["/produits/24.jpeg"],
    shortDesc: "Teint haute couvrance et fini mat naturel longue tenue.",
    description: "Teint haute couvrance et fini mat naturel longue tenue.",
    stock: 99
  },
  {
    id: "prod-25",
    name: "Dior Forever Foundation & Lipstick Gift Box",
    price: 6800,
    category: "maquillage",
    img: "/produits/25.jpeg",
    images: ["/produits/25.jpeg", "/produits/25'.jpeg"],
    shortDesc: "Coffret maquillage teint parfait et lèvres couture.",
    description: "Coffret maquillage teint parfait et lèvres couture.",
    stock: 99
  },
  {
    id: "prod-26",
    name: "Prestige Mini Lipsticks Collection Box",
    price: 7200,
    category: "maquillage",
    img: "/produits/26.jpeg",
    images: ["/produits/26.jpeg"],
    shortDesc: "Écrin d'art contenant un assortiment de rouges à lèvres.",
    description: "Écrin d'art contenant un assortiment de rouges à lèvres.",
    stock: 99
  },
  {
    id: "prod-27",
    name: "YSL Make Me Blush Compact - Peachy Pink",
    price: 3400,
    category: "maquillage",
    img: "/produits/27.jpeg",
    images: ["/produits/27.jpeg", "/produits/27'.jpeg"],
    shortDesc: "Blush compact boîtier rond matelassé rose.",
    description: "Blush compact boîtier rond matelassé rose.",
    stock: 99
  },
  {
    id: "prod-28",
    name: "YSL Make Me Blush Compact - Radiant Fuchsia",
    price: 3400,
    category: "maquillage",
    img: "/produits/28.jpeg",
    images: ["/produits/28.jpeg", "/produits/28'.jpeg"],
    shortDesc: "Fard à joues haut de gamme boîtier rond siglé or YSL.",
    description: "Fard à joues haut de gamme boîtier rond siglé or YSL.",
    stock: 99
  },
  {
    id: "prod-29",
    name: "YSL Make Me Blush Compact - Coral Glow",
    price: 3400,
    category: "maquillage",
    img: "/produits/29.jpeg",
    images: ["/produits/29.jpeg", "/produits/29'.jpeg"],
    shortDesc: "Poudre joues texture veloutée boîtier couture.",
    description: "Poudre joues texture veloutée boîtier couture.",
    stock: 99
  },
  {
    id: "prod-30",
    name: "Dior Backstage Glow Face Palette",
    price: 4900,
    category: "maquillage",
    img: "/produits/30.jpeg",
    images: ["/produits/30.jpeg", "/produits/30'.jpeg"],
    shortDesc: "Palette d'enlumineurs et fards 4 quadrants multi-usage.",
    description: "Palette d'enlumineurs et fards 4 quadrants multi-usage.",
    stock: 99
  },
  {
    id: "prod-31",
    name: "Dior Mono Couleur Couture Eyeshadow",
    price: 2800,
    category: "maquillage",
    img: "/produits/31.jpeg",
    images: ["/produits/31.jpeg", "/produits/31'.jpeg"],
    shortDesc: "Fard à paupières ou joues individuel haute pigmentation.",
    description: "Fard à paupières ou joues individuel haute pigmentation.",
    stock: 99
  },
  {
    id: "prod-32",
    name: "YSL All Hours Compact Powder",
    price: 4200,
    category: "maquillage",
    img: "/produits/32.jpeg",
    images: ["/produits/32.jpeg", "/produits/32'.jpeg"],
    shortDesc: "Poudre de finition ou bronzante boîtier cuir marron.",
    description: "Poudre de finition ou bronzante boîtier cuir marron.",
    stock: 99
  },
  {
    id: "prod-33",
    name: "Charlotte Tilbury Heart Blush Glow Duo",
    price: 3900,
    category: "maquillage",
    img: "/produits/33.jpeg",
    images: ["/produits/33.jpeg"],
    shortDesc: "Duo enlumineur et blush en forme de cœur romantique.",
    description: "Duo enlumineur et blush en forme de cœur romantique.",
    stock: 99
  },
  {
    id: "prod-34",
    name: "Article Sélection Luxe 34",
    price: 3000,
    category: "maquillage",
    img: "/produits/34.jpeg",
    images: ["/produits/34.jpeg"],
    shortDesc: "Produit de beauté haut de gamme.",
    description: "Description complète du produit numéro 34.",
    stock: 99
  },
  {
    id: "prod-35",
    name: "Article Sélection Luxe 35",
    price: 3000,
    category: "sacs",
    img: "/produits/35.jpeg",
    images: ["/produits/35.jpeg"],
    shortDesc: "Accessoire de maroquinerie haut de gamme.",
    description: "Description complète du produit numéro 35.",
    stock: 99
  },
  {
    id: "prod-36",
    name: "Article Sélection Luxe 36",
    price: 3000,
    category: "parfums",
    img: "/produits/36.jpeg",
    images: ["/produits/36.jpeg"],
    shortDesc: "Fragrance d'exception haute parfumerie.",
    description: "Description complète du produit numéro 36.",
    stock: 99
  },
  {
    id: "prod-37",
    name: "Article Sélection Luxe 37",
    price: 3000,
    category: "maquillage",
    img: "/produits/37.jpeg",
    images: ["/produits/37.jpeg"],
    shortDesc: "Produit de beauté haut de gamme.",
    description: "Description complète du produit numéro 37.",
    stock: 99
  },
  {
    id: "prod-38",
    name: "Article Sélection Luxe 38",
    price: 3000,
    category: "sacs",
    img: "/produits/38.jpeg",
    images: ["/produits/38.jpeg"],
    shortDesc: "Accessoire de maroquinerie haut de gamme.",
    description: "Description complète du produit numéro 38.",
    stock: 99
  },
  {
    id: "prod-39",
    name: "Article Sélection Luxe 39",
    price: 3000,
    category: "parfums",
    img: "/produits/39.jpeg",
    images: ["/produits/39.jpeg"],
    shortDesc: "Fragrance d'exception haute parfumerie.",
    description: "Description complète du produit numéro 39.",
    stock: 99
  },
  {
    id: "prod-40",
    name: "Article Sélection Luxe 40",
    price: 3000,
    category: "maquillage",
    img: "/produits/40.jpeg",
    images: ["/produits/40.jpeg"],
    shortDesc: "Produit de beauté haut de gamme.",
    description: "Description complète du produit numéro 40.",
    stock: 99
  },
  {
    id: "prod-41",
    name: "Article Sélection Luxe 41",
    price: 3000,
    category: "sacs",
    img: "/produits/41.jpeg",
    images: ["/produits/41.jpeg"],
    shortDesc: "Accessoire de maroquinerie haut de gamme.",
    description: "Description complète du produit numéro 41.",
    stock: 99
  },
  {
    id: "prod-42",
    name: "Article Sélection Luxe 42",
    price: 3000,
    category: "parfums",
    img: "/produits/42.jpeg",
    images: ["/produits/42.jpeg"],
    shortDesc: "Fragrance d'exception haute parfumerie.",
    description: "Description complète du produit numéro 42.",
    stock: 99
  },
  {
    id: "prod-43",
    name: "Article Sélection Luxe 43",
    price: 3000,
    category: "maquillage",
    img: "/produits/43.jpeg",
    images: ["/produits/43.jpeg"],
    shortDesc: "Produit de beauté haut de gamme.",
    description: "Description complète du produit numéro 43.",
    stock: 99
  },
  {
    id: "prod-44",
    name: "Tom Ford Private Blend Fragrance Set",
    price: 13500,
    category: "parfums",
    img: "/produits/44.jpeg",
    images: ["/produits/44.jpeg", "/produits/44'.jpeg"],
    shortDesc: "Coffret d'exception contenant 4 flacons signatures Tom Ford.",
    description: "Coffret d'exception contenant 4 flacons signatures Tom Ford.",
    stock: 99
  },
  {
    id: "prod-45",
    name: "One Step Hair Dryer & Volumizer Styler (Pink)",
    price: 4500,
    category: "maquillage",
    img: "/produits/45.jpeg",
    images: ["/produits/45.jpeg", "/produits/45'.jpeg", "/produits/45''.jpg"],
    shortDesc: "Brosse soufflante et coiffante rotative avec gant thermique.",
    description: "Brosse séchante, lissante et volumisante fushia et noire.",
    stock: 99
  },
  {
    id: "prod-46",
    name: "One Step Pro Air Styler Brush (Green Premium)",
    price: 4900,
    category: "maquillage",
    img: "/produits/46.jpeg",
    images: ["/produits/46.jpeg", "/produits/46'.jpg"],
    shortDesc: "Brosse chauffante lissante professionnelle couleur vert émeraude.",
    description: "Brosse chauffante lissante professionnelle couleur vert émeraude.",
    stock: 99
  }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const foundProduct = COEUR_ARTICLES.find((p) => p.id === id);
      return NextResponse.json({ product: foundProduct || null });
    }

    return NextResponse.json({ products: COEUR_ARTICLES });
  } catch (error) {
    return NextResponse.json({ products: COEUR_ARTICLES, product: null });
  }
}