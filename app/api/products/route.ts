import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper to fix malformed Cloudinary URLs and paths automatically
const cleanImageUrl = (url: string) => {
  if (!url || typeof url !== "string") return "/placeholder.jpg";

  // If it's already a clean placeholder or base64, return as-is
  if (url.startsWith("data:") || url.startsWith("/")) return url;

  // Extract the filename (e.g., "1.jpg", "10.jpg")
  const filename = url.split("/").pop() || "";
  if (!filename) return url;

  // Force exact Cloudinary target format
  return `https://res.cloudinary.com/wigng2m5/image/upload/${filename}`;
};

// Helper to sanitize product object fields
const sanitizeProduct = (p: any) => {
  if (!p) return null;

  let rawImgs = Array.isArray(p.images) ? p.images : [];
  let rawImg = p.img || (rawImgs.length > 0 ? rawImgs[0] : "");

  let cleanImgs = rawImgs.map((img: string) => cleanImageUrl(img));
  let cleanImg = cleanImageUrl(rawImg);

  if (cleanImgs.length === 0 && cleanImg) {
    cleanImgs = [cleanImg];
  }

  return {
    ...p,
    img: cleanImg || "/placeholder.jpg",
    images: cleanImgs.length > 0 ? cleanImgs : ["/placeholder.jpg"]
  };
};

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

      return NextResponse.json({ product: sanitizeProduct(dbProduct) });
    }

    const { data: dbProducts, error } = await supabase
      .from("products_sorted")
      .select("*")
      

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return NextResponse.json({ products: [] }, { status: 500 });
    }

    const sanitizedProducts = (dbProducts || []).map(sanitizeProduct).filter(Boolean);

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

    return NextResponse.json({ success: true, product: sanitizeProduct(data[0]) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}