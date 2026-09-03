import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const cleanImageUrl = (url: string) => {
  if (!url || typeof url !== "string") return "/placeholder.jpg";
  if (url.startsWith("data:") || url.startsWith("/")) return url;
  const filename = url.split("/").pop() || "";
  if (!filename) return url;
  return `https://res.cloudinary.com/wigng2m5/image/upload/${filename}`;
};

const sanitizeProduct = (p: any) => {
  if (!p) return null;
  
  let rawImgs = Array.isArray(p.images) 
    ? p.images 
    : (typeof p.images === "string" ? [p.images] : []);
    
  let rawImg = p.img || (rawImgs.length > 0 ? rawImgs[0] : "");
  let cleanImgs = rawImgs.map((img: string) => cleanImageUrl(img));
  let cleanImg = cleanImageUrl(rawImg);

  if (cleanImgs.length === 0 && cleanImg) {
    cleanImgs = [cleanImg];
  }

  // Extract category string cleanly
  let categoryName = "parfums";
  if (typeof p.category === "string") {
    categoryName = p.category;
  } else if (p.category && typeof p.category.name === "string") {
    categoryName = p.category.name;
  }

  return {
    ...p,
    category: categoryName,
    img: cleanImg || "/placeholder.jpg",
    images: cleanImgs.length > 0 ? cleanImgs : ["/placeholder.jpg"]
  };
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawId = searchParams.get("id");

    if (rawId) {
      const cleanDigits = rawId.replace(/\D/g, "");
      const numericId = cleanDigits ? parseInt(cleanDigits, 10) : null;

      let dbProduct = null;

      // 1. Try integer lookup if numeric ID exists
      if (numericId !== null && !isNaN(numericId)) {
        const { data, error } = await supabase
          .from("products")
          .select("*, category:categories(name)")
          .eq("id", numericId)
          .maybeSingle();

        if (!error && data) {
          dbProduct = data;
        } else {
          // Retry without category join fallback
          const { data: fallbackData } = await supabase
            .from("products")
            .select("*")
            .eq("id", numericId)
            .maybeSingle();
            
          dbProduct = fallbackData;
        }
      }

      // 2. Try exact string match lookup on `id` or `slug`
      if (!dbProduct) {
        const { data, error } = await supabase
          .from("products")
          .select("*, category:categories(name)")
          .or(`id.eq.${rawId},slug.eq.${rawId}`)
          .maybeSingle();

        if (!error && data) {
          dbProduct = data;
        } else {
          const { data: fallbackData } = await supabase
            .from("products")
            .select("*")
            .or(`id.eq.${rawId},slug.eq.${rawId}`)
            .maybeSingle();
            
          dbProduct = fallbackData;
        }
      }

      if (!dbProduct) {
        return NextResponse.json(
          { product: null, message: "Product not found" },
          { status: 404, headers: { "Cache-Control": "no-store, max-age=0" } }
        );
      }

      return NextResponse.json(
        { product: sanitizeProduct(dbProduct) },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    // 3. Fetch all products if no ID parameter is passed
    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*, category:categories(name)")
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback query if categories foreign key relation is not set up
      const { data: fallbackProducts } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      return NextResponse.json(
        {
          products: (fallbackProducts || []).map(sanitizeProduct).filter(Boolean)
        },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    return NextResponse.json(
      {
        products: (dbProducts || []).map(sanitizeProduct).filter(Boolean)
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}