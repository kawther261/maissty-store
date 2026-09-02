import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase"; 

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper to fix malformed Cloudinary URLs automatically
const cleanImageUrl = (url: string) => {
  if (!url || typeof url !== "string") return "/placeholder.jpg";
  if (url.startsWith("data:") || url.startsWith("/")) return url;

  const filename = url.split("/").pop() || "";
  if (!filename) return url;

  return `https://res.cloudinary.com/wigng2m5/image/upload/${filename}`;
};

// ==========================================
// 🔄 METHODE GET : Charger les produits et commandes pour l'admin
// ==========================================
export async function GET() {
  try {
    // 1️⃣ Récupérer les produits depuis Supabase (Sorted by ID to prevent missing column error)
    const { data: dbProducts, error: prodError } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (prodError) throw prodError;

    const products = (dbProducts || []).map(p => {
      let rawImgs = Array.isArray(p.images) ? p.images : [];
      let rawImg = p.img || (rawImgs.length > 0 ? rawImgs[0] : "");

      let cleanImgs = rawImgs.map((img: string) => cleanImageUrl(img));
      let cleanImg = cleanImageUrl(rawImg);

      if (cleanImgs.length === 0 && cleanImg) {
        cleanImgs = [cleanImg];
      }

      return {
        ...p,
        category: p.category || "parfums",
        img: cleanImg || "/placeholder.jpg",
        images: cleanImgs.length > 0 ? cleanImgs : ["/placeholder.jpg"]
      };
    });

    // 2️⃣ Récupérer les commandes depuis Supabase
    const { data: dbOrders, error: orderError } = await supabase
      .from("orders")
      .select("*");

    if (orderError) {
      console.warn("Orders Fetch Warning:", orderError.message);
    }
    
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
    console.error("Admin API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// 🛠️ METHODE POST : Ajouter, Modifier ou Supprimer
// ==========================================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    // ➕ ACTION : AJOUTER OU MODIFIER UN PRODUIT
    if (action === "SAVE_PRODUCT") {
      const catName = (data.category || "parfums").trim().toLowerCase();
      
      const productPayload: Record<string, any> = {
        name: data.name,
        price: Number(data.price),
        description: data.shortDesc || data.description || "",
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
        return NextResponse.json({ success: true, product: updated?.[0] });
      } else {
        productPayload.id = data.id || `prod-${Date.now()}`;

        const { data: created, error } = await supabase
          .from("products")
          .insert([productPayload])
          .select();

        if (error) throw error;
        return NextResponse.json({ success: true, product: created?.[0] });
      }
    }

    // ❌ ACTION : SUPPRIMER UN PRODUIT
    if (action === "DELETE_PRODUCT") {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", data.id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // 🔄 ACTION : MODIFIER LE STATUT D'UNE COMMANDE
    if (action === "UPDATE_ORDER_STATUS") {
      const { error } = await supabase
        .from("orders")
        .update({ status: data.status })
        .eq("id", data.id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // 🗑️ ACTION : SUPPRIMER UNE COMMANDE
    if (action === "DELETE_ORDER") {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", data.id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}