"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 🔐 Vérifie si l'utilisateur est actuellement sur une page d'administration
  const isAdminPage = pathname?.startsWith("/admin");

  // Si c'est l'admin, on affiche uniquement le contenu sans le menu du magasin
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Si c're est un client normal, on affiche la panoplie complète (Menu + Page + Pied de page)
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}