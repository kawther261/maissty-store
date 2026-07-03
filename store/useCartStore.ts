"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
  shortDesc?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  cartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      // Ajouter un produit ou augmenter sa quantité
      addItem: (product) => set((state) => {
        const existingItem = state.items.find((item) => item.id === product.id);
        const productImg = product.images?.[0] || product.img || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500";
        
        if (existingItem) {
          return {
            items: state.items.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }
        return {
          items: [...state.items, { id: product.id, name: product.name, price: product.price, img: productImg, shortDesc: product.shortDesc, quantity: 1 }],
        };
      }),

      // Supprimer un produit du panier
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      // Ajuster la quantité manuellement (+ ou -)
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
      })),

      // Vider tout le panier après confirmation de commande
      clearCart: () => set({ items: [] }),

      // Calculer le montant total réel
      totalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      // Calculer le nombre total d'articles pour le badge de la Navbar
      cartCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "maisssty-cart-storage", // Clé de stockage LocalStorage
    }
  )
);