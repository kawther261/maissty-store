"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const SLIDES = [
  {
    id: 1,
    title: "Maissty Store – L'élégance authentique à portée de main.",
    image: "/hero-perfume.jpg",
    alt: "Femme avec flacon de parfum Maisssty",
    bgColor: "#D5C4BC" // Couleur poudrée pour le parfum
  },
  {
    id: 2,
    title: "Maissty Store – L'éclat d'un maquillage d'exception.",
    image: "/hero-lipstick.jpg",
    alt: "Femme avec rouge à lèvres Maisssty",
    bgColor: "#A48980" // Nuance mauve/vieux rose pour le rouge à lèvres
  },
  {
    id: 3,
    title: "Maissty Store – Le prestige de la maroquinerie de luxe.",
    image: "/hero-bag.jpg",
    alt: "Femme avec sac à main haut de gamme",
    bgColor: "#A2877E" // Teinte exacte pour le fond du sac bordeaux (image_850b91.jpg)
  }
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  // Défilement automatique toutes les 5 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      className="relative w-full h-[440px] md:h-[480px] lg:h-[520px] flex items-center overflow-hidden transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: SLIDES[current].bgColor }}
    >
      
      {/* Grille principale 50/50 */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 items-center relative z-10 h-full">
        
        {/* Côté Gauche : Texte de la boutique */}
        <div className="flex flex-col items-start space-y-6 z-20">
          <div className="h-32 flex items-center">
            <h1 className="font-playfair text-[#2C1810] text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.3] tracking-wide max-w-xl">
              {SLIDES[current].title}
            </h1>
          </div>
          
          <Link 
            href="/boutique" 
            className="inline-block bg-black text-white px-5 py-2.5 rounded-sm font-inter text-xs tracking-wide transition-colors hover:bg-neutral-900 shadow-sm"
          >
            Découvrir la collection
          </Link>
        </div>
      </div>

      {/* Côté Droit : Image + Masque de transition magique */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 h-full w-1/2 z-10">
        
        {/* 🪄 LE SECRET : Ce bloc crée un dégradé fluide qui fait fondre la photo dans le fond de gauche */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none z-20 transition-all duration-700 ease-in-out"
          style={{ 
            backgroundImage: `linear-gradient(to right, ${SLIDES[current].bgColor} 0%, transparent 100%)` 
          }}
        />

        {/* Liste des images en fondu croisé */}
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image 
              src={slide.image} 
              alt={slide.alt} 
              fill
              className="object-cover object-center pointer-events-none"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Rendu Adaptatif Mobile */}
      <div className="block md:hidden absolute inset-0 z-0 opacity-30 pointer-events-none">
        <Image 
          src={SLIDES[current].image}
          alt="Maisssty Mobile Slider" 
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Points indicateurs de navigation */}
      <div className="absolute bottom-6 left-1/2 md:left-[49%] -translate-x-1/2 flex items-center gap-1.5 z-30">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === current ? "w-4 bg-black" : "w-1.5 bg-black/20"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}

export default Hero;