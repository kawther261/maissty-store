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

      if (error) {
        console.error("Supabase Single Product Fetch Error:", error);
        return NextResponse.json({ product: null });
      }

      return NextResponse.json({ product: dbProduct || null });
    }

    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return NextResponse.json({ products: [] }, { status: 500 });
    }

    // Normalize products data to guarantee valid image fields
    const sanitizedProducts = (dbProducts || []).map((p: any) => {
      let imgVal = p.img;
      let imgsArr = Array.isArray(p.images) ? p.images : [];

      if (!imgVal && imgsArr.length > 0) {
        imgVal = imgsArr[0];
      }
      if (imgsArr.length === 0 && imgVal) {
        imgsArr = [imgVal];
      }

      return {
        ...p,
        img: imgVal || "/placeholder.jpg",
        images: imgsArr.length > 0 ? imgsArr : ["/placeholder.jpg"]
      };
    });

    return NextResponse.json({ products: sanitizedProducts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, products: [] },
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

    // Sanitize images before insertion
    let primaryImg = img || (Array.isArray(images) && images.length > 0 ? images[0] : null) || "";
    let imageArray = Array.isArray(images) && images.length > 0 ? images : (primaryImg ? [primaryImg] : []);

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          price: Number(price) || 0,
          category: category || "parfums",
          img: primaryImg,
          images: imageArray,
          description: description || "",
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