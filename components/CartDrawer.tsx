'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem } = useCartStore();

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const freeShippingThreshold = 30000;
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      {/* Background Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Body */}
      <div className="relative z-10 w-full max-w-md bg-white h-full flex flex-col shadow-2xl transition-transform duration-300">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-maisssty-border">
          <h2 className="text-xl font-bold font-playfair text-maisssty-text">Panier</h2>
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs uppercase tracking-wider text-maisssty-muted hover:text-maisssty-text transition-colors cursor-pointer"
          >
            <X size={18} />
            <span>fermer</span>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-maisssty-muted py-12 font-inter text-sm">
              Votre panier est vide.
            </p>
          ) : (
            items.map((item) => {
              // Safe access for custom properties
              const itemRecord = item as Record<string, any>;
              const imageUrl = itemRecord.img || itemRecord.images?.[0] || '/placeholder.jpg';
              const size = itemRecord.selectedSize;

              return (
                <div
                  key={item.id}
                  className="flex gap-3 items-center border-b border-maisssty-border/60 pb-3"
                >
                  <div className="relative w-16 h-16 bg-maisssty-bg rounded overflow-hidden flex-shrink-0 border border-maisssty-border">
                    <Image
                      src={imageUrl}
                      alt={item.name || 'Produit'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-maisssty-text line-clamp-2">
                      {item.name} {size ? `- ${size}` : ''}
                    </p>
                    <p className="text-xs text-gold font-medium mt-1">
                      {item.quantity} × {item.price?.toLocaleString()} DA
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-maisssty-muted hover:text-rose-dark transition-colors p-1 cursor-pointer"
                    aria-label="Remove item"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Progress Bar */}
        <div className="p-4 border-t border-maisssty-border bg-maisssty-bg space-y-4">
          <div className="flex justify-between items-center text-base text-maisssty-text">
            <span className="font-bold">Sous-total :</span>
            <span className="font-extrabold text-lg">{subtotal.toLocaleString()} DA</span>
          </div>

          <div>
            <p className="text-xs text-maisssty-text mb-2 font-medium">
              {subtotal >= freeShippingThreshold
                ? '🎉 Vos commandes se qualifient pour une livraison gratuite !'
                : `Ajoutez ${(freeShippingThreshold - subtotal).toLocaleString()} DA pour la livraison gratuite !`}
            </p>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Link
              href="/panier"
              onClick={onClose}
              className="block w-full text-center py-3 bg-gray-100 text-maisssty-text text-xs font-bold uppercase tracking-widest rounded hover:bg-gray-200 transition-colors"
            >
              VOIR LE PANIER
            </Link>
            <Link
              href="/panier"
              onClick={onClose}
              className="block w-full text-center py-3 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-emerald-700 transition-colors shadow-sm"
            >
              COMMANDER
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}