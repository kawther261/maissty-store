import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export const dynamic = 'force-dynamic';
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
  let rawImgs = Array.isArray(p.images) ? p.images : [];
  let rawImg = p.img || (rawImgs.length > 0 ? rawImgs[0] : "");
  let cleanImgs = rawImgs.map((img: string) => cleanImageUrl(img));
  let cleanImg = cleanImageUrl(rawImg);

  if (cleanImgs.length === 0 && cleanImg) cleanImgs = [cleanImg];

  // Extract category string cleanly whether it's joined or plain string
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
          // Retry without category join if relation isn't defined in foreign keys
          const { data: fallbackData } = await supabase
            .from("products")
            .select("*")
            .eq("id", numericId)
            .maybeSingle();
          dbProduct = fallbackData;
        }
      }

      // 2. Try exact string match lookup if integer match was empty and rawId is non-numeric
      if (!dbProduct) {
        const { data, error } = await supabase
          .from("products")
          .select("*, category:categories(name)")
          .eq("id", rawId)
          .maybeSingle();

        if (!error && data) {
          dbProduct = data;
        } else {
          const { data: fallbackData } = await supabase
            .from("products")
            .select("*")
            .eq("id", rawId)
            .maybeSingle();
          dbProduct = fallbackData;
        }
      }

      if (!dbProduct) {
        return NextResponse.json({ product: null });
      }

      return NextResponse.json({ product: sanitizeProduct(dbProduct) });
    }

    // Fetch all products if no ID is provided
    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*, category:categories(name)")
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback query if categories join fails
      const { data: fallbackProducts } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      return NextResponse.json({
        products: (fallbackProducts || []).map(sanitizeProduct).filter(Boolean)
      });
    }

    return NextResponse.json({
      products: (dbProducts || []).map(sanitizeProduct).filter(Boolean)
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}