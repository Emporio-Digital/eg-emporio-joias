"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const BANNERS = [
  {
    id: 1,
    desktop: "/banners/banner-1-promo-desktop.jpg",
    mobile: "/banners/banner-1-promo-mobile.jpg",
  },
  {
    id: 2,
    desktop: "/banners/banner-2-principal-desktop.jpg",
    mobile: "/banners/banner-2-principal-mobile.jpg",
  },
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      proximoSlide();
    }, 8000);
    return () => clearInterval(intervalo);
  }, [index]);

  const proximoSlide = () => {
    setIndex((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
  };

  const slideAnterior = () => {
    setIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* 
          CONTAINER PRINCIPAL:
          - No Mobile: aspect-square (1:1) para caber a foto de 1080x1080 sem corte.
          - No Windows: md:aspect-[1920/600] para caber a foto panorâmica sem corte.
      */}
      <div className="relative w-full aspect-square md:aspect-[1920/600]">
        {BANNERS.map((banner, i) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Imagem Desktop */}
            <div className="hidden md:block relative w-full h-full">
              <Image
                src={banner.desktop}
                alt="Banner Joias Desktop"
                fill
                className="object-contain" // "contain" garante que a imagem apareça inteira
                priority={i === 0}
              />
            </div>
            
            {/* Imagem Mobile */}
            <div className="block md:hidden relative w-full h-full">
              <Image
                src={banner.mobile}
                alt="Banner Joias Mobile"
                fill
                className="object-contain" // "contain" garante que a imagem apareça inteira
                priority={i === 0}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Setas (Ajustei o tamanho para ficarem mais discretas) */}
      <button 
        onClick={slideAnterior} 
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-1 md:p-2 bg-black/10 hover:bg-black/40 text-white rounded-full transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <button 
        onClick={proximoSlide} 
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-1 md:p-2 bg-black/10 hover:bg-black/40 text-white rounded-full transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      {/* Indicadores (Pontinhos) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 transition-all duration-300 ${
              i === index ? "w-6 bg-yellow-500" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}