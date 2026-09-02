"use client";

import { useState, useEffect } from "react";
import { BarChart3, ShoppingBag, Package, Plus, Trash2, Edit, X, Lock, Upload, GripVertical } from "lucide-react";

// Helper to clean Cloudinary URLs automatically
const cleanImageUrl = (url: string) => {
  if (!url || typeof url !== "string") return "/placeholder.jpg";
  if (url.startsWith("data:")) return url;

  let clean = url.replace(/['"\s]/g, "").trim().replace(/\.jpeg$/i, ".jpg");
  const filename = clean.split("/").pop() || "";
  const baseName = filename.split(".")[0].replace(/[^a-zA-Z0-9_-]/g, "");

  return baseName ? `https://res.cloudinary.com/wigng2m5/image/upload/${baseName}.jpg` : "/placeholder.jpg";
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"analytics" | "products" | "orders">("analytics");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("parfums");
  const [formDesc, setFormDesc] = useState("");
  const [formImagesInput, setFormImagesInput] = useState("");

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // 🔄 Charger les données depuis Supabase
const loadData = async () => {
  try {
    // 1. Fetch products from your /api/products route
    const productsRes = await fetch("/api/products");
    const productsData = await productsRes.json();
    if (productsData.products) setProducts(productsData.products);

    // 2. Fetch orders from your admin endpoint (if separate)
    const adminRes = await fetch("/api/admin");
    const adminData = await adminRes.json();
    if (adminData.orders) setOrders(adminData.orders);
  } catch (err) {
    console.error("Erreur de chargement des données cloud:", err);
  }
};

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin123") setIsAuthenticated(true);
    else alert("Mot de passe incorrect.");
  };

  // 🪄 Drag & Drop Handler
  const handleDragStart = (index: number) => { setDraggedIndex(index); };
  const handleDragOver = (e: React.DragEvent, index: number) => { e.preventDefault(); };
  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const updatedProducts = [...products];
    const [draggedItem] = updatedProducts.splice(draggedIndex, 1);
    updatedProducts.splice(index, 0, draggedItem);
    setProducts(updatedProducts);
    setDraggedIndex(null);
  };

  // 🛠️ Modifier le statut d'une commande
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_ORDER_STATUS", data: { id: orderId, status: newStatus } })
      });
      if (res.ok) loadData();
    } catch (error) {
      alert("Erreur lors du changement de statut.");
    }
  };

  // 🗑️ Suppression d'une commande
  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Supprimer définitivement cette commande ?")) {
      try {
        const res = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "DELETE_ORDER", data: { id: orderId } })
        });
        if (res.ok) loadData();
      } catch (error) {
        alert("Erreur lors de la suppression de la commande.");
      }
    }
  };

  // 💾 Sauvegarder ou Modifier un produit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse image list from text area input
    const parsedImages = formImagesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(cleanImageUrl);

    const primaryImage = parsedImages.length > 0 ? parsedImages[0] : "/placeholder.jpg";

    const payload = {
      id: editingId || `prod-${Date.now()}`,
      name: formName,
      price: Number(formPrice) || 0,
      category: formCategory,
      description: formDesc,
      img: primaryImage,
      images: parsedImages.length > 0 ? parsedImages : [primaryImage]
    };

    try {
      const res = await fetch("/api/products", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (result.success || res.ok) {
        await loadData();
        setIsModalOpen(false);
      } else {
        alert("🚨 Erreur Cloud : " + (result.error || "Échec de l'enregistrement"));
      }
    } catch (error) {
      alert("🚨 Connexion impossible avec la base de données.");
    }
  };

  // 🗑️ Supprimer un produit
  const handleDeleteProduct = async (id: string) => {
    if (confirm("Supprimer définitivement ce produit ?")) {
      try {
        const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
        if (res.ok) loadData();
      } catch (error) {
        alert("Erreur lors de la suppression du produit.");
      }
    }
  };

  const openAddModal = () => {
    setEditingId(null); 
    setFormName(""); 
    setFormPrice(""); 
    setFormCategory("parfums"); 
    setFormDesc(""); 
    setFormImagesInput("");
    setIsModalOpen(true);
  };
  
  const openEditModal = (p: any) => {
    setEditingId(p.id); 
    setFormName(p.name || ""); 
    setFormPrice(p.price ? p.price.toString() : "0"); 
    setFormCategory(p.category || "parfums"); 
    setFormDesc(p.description || p.shortDesc || ""); 
    setFormImagesInput(Array.isArray(p.images) ? p.images.join(", ") : (p.img || ""));
    setIsModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDF6F3] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-[#F0DDD8] shadow-md max-w-sm w-full text-center space-y-6">
          <div className="w-12 h-12 bg-[#2C1810] text-white rounded-full flex items-center justify-center mx-auto"><Lock size={20} /></div>
          <h2 className="font-playfair text-lg font-bold text-[#2C1810]">Espace Maisssty Admin</h2>
          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <input type="password" placeholder="Mot de passe..." value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full px-4 py-3 border border-[#F0DDD8] rounded outline-none bg-[#FDF6F3] text-center text-sm" required />
            <button type="submit" className="w-full bg-black text-white py-3 rounded uppercase font-semibold cursor-pointer">Se connecter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6F3] text-[#2C1810] font-inter flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-[#2C1810] text-white p-6 flex flex-col justify-between md:min-h-screen">
        <div className="space-y-8">
          <h1 className="font-playfair text-xl font-bold tracking-widest uppercase">Maisssty Admin</h1>
          <nav className="flex flex-col gap-2">
            <button onClick={() => setActiveTab("analytics")} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium cursor-pointer ${activeTab === "analytics" ? "bg-[#C9A96E] text-[#2C1810]" : "hover:bg-white/5"}`}><BarChart3 size={16} /> Vue d&apos;ensemble</button>
            <button onClick={() => setActiveTab("products")} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium cursor-pointer ${activeTab === "products" ? "bg-[#C9A96E] text-[#2C1810]" : "hover:bg-white/5"}`}><Package size={16} /> Catalogue</button>
            <button onClick={() => setActiveTab("orders")} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium cursor-pointer ${activeTab === "orders" ? "bg-[#C9A96E] text-[#2C1810]" : "hover:bg-white/5"}`}><ShoppingBag size={16} /> Commandes ({orders.length})</button>
          </nav>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-10 max-w-7xl overflow-x-auto">
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold">Tableau de bord</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#F0DDD8] shadow-sm">
                <p className="text-xs text-[#8B6860] uppercase font-medium">Chiffre d&apos;affaires</p>
                <p className="text-2xl font-bold font-playfair mt-2">{orders.filter(o => o.status === "livre").reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()} DA</p>
              </div>
              <div className="bg-[#white] p-6 rounded-2xl border border-[#F0DDD8] shadow-sm">
                <p className="text-xs text-[#8B6860] uppercase font-medium">Total Commandes</p>
                <p className="text-2xl font-bold font-playfair mt-2">{orders.length} Reçues</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#F0DDD8] shadow-sm">
                <p className="text-xs text-[#8B6860] uppercase font-medium">Articles en ligne</p>
                <p className="text-2xl font-bold font-playfair mt-2">{products.length} Pièces</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-2xl font-bold">Catalogue</h2>
              <button onClick={openAddModal} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded text-xs uppercase font-bold cursor-pointer"><Plus size={14} /> Ajouter un produit</button>
            </div>
            <div className="bg-white rounded-2xl border border-[#F0DDD8] overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#2C1810] text-white uppercase text-[10px] tracking-wider">
                    <th className="p-4 w-12 text-center">Ordre</th>
                    <th className="p-4">Aperçu</th>
                    <th className="p-4">Produit</th>
                    <th className="p-4">Catégorie</th>
                    <th className="p-4">Prix</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0DDD8]">
                  {products.map((p, index) => (
                    <tr 
                      key={p.id} 
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={() => handleDrop(index)}
                      className={`transition-colors duration-150 ${draggedIndex === index ? "bg-[#C9A96E]/10 opacity-50" : "hover:bg-[#FDF6F3]/40"}`}
                    >
                      <td className="p-4 text-center cursor-grab active:cursor-grabbing text-neutral-400 hover:text-black">
                        <div className="flex justify-center"><GripVertical size={16} /></div>
                      </td>
                      <td className="p-4">
                        <img src={cleanImageUrl(p.images?.[0] || p.img)} alt="" className="w-10 h-10 rounded-md object-cover border" />
                      </td>
                      <td className="p-4 font-bold">{p.name}</td>
                      <td className="p-4 uppercase text-[10px] text-[#8B6860] font-bold">{p.category}</td>
                      <td className="p-4 font-bold">{(p.price || 0).toLocaleString()} DA</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => openEditModal(p)} className="p-1.5 text-blue-600"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-red-600"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold">Gestion des Commandes</h2>
            <div className="bg-white rounded-2xl border border-[#F0DDD8] overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#2C1810] text-white uppercase text-[10px] tracking-wider">
                    <th className="p-4">Client / Tél</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Adresse Complète</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4">Articles</th>
                    <th className="p-4">Total</th>
                    <th className="p-4 text-center">Statut</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0DDD8]">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#FDF6F3]/40">
                      <td className="p-4">
                        <p className="font-bold text-sm">{o.lastName} {o.firstName}</p>
                        <p className="font-mono font-bold text-blue-600 mt-0.5">{o.phone}</p>
                      </td>
                      <td className="p-4">
                        <p className="uppercase font-bold">{o.wilaya}</p>
                        <p className="text-[#8B6860]">{o.commune}</p>
                      </td>
                      <td className="p-4 max-w-xs break-words">
                        {o.deliveryType === "domicile" ? (
                          <p className="bg-[#FDF6F3] p-2 rounded border border-[#F0DDD8] italic">{o.address}</p>
                        ) : (
                          <span className="text-gray-400 italic">Retrait Agence</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${o.deliveryType === "domicile" ? "bg-rose-100 text-rose-800" : "bg-blue-100 text-blue-800"}`}>
                          {o.deliveryType === "domicile" ? "🏠 Domicile" : "🏢 Bureau"}
                        </span>
                      </td>
                      <td className="p-4 text-[#8B6860] max-w-xs truncate">{o.itemsSummary}</td>
                      <td className="p-4 font-bold text-green-950 text-sm">{(o.total || 0).toLocaleString()} DA</td>
                      
                      <td className="p-4 text-center">
                        <select
                          value={o.status || "en_cours"}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider outline-none border cursor-pointer ${
                            o.status === "livre" 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : o.status === "annule"
                              ? "bg-red-50 text-red-600 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <option value="en_cours">⏳ En cours</option>
                          <option value="livre">🚚 Livré</option>
                          <option value="annule">❌ Annulé</option>
                        </select>
                      </td>

                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteOrder(o.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                          title="Supprimer la commande"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal d'ajout / modification de produit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#F0DDD8] w-full max-w-md overflow-hidden shadow-xl">
            <div className="bg-[#2C1810] text-white p-4 flex items-center justify-between">
              <h3 className="font-playfair text-xs uppercase tracking-wider">{editingId ? "Modifier le produit" : "Ajouter une référence"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white"><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2C1810] uppercase tracking-wider mb-1">Nom du produit</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ex: Sac Classique Bordeaux" className="w-full px-3 py-2 border border-[#F0DDD8] rounded outline-none bg-[#FDF6F3]" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2C1810] uppercase tracking-wider mb-1">Prix (DA)</label>
                  <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="Ex: 14500" className="w-full px-3 py-2 border border-[#F0DDD8] rounded outline-none bg-[#FDF6F3]" required />
                </div>
                <div>
                  <label className="block font-bold text-[#2C1810] uppercase tracking-wider mb-1">Catégorie</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full px-3 py-2 border border-[#F0DDD8] rounded outline-none bg-[#FDF6F3]">
                    <option value="parfums">Parfums</option>
                    <option value="sacs">Sacs</option>
                    <option value="maquillage">Maquillage</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-[#2C1810] uppercase tracking-wider mb-1">Description</label>
                <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2} className="w-full px-3 py-2 border border-[#F0DDD8] rounded outline-none bg-[#FDF6F3]"></textarea>
              </div>
              <div>
                <label className="block font-bold text-[#2C1810] uppercase tracking-wider mb-2">URLs des Images Cloudinary (séparées par une virgule)</label>
                <textarea
                  value={formImagesInput}
                  onChange={(e) => setFormImagesInput(e.target.value)}
                  placeholder="https://res.cloudinary.com/wigng2m5/image/upload/1.jpg, https://..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#F0DDD8] rounded outline-none bg-[#FDF6F3] font-mono text-[11px]"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-[#F0DDD8] rounded text-[#8B6860] uppercase font-medium">Annuler</button>
                <button type="submit" className="px-5 py-2 bg-black text-white rounded uppercase font-medium cursor-pointer">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}