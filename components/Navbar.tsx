"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CartSidebar from "./CartSidebar";
import { useCart } from "@/context/CartContext"; 
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartOpen, setCartOpen, cartCount } = useCart();
  const { user } = useAuth();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || "Conta";

  return (
    <>
    <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

    {/* HEADER ESCURO */}
    <header className="sticky top-0 w-full z-50 bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-lg transition-all duration-500">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="flex items-center justify-between py-3 md:py-4">
          
          {/* 1. Logo e Nome (Esquerda) */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-gold-500 shadow-lg bg-black group-hover:scale-105 transition-transform duration-500">
              <Image src="/bg-joias.png" alt="Logo EG" fill className="object-cover" />
            </div>
            <div className="text-left flex flex-col justify-center">
              <h1 className="text-lg md:text-2xl font-bold text-white tracking-widest group-hover:text-gold-400 transition-colors font-serif">
                EG EMPÓRIO <span className="text-gold-500">JOIAS</span>
              </h1>
              <p className="hidden md:block text-[10px] text-gray-400 uppercase tracking-[0.25em] font-medium mt-0.5">
                Elegância em cada detalhe
              </p>
            </div>
          </Link>

          {/* 2. Menu Central e Login (Só Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-300 tracking-wide">
            <Link href="/" className="hover:text-gold-400 hover:scale-105 transition-all">INÍCIO</Link>
            <Link href="/colecoes" className="hover:text-gold-400 hover:scale-105 transition-all">COLEÇÕES</Link>
            <Link href="/sobre" className="hover:text-gold-400 hover:scale-105 transition-all">SOBRE NÓS</Link>
            
            <div className="h-6 w-[1px] bg-white/20 mx-2"></div>

            <Link 
              href={user ? "/minha-conta" : "/login"} 
              className="flex items-center gap-2 hover:text-gold-400 text-gray-300 transition-colors font-medium group"
            >
              <div className={`p-1.5 rounded-full border transition-colors ${user ? 'border-green-500/50 text-green-400' : 'border-white/10 group-hover:border-gold-500/50'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <span className="hidden xl:inline group-hover:underline decoration-gold-500/50 underline-offset-4">
                  {user ? `Olá, ${firstName}` : "Entrar"}
              </span>
            </Link>
          </nav>

          {/* 3. Ações Direita */}
          <div className="flex items-center gap-4">
            
            {/* CARRINHO (AGORA: HIDDEN NO MOBILE, FLEX NO DESKTOP) */}
            <button 
              onClick={() => setCartOpen(true)}
              className="hidden lg:flex items-center gap-2 text-gold-400 font-bold border border-gold-500/50 bg-gold-900/10 px-3 py-2 md:px-4 md:py-2 rounded-full hover:shadow-md hover:shadow-gold-500/20 transition-all group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span>({cartCount})</span>
            </button>

            {/* Menu Hambúrguer (Só Mobile) */}
            <button 
              className="lg:hidden text-white p-2"
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

            {/* WhatsApp (Só Desktop) */}
            <a 
              href="https://wa.me/5511916053292?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20EG%20Emp%C3%B3rio%20Joias%20e%20gostaria%20de%20atendimento." 
              target="_blank" 
              className="hidden lg:flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-5 py-2 rounded-full shadow-lg hover:shadow-green-500/30 transition-all text-xs font-bold uppercase tracking-wide hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

        {/* MENU MOBILE EXPANDIDO (COM CARRINHO AGORA) */}
        {menuOpen && (
          <div className="lg:hidden bg-neutral-900 border-t border-white/10 absolute top-full left-0 right-0 shadow-xl p-4 flex flex-col gap-4 animate-fade-in z-50">
             
             {/* CARRINHO NO MOBILE (DENTRO DO MENU) */}
             <button 
                onClick={() => { setMenuOpen(false); setCartOpen(true); }}
                className="w-full p-3 bg-neutral-800 border border-gold-500/30 rounded text-gold-400 font-bold flex justify-between items-center hover:bg-neutral-700 transition"
             >
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <span>MEU CARRINHO</span>
                </div>
                <span>({cartCount})</span>
             </button>

             <div className="h-[1px] bg-white/10 w-full"></div>

             <Link href="/" className="p-3 hover:bg-white/10 rounded text-gray-200 font-semibold" onClick={() => setMenuOpen(false)}>Início</Link>
             <Link href="/colecoes" className="p-3 hover:bg-white/10 rounded text-gray-200 font-semibold" onClick={() => setMenuOpen(false)}>Coleções</Link>
             
             {user ? (
                <Link href="/minha-conta" className="p-3 bg-neutral-800 border border-white/10 rounded text-yellow-500 font-bold" onClick={() => setMenuOpen(false)}>
                    Minha Conta (Olá, {firstName})
                </Link>
             ) : (
                <Link href="/login" className="w-full py-3 bg-white text-black rounded font-bold uppercase text-xs text-center block" onClick={() => setMenuOpen(false)}>
                    Entrar / Cadastrar
                </Link>
             )}

             <a href="https://wa.me/5511916053292?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20EG%20Emp%C3%B3rio%20Joias%20e%20gostaria%20de%20atendimento." className="w-full py-3 bg-green-700 text-white rounded font-bold uppercase text-xs flex justify-center items-center gap-2">
                <span>WhatsApp</span>
             </a>
          </div>
        )}
      </div>

      {/* BARRA PRETA E DOURADA (Mantida igual) */}
      <div className="w-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 border-t border-white/5 py-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-[10px] md:text-xs font-serif tracking-[0.2em] text-gray-300 font-bold uppercase">
              <span className="flex items-center gap-2 hover:text-gold-400 transition-colors cursor-default">
                 <span className="text-yellow-500 text-sm">✦</span> Ouro 18k
              </span>
              <span className="flex items-center gap-2 hover:text-gold-400 transition-colors cursor-default">
                 <span className="text-gray-500 text-sm">✦</span> Prata 925
              </span>
              <span className="flex items-center gap-2 hover:text-gold-400 transition-colors cursor-default">
                 <span className="text-gray-500 text-sm">✦</span> Ródio Branco
              </span>
          </div>
      </div>
    </header>
    </>
  );
}