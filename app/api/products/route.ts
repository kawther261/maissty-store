import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ==========================================
// 🔄 GET: Fetch products directly from Supabase
// ==========================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const { data: dbProduct, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return NextResponse.json({ product: dbProduct || null });
    }

    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ products: dbProducts || [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ==========================================
// ➕ POST: Add new product to Supabase
// ==========================================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, category, img, images, description, stock } = body;

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          price: Number(price),
          category,
          img,
          images: images && images.length > 0 ? images : [img],
          description,
          stock: Number(stock || 99)
        }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}