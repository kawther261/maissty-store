import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COEUR_ARTICLES = [
  {
    id: "prod-1",
    name: "Stick Blush Dior Addict",
    price: 4100,
    category: "maquillage",
    img: "/produits/1.jpg",
    images: ["/produits/1.jpg", "/produits/1'.jpg"],
    description: "Le tout nouveau blush en stick Dior au fini ultra-fondant.",
    stock: 99
  },
  {
    id: "prod-2",
    name: "Huile à Lèvres Dior Addict Lip Glow Oil",
    price: 4200,
    category: "maquillage",
    img: "/produits/2 (2).jpg",
    images: ["/produits/2 (2).jpg", "/produits/2'.jpg"],
    description: "Une huile à lèvres ultra-brillante et nourrissante qui réagit au pH de la peau pour rehausser sa couleur naturelle tout en offrant une hydratation intense.",
    stock: 99
  },
  {
    id: "prod-3",
    name: "Fond de Teint Cushion Dior Forever",
    price: 4200,
    category: "maquillage",
    img: "/produits/3.jpg",
    images: ["/produits/3.jpg", "/produits/3'.jpg"],
    description: "Le mythique fond de teint boîtier au fini parfait et haute couvrance, logé dans son écrin couture en tissu cannage noir signé des initiales CD.",
    stock: 99
  },
  {
    id: "prod-4",
    name: "Fond de Teint Cushion Dior Forever – Édition Limitée Rose",
    price: 4400,
    category: "maquillage",
    img: "/produits/4.jpg",
    images: ["/produits/4.jpg", "/produits/4'.jpg"],
    description: "Le célèbre fond de teint boîtier haute perfection, sublimé par un magnifique écrin couture en broderie cannage rose pastel signé Christian Dior.",
    stock: 99
  },
  {
    id: "prod-5",
    name: "Set de Gloss Baumes Dior Addict Lip Glow Butter",
    price: 5900,
    category: "maquillage",
    img: "/produits/5.jpg",
    images: ["/produits/5.jpg", "/produits/5'.jpg"],
    description: "Une collection de petits tubes baumes à lèvres ultra-nourrissants et fondants, dotés de charm's logotés Dior pour des lèvres douces, brillantes et subtilement teintées.",
    stock: 99
  },
  {
    id: "prod-6",
    name: "Coffret Miniatures Parfums Hermès",
    price: 6800,
    category: "parfums",
    img: "/produits/6.jpeg",
    images: ["/produits/6.jpeg", "/produits/6'.jpeg"],
    description: "Un somptueux coffret prestige réunissant quatre fragrances emblématiques d'Hermès en format miniature, parfait pour explorer les créations de la maison ou pour offrir.",
    stock: 99
  },
  {
    id: "prod-7",
    name: "Pochette Maquillage Dior Floral Brodée",
    price: 3400,
    category: "sacs",
    img: "/produits/7.jpeg",
    images: ["/produits/7.jpeg", "/produits/7'.jpeg"],
    description: "Trousse de beauté luxe en édition limitée broderie fleurs.",
    stock: 99
  },
  {
    id: "prod-8",
    name: "Sac Pouch Rond Tissu Quilté Dior",
    price: 4100,
    category: "sacs",
    img: "/produits/8.jpeg",
    images: ["/produits/8.jpeg", "/produits/8'.jpeg"],
    description: "Mini sac pochette rond avec détails de couture.",
    stock: 99
  },
  {
    id: "prod-9",
    name: "Coffret Miniatures Kayali – Sweet Obsessions (4 x 30ml)",
    price: 9200,
    category: "parfums",
    img: "/produits/9.jpeg",
    images: ["/produits/9.jpeg", "/produits/9'.jpeg"],
    description: "Un superbe coffret en édition limitée regroupant quatre eaux de parfum iconiques et gourmandes de Kayali au format généreux de 30ml.",
    stock: 99
  },
  {
    id: "prod-10",
    name: "Duo Lèvres Dior Addict (Pack 2 pièces)",
    price: 3400,
    category: "maquillage",
    img: "/produits/10.jpeg",
    images: ["/produits/10.jpeg", "/produits/10'.jpeg"],
    description: "Le combo parfait réunissant le baume Lip Glow et le gloss Lip Maximizer pour des lèvres",
    stock: 99
  },
  {
    id: "prod-11",
    name: "Miroir de Poche Couture Dior",
    price: 2800,
    category: "maquillage",
    img: "/produits/11.jpeg",
    images: ["/produits/11.jpeg"],
    description: "Un élégant miroir de poche compact et double face gravé du logo Dior, l'accessoire indispensable à glisser dans son sac pour les retouches beauté de la journée.",
    stock: 99
  },
  {
    id: "prod-12",
    name: "Poudre Libre Easy Bake Duo – Huda Beauty",
    price: 3900,
    category: "maquillage",
    img: "/produits/12.jpeg",
    images: ["/produits/12.jpeg"],
    description: "Le duo de poudres libres incontournable pour fixer, illuminer et flouter le teint avec un fini mat velouté longue tenue.",
    stock: 99
  },
  {
    id: "prod-13",
    name: "Sac Seau Dior C’est Dior (Avec Bandoulière)",
    price: 7100,
    category: "sacs",
    img: "/produits/13.jpeg",
    images: ["/produits/13.jpeg", "/produits/13'.jpeg"],
    description: "Un élégant sac seau en toile jacquard tissée et cuir blanc, doté d'une poignée chic, d'une bandoulière amovible et de détails dorés raffinés pour un look sophistiqué.",
    stock: 99
  },
  {
    id: "prod-14",
    name: "Pochette Félicie Louis Vuitton – Édition Monogramme Rose",
    price: 8300,
    category: "sacs",
    img: "/produits/14.jpeg",
    images: ["/produits/14.jpeg"],
    description: "L'élégante pochette Félicie revisitée avec un motif monogramme dégradé rose, accompagnée de sa chaîne dorée amovible et de ses deux inserts assortis.",
    stock: 99
  },
  {
    id: "prod-15",
    name: "Pochette Cuir Noir Monogramme Prestige",
    price: 8300,
    category: "sacs",
    img: "/produits/15.jpeg",
    images: ["/produits/15.jpeg"],
    description: "L'élégante pochette Félicie confectionnée en cuir Monogram Empreinte rose poudré, complétée par sa chaîne dorée amovible et ses deux poches intérieures assorties.",
    stock: 99
  },
  {
    id: "prod-16",
    name: "Pochette Félicie Louis Vuitton – Édition Monogramme Rose",
    price: 8300,
    category: "sacs",
    img: "/produits/16.jpeg",
    images: ["/produits/16.jpeg"],
    description: "L'élégante pochette Félicie confectionnée en cuir Monogram Empreinte rose poudré, complétée par sa chaîne dorée amovible et ses deux poches intérieures assorties.",
    stock: 99
  },
  {
    id: "prod-17",
    name: "Sac Louis Vuitton Alma BB – Cuir Monogram Empreinte (Édition Pastel)",
    price: 10600,
    category: "sacs",
    img: "/produits/17.jpeg",
    images: ["/produits/17.jpeg", "/produits/17'.jpeg", "/produits/17''.jpeg"],
    description: "Le mythique sac à main Alma BB décliné en cuir grainé avec un délicat motif monogramme en relief aux nuances pastelles, disponible en blanc crème et en rose poudré.",
    stock: 99
  },
  {
    id: "prod-18",
    name: "Coffret Miniatures de Parfums Louis Vuitton",
    price: 8600,
    category: "parfums",
    img: "/produits/18.jpeg",
    images: ["/produits/18.jpeg", "/produits/18'.jpeg"],
    description: "Un luxueux coffret d'exception réunissant quatre miniatures de parfums emblématiques de la maison — City of Stars, Pacific Chill, California Dream et Imagination — idéal pour explorer leurs sillages envoûtants.",
    stock: 99
  },
  {
    id: "prod-19",
    name: "Palette Yeux et Teint Yves Saint Laurent Couture",
    price: 8600,
    category: "maquillage",
    img: "/produits/19.jpeg",
    images: ["/produits/19.jpeg", "/produits/19'.jpeg", "/produits/19''.jpeg"],
    description: "Une luxueuse palette multi-usage combinant des fards sculptants, blushes et illuminateurs embossés du logo YSL, nichée dans un sublime écrin en cuir matelassé beige et doré.",
    stock: 99
  },
  
  {
    id: "prod-20",
    name: "Coffret Brumes Sol de Janeiro – Spritz & Shine",
    price: 7200,
    category: "maquillage",
    img: "/produits/20.jpeg",
    images: ["/produits/20.jpeg", "/produits/20'.jpeg"],
    description: "Un magnifique coffret festif réunissant quatre brumes parfumées iconiques de la marque (Cheirosa 62, 71, 40 et 68) en format voyage pour emporter partout ses notes gourmandes et ensoleillées.",
    stock: 99
  },
  {
    id: "prod-21",
    name: "Brume Fixatrice Dior Backstage (Nouveau Modèle)",
    price: 4900,
    category: "maquillage",
    img: "/produits/21.jpeg",
    images: ["/produits/21.jpeg", "/produits/21'.jpeg"],
    description: "Une brume de maquillage haute performance qui lisse, fixe et ravive le teint tout en assurant une hydratation continue pendant 24 heures.",
    stock: 99
  },
  {
    id: "prod-22",
    name: "Palette Beautifying Blush + Glow Charlotte Tilbury – Pillow Talk",
    price: 4800,
    category: "maquillage",
    img: "/produits/22.jpeg",
    images: ["/produits/22.jpeg"],
    description: "Une somptueuse palette pour le visage et les yeux réunissant quatre fards blushes et illuminateurs nacrés au fini mat et satiné pour un teint radieux et magnifié.",
    stock: 99
  },
  {
   id: "prod-23",
    name: "Blush Poudre Dior Backstage Rosy Glow",
    price: 2500,
    category: "maquillage",
    img: "/produits/23.jpeg",
    images: ["/produits/23.jpeg"],
    description: "Le blush poudre iconique révélateur de couleur qui réagit à l'humidité de la peau pour offrir un effet bonne mine sur mesure et un éclat naturel instantané.",
    stock: 99
  },
  {
   id: "prod-24",
    name: "Fond de Teint Airbrush Flawless Foundation – Charlotte Tilbury",
    price: 4300,
    category: "maquillage",
    img: "/produits/24.jpeg",
    images: ["/produits/24.jpeg"],
    description: "Un fond de teint liquide haute couvrance à la tenue impeccable jour et nuit, qui floute les imperfections et lisse la peau pour un fini mat naturel et un teint zéro défaut.",
    stock: 99
  },
  {
    id: "prod-25",
    name: "Coffret Duo Teint et Lèvres Dior Forever",
    price: 5500,
    category: "maquillage",
    img: "/produits/25.jpeg",
    images: ["/produits/25.jpeg", "/produits/25'.jpeg"],
    description: "Un élégant coffret cadeau associant l'incontournable fond de teint haute perfection Dior Forever et un mini rouge à lèvres Rouge Dior pour un teint zéro défaut et des lèvres sublimées.",
    stock: 99
  },
  {
    id: "prod-26",
    name: "Coffret Prestige Miniatures Rouge Dior (Avec Sac Shopping)",
    price: 5200,
    category: "maquillage",
    img: "/produits/26.jpeg",
    images: ["/produits/26.jpeg"],
    description: "Un somptueux coffret de collection orné de motifs géométriques et dorés, réunissant cinq mini rouges à lèvres Rouge Dior aux finis vibrants, accompagné de son sac shopping assorti.",
    stock: 99
  },
  {
    id: "prod-38",
    name: "Louis Vuitton capucine",
    price: 11000,
    category: "sacs",
    img: "/produits/37.jpg",
    images: ["/produits/37.jpg"],
    description: "Une icône de luxe audacieuse au format miniature, parfaite pour sublimer vos tenues",
    stock: 99
  },
  {
    id: "prod-27",
    name: "Blush Make Me Blush YSL – Teinte 44",
    price: 3400,
    category: "maquillage",
    img: "/produits/27.jpeg",
    images: ["/produits/27.jpeg", "/produits/27'.jpeg"],
    description: "Le blush floutant et sublimateur de couleur signé Yves Saint Laurent, niché dans un sublime boîtier rond matelassé rose et doré orné du logo iconique de la maison.",
    stock: 99
  },
  {
    id: "prod-28",
    name: "Blush Make Me Blush YSL – Teinte 06",
    price: 3400,
    category: "maquillage",
    img: "/produits/28.jpeg",
    images: ["/produits/28.jpeg", "/produits/28'.jpeg"],
    description: "Le blush floutant et sublimateur de couleur signé Yves Saint Laurent, niché dans un sublime boîtier rond matelassé rose et doré orné du logo iconique de la maison.",
    stock: 99
  },
  {
    id: "prod-29",
    name: "Blush Make Me Blush YSL – Teinte 87",
    price: 3400,
    category: "maquillage",
    img: "/produits/29.jpeg",
    images: ["/produits/29.jpeg", "/produits/29'.jpeg"],
    description: "Le blush floutant et sublimateur de couleur signé Yves Saint Laurent, niché dans un sublime boîtier rond matelassé rose et doré orné du logo iconique de la maison.",
    stock: 99
  },
  {
    id: "prod-30",
    name: "Dior Backstage Glow Face Palette – 001 Universal",
    price: 3400,
    category: "maquillage",
    img: "/produits/30.jpeg",
    images: ["/produits/30.jpeg", "/produits/30'.jpeg"],
    description: "La palette illuminatrice culte de Dior avec ses 4 teintes universelles (blanc, doré, rose, bronze) pour sculpter le visage d'un éclat sur mesure, du plus naturel au plus intense.",
    stock: 99
  },
  {
    id: "prod-37",
    name: "Palette Visage Beauty Soulmates – Charlotte Tilbury",
    price: 3900,
    category: "maquillage",
    img: "/produits/37.jpg",
    images: ["/produits/37.jpg"],
    description: "n sublime duo en édition limitée contenant une poudre lissante Airbrush et un blush lumineux",
    stock: 99
  },
  {
    id: "prod-31",
    name: "Nouveau Blush Dior Backstage Rosy Glow",
    price: 2600,
    category: "maquillage",
    img: "/produits/31.jpeg",
    images: ["/produits/31.jpeg", "/produits/31'.jpeg"],
    description: "Le blush iconique réinventé qui réagit au pH de la peau pour offrir un effet bonne mine.",
    stock: 99
  },
  {
    id: "prod-32",
    name: "Poudre Bronzante YSL All Hours Hyper Bronze",
    price: 3900,
    category: "maquillage",
    img: "/produits/32.jpeg",
    images: ["/produits/32.jpeg", "/produits/32'.jpeg"],
    description: "Une poudre bronzante haute performance enrichie en soin qui réchauffe le teint et floute les imperfections pour un fini mat naturel ensoleillé, présentée dans un sublime écrin couture matelassé marron et doré..",
    stock: 99
  },
  {
    id: "prod-33",
    name: "Charlotte Tilbury Heart Blush Glow Duo",
    price: 3900,
    category: "maquillage",
    img: "/produits/33.jpeg",
    images: ["/produits/33.jpeg"],
    description: "Duo enlumineur et blush en forme de cœur romantique.",
    stock: 99
  },
  
  {
    id: "prod-34",
    name: "Coffret Parfums Tom Ford – Miniature Modern Collection",
    price: 8800,
    category: "parfums",
    img: "/produits/34.jpeg",
    images: ["/produits/34.jpeg", "/produits/34'.jpeg"],
    description: "Un luxueux coffret d'exception réunissant quatre fragrances emblématiques de Tom Ford en format 30 ml — Lost Cherry, Electric Cherry, Cherry Smoke et Tobacco Vanille — pour explorer des sillages intenses, audacieux et sophistiqués.",
    stock: 99
  },
  {
    id: "prod-35",
    name: "Brosse Soufflante One-Step (Avec Gant Thermo-Protecteur)",
    price: 4500,
    category: "maquillage",
    img: "/produits/35.jpeg",
    images: ["/produits/35.jpeg", "/produits/35'.jpeg", "/produits/35''.jpg"],
    description: "Le kit de coiffage idéal combinant la célèbre brosse chauffante et soufflante One-Step pour sécher et lisser en un seul geste, accompagnée de son gant de protection thermique contre la chaleur.",
    stock: 99
  },
  {
    id: "prod-36",
    name: "Brosse Soufflante Remington 3000W – Avocado Power",
    price: 5500,
    category: "maquillage",
    img: "/produits/36.jpeg",
    images: ["/produits/36.jpeg", "/produits/36'.jpg"],
    description: "Une brosse chauffante et soufflante ultra-puissante de 3000W au design vert avocat, conçue pour sécher, lisser et donner du volume tout en protégeant la brillance de vos cheveux.",
    stock: 99
  }
];

// ==========================================
// 🔄 METHODE GET : Charger les produits et commandes pour l'admin
// ==========================================
export async function GET() {
  try {
    // 1️⃣ Récupérer les produits depuis Supabase
    const { data: dbProducts, error: prodError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (prodError) console.error("⚠️ Erreur Prod Supabase:", prodError.message);

    const products = (dbProducts && dbProducts.length > 0) 
      ? dbProducts.map(p => ({
          ...p,
          category: p.category || "parfums",
          img: p.images && p.images.length > 0 ? p.images[0] : p.img || "/placeholder.jpg"
        }))
      : COEUR_ARTICLES;

    // 2️⃣ Récupérer les commandes depuis Supabase
    const { data: dbOrders, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (orderError) throw orderError;
    
    const orders = (dbOrders || []).map(o => ({
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
      status: o.status === "livre" ? "livre" : "en_cours"
    }));

    return NextResponse.json({ products, orders });
  } catch (error: any) {
    console.error("❌ Gros crash dans l'API Admin GET:", error.message);
    return NextResponse.json({ products: COEUR_ARTICLES, orders: [], error: error.message });
  }
}

// ==========================================
// 🛠️ METHODE POST : Actions d'Édition / Suppression Admin
// ==========================================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (action === "SAVE_PRODUCT") {
      const catName = (data.category || "parfums").trim().toLowerCase();
      const productPayload = {
        name: data.name,
        price: Number(data.price),
        shortDesc: data.shortDesc || "",
        description: data.shortDesc || "",
        images: data.images || [],
        img: data.images && data.images.length > 0 ? data.images[0] : "/placeholder.jpg",
        category: catName,
        stock: 99
      };

      if (data.editingId) {
        const { data: updated, error } = await supabase
          .from("products")
          .update(productPayload)
          .eq("id", data.editingId)
          .select();

        if (error) throw error;
        return NextResponse.json({ success: true, product: updated[0] });
      } else {
        const { data: created, error } = await supabase
          .from("products")
          .insert([productPayload])
          .select();

        if (error) throw error;
        return NextResponse.json({ success: true, product: created[0] });
      }
    }

    if (action === "DELETE_PRODUCT") {
      const { error } = await supabase.from("products").delete().eq("id", data.id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "UPDATE_ORDER_STATUS") {
      const { error } = await supabase.from("orders").update({ status: data.status }).eq("id", data.id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "DELETE_ORDER") {
      const { error } = await supabase.from("orders").delete().eq("id", data.id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}