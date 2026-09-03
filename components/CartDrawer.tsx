'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent SSR/Hydration mismatch with Zustand
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) return null;

  const subtotal = (items || []).reduce(
    (sum, item) => sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 1),
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
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold font-playfair text-neutral-900">Panier</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-xs uppercase tracking-wider text-neutral-500 hover:text-black transition-colors cursor-pointer"
          >
            <X size={18} />
            <span>fermer</span>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {(!items || items.length === 0) ? (
            <p className="text-center text-neutral-500 py-12 font-inter text-sm">
              Votre panier est vide.
            </p>
          ) : (
            items.map((item, index) => {
              const itemRecord = item as Record<string, any>;
              const rawImg = itemRecord.img || itemRecord.images?.[0] || '/placeholder.jpg';
              const imageUrl = typeof rawImg === 'string' && rawImg.startsWith('http') 
                ? rawImg 
                : '/placeholder.jpg';
              const size = itemRecord.selectedSize;

              return (
                <div
                  key={item.id ? `${item.id}-${index}` : index}
                  className="flex gap-3 items-center border-b border-neutral-100 pb-3"
                >
                  <div className="relative w-16 h-16 bg-neutral-50 rounded overflow-hidden flex-shrink-0 border border-neutral-200">
                    <img
                      src={imageUrl}
                      alt={item.name || 'Produit'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 line-clamp-2">
                      {item.name} {size ? `- ${size}` : ''}
                    </p>
                    <p className="text-xs text-amber-700 font-medium mt-1">
                      {item.quantity || 1} × {(Number(item.price) || 0).toLocaleString()} DA
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
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
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-4">
          <div className="flex justify-between items-center text-base text-neutral-900">
            <span className="font-bold">Sous-total :</span>
            <span className="font-extrabold text-lg">{subtotal.toLocaleString()} DA</span>
          </div>

          <div>
            <p className="text-xs text-neutral-700 mb-2 font-medium">
              {subtotal >= freeShippingThreshold
                ? '🎉 Vos commandes se qualifient pour une livraison gratuite !'
                : `Ajoutez ${(freeShippingThreshold - subtotal).toLocaleString()} DA pour la livraison gratuite !`}
            </p>

            <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Link
              href="/panier"
              onClick={onClose}
              className="block w-full text-center py-3 bg-white border border-neutral-300 text-neutral-900 text-xs font-bold uppercase tracking-widest rounded hover:bg-neutral-100 transition-colors"
            >
              VOIR LE PANIER
            </Link>
            <Link
              href="/panier"
              onClick={onClose}
              className="block w-full text-center py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-neutral-800 transition-colors shadow-sm"
            >
              COMMANDER
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}