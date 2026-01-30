"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CartSidebar from "./CartSidebar";
import { useCart } from "@/context/CartContext"; // <--- Import do Contexto

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Usando dados reais do carrinho em vez de estado local
  const { cartOpen, setCartOpen, cartCount } = useCart();

  return (
    <>
    {/* Componente do Carrinho (Controlado pelo Contexto) */}
    <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

    <header className="sticky top-0 w-full z-50 bg-white/85 backdrop-blur-2xl border-b border-white/60 shadow-lg transition-all duration-500">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="flex items-center justify-between py-3 md:py-4">
          
          {/* Logo e Nome */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-gold-300 shadow-lg bg-white group-hover:scale-105 transition-transform duration-500">
              <Image src="/bg-joias.png" alt="Logo EG" fill className="object-cover" />
            </div>
            <div className="text-left flex flex-col justify-center">
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 tracking-widest group-hover:text-gold-600 transition-colors font-serif">
                EG EMPÓRIO <span className="text-gold-500">JOIAS</span>
              </h1>
              <p className="hidden md:block text-[10px] text-gray-500 uppercase tracking-[0.25em] font-medium mt-0.5">Exclusividade em cada detalhe</p>
            </div>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-700 tracking-wide">
            <Link href="/" className="hover:text-gold-600 hover:scale-105 transition-all">INÍCIO</Link>
            <Link href="#" className="hover:text-gold-600 hover:scale-105 transition-all">COLEÇÕES</Link>
            <Link href="/sobre" className="hover:text-gold-600 hover:scale-105 transition-all">SOBRE NÓS</Link>
            
            <div className="h-6 w-[1px] bg-gray-300 mx-2"></div>

            {/* Ações */}
            <div className="flex items-center gap-4">
                <Link href="/login" className="flex items-center gap-2 hover:text-gold-600 transition-colors font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <span className="hidden xl:inline">Entrar</span>
                </Link>

                {/* Botão Carrinho (Abre via Contexto) */}
                <button 
                  onClick={() => setCartOpen(true)}
                  className="flex items-center gap-2 text-gold-700 font-bold border border-gold-400/30 bg-gold-50/50 px-4 py-2 rounded-full hover:shadow-md transition-all group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  {/* Número dinâmico do contexto */}
                  <span>({cartCount})</span>
                </button>
            </div>
          </nav>

          {/* Botão Hambúrguer Mobile */}
          <button 
            className="lg:hidden text-gray-800 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
               </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
               </svg>
            )}
          </button>

          {/* Botão WhatsApp Desktop */}
          <a 
            href="https://wa.me/5511916053292?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20EG%20Emp%C3%B3rio%20Joias%20e%20gostaria%20de%20atendimento." 
            target="_blank" 
            className="hidden lg:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow-lg hover:shadow-green-500/30 transition-all text-xs font-bold uppercase tracking-wide hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>

        {/* MENU MOBILE EXPANDIDO */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-xl p-4 flex flex-col gap-4 animate-fade-in z-50">
             <Link href="/" className="p-3 hover:bg-gold-50 rounded text-gray-800 font-semibold" onClick={() => setMenuOpen(false)}>Início</Link>
             <Link href="#" className="p-3 hover:bg-gold-50 rounded text-gray-800 font-semibold" onClick={() => setMenuOpen(false)}>Coleções</Link>
             <Link href="/sobre" className="p-3 hover:bg-gold-50 rounded text-gray-800 font-semibold" onClick={() => setMenuOpen(false)}>Sobre Nós</Link>
             <div className="h-[1px] bg-gray-200"></div>
             
             <Link href="/login" className="w-full py-3 bg-gray-900 text-white rounded font-bold uppercase text-xs text-center block" onClick={() => setMenuOpen(false)}>
                Entrar
             </Link>

             <a href="https://wa.me/5511916053292?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20EG%20Emp%C3%B3rio%20Joias%20e%20gostaria%20de%20atendimento." className="w-full py-3 bg-green-600 text-white rounded font-bold uppercase text-xs flex justify-center items-center gap-2">
                <span>WhatsApp</span>
             </a>
          </div>
        )}
      </div>

      <div className="w-full bg-white/50 border-t border-white/60 py-1.5 text-center text-[10px] md:text-xs text-gray-500 tracking-wider font-medium flex justify-center gap-6">
          <span>💎 Ouro 18k</span>
          <span>✨ Prata</span>
          <span>🛡️ Ródio Branco</span>
      </div>
    </header>
    </>
  );
}