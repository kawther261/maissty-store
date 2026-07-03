'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface FavoritesState {
  favorites: FavoriteItem[]
  toggleFavorite: (item: FavoriteItem) => void
  isFavorite: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      // Ajoute le produit s'il n'existe pas, le retire s'il y est déjà
      toggleFavorite: (item) => {
        const current = get().favorites
        const exists = current.some((f) => f.id === item.id)
        if (exists) {
          set({ favorites: current.filter((f) => f.id !== item.id) })
        } else {
          set({ favorites: [...current, item] })
        }
      },
      
      // Vérifie si le produit est dans les favoris (pour colorer le coeur en rouge)
      isFavorite: (id) => get().favorites.some((f) => f.id === id),
    }),
    { name: 'maisssty-favorites-storage' }
  )
)