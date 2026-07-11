import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase"; 

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    if (prodError) throw prodError;

    const products = (dbProducts || []).map(p => ({
      ...p,
      category: p.category || "parfums",
      img: p.images && p.images.length > 0 ? p.images[0] : p.img || "/placeholder.jpg"
    }));

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
  } catch (error: any) { // 🛠️ FIX : Ajout de : any
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
  } catch (error: any) { // 🛠️ FIX : Ajout de : any
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}