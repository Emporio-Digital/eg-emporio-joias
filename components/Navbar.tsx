"use client";

import { useState, useEffect } from "react";
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

  // Trava o scroll da página quando o menu mobile está aberto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* HEADER PRINCIPAL - PADRÃO ABSOLUTO DA NUVEM */}
      <header className="sticky top-0 w-full z-50 bg-black border-b border-white/10 shadow-lg font-serif">

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between py-3 md:py-5">

            {/* 1. Logo e Nome (Esquerda) */}
            <Link href="/" className="flex items-center gap-3 md:gap-4 shrink-0">
              <div className="relative w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-gold-500 bg-black">
                <Image src="/bg-joias.png" alt="Logo EG" fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-lg md:text-2xl font-bold text-white tracking-widest uppercase">
                  EG EMPÓRIO <span className="text-gold-500">JOIAS</span>
                </h1>
                <p className="hidden md:block text-[10px] text-gray-400 uppercase tracking-[0.25em] font-medium mt-0.5 font-sans">
                  Elegância em cada detalhe
                </p>
              </div>
            </Link>

            {/* 2. Menu Desktop (Oculto no Mobile) */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-neutral-100 tracking-wide font-sans">
              <Link href="/" className="hover:text-gold-400 transition-all">INÍCIO</Link>
              <Link href="/colecoes" className="hover:text-gold-400 transition-all">COLEÇÕES</Link>
              <Link href="/sobre" className="hover:text-gold-400 transition-all">SOBRE NÓS</Link>
              <div className="h-6 w-[1px] bg-white/20 mx-2"></div>
              <Link
                href={user ? "/minha-conta" : "/login"}
                className="flex items-center gap-3 hover:text-gold-400 text-neutral-100 transition-colors font-medium group"
              >
                {/* ÍCONE DE USUÁRIO COM CÍRCULO */}
                <div className={`p-1.5 rounded-full border transition-colors ${user ? 'border-green-500/50 text-green-400' : 'border-white/20 group-hover:border-gold-500/50'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>

                <span className="text-xs tracking-widest uppercase">
                  {user ? `Olá, ${firstName}` : "Entrar"}
                </span>
              </Link>
            </nav>

            {/* 3. Ações Direita */}
            <div className="flex items-center gap-2 md:gap-4">

              {/* SACOLA DESKTOP (EFEITO PREMIUM DO MOBILE) */}
              <button
                onClick={() => setCartOpen(true)}
                className="hidden lg:flex items-center gap-2 text-gold-500 font-bold border border-gold-500/50 bg-gold-500/10 px-5 py-2.5 rounded-xl hover:bg-gold-500/20 transition-all font-sans text-xs tracking-widest"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <span>SACOLA ({cartCount})</span>
              </button>

              {/* WHATSAPP DESKTOP */}
              <a
                href="https://wa.me/5511916053292"
                target="_blank"
                className="hidden lg:flex items-center gap-2 bg-[#108542] hover:bg-[#0e6d62] text-white px-5 py-2.5 rounded-full shadow-lg transition-all text-xs font-bold uppercase tracking-widest font-sans"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.658 1.43 5.63 1.432h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                <span>WhatsApp</span>
              </a>

              {/* BOTÃO HAMBÚRGUER (MOBILE) */}
              <button
                className="lg:hidden text-white p-2"
                onClick={() => setMenuOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* BARRA DE CATEGORIAS (SUB-HEADER) CORRIGIDA */}
        {!menuOpen && (
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
        )}

        {/* MENU MOBILE OVERLAY - CAMADA SUPERIOR COMPLETA */}
        {menuOpen && (
          <div className="fixed inset-0 z-[10000] bg-black flex flex-col font-serif">

            {/* TOPO DO MENU (LOGO + X) - MATEMATICAMENTE IDÊNTICO AO HEADER ORIGINAL */}
            <div className="border-b border-white/10 shrink-0">
              <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between py-3 md:py-5">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="relative w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-gold-500 bg-black overflow-hidden shrink-0">
                    <Image src="/bg-joias.png" alt="Logo EG" fill className="object-cover" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold text-white tracking-widest uppercase">
                    EG EMPÓRIO <span className="text-gold-500">JOIAS</span>
                  </h2>
                </div>
                <button onClick={() => setMenuOpen(false)} className="text-white p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* CONTEÚDO DO MENU (VISUAL DO PRINT) */}
            <div className="flex-1 flex flex-col items-center justify-start px-6 pt-12 overflow-y-auto">

              {/* BOTÃO MINHA SACOLA */}
              <button
                onClick={() => { setMenuOpen(false); setCartOpen(true); }}
                className="w-full max-w-[340px] py-4 border border-gold-500/50 bg-gold-500/5 text-gold-500 flex justify-center items-center gap-3 rounded-xl mb-14 active:scale-95 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <span className="text-lg tracking-[0.2em] uppercase font-bold">Minha Sacola ({cartCount})</span>
              </button>

              {/* LINKS CENTRAIS */}
              <nav className="flex flex-col items-center gap-10 mb-14">
                <Link href="/" className="text-2xl text-white uppercase tracking-[0.3em]" onClick={() => setMenuOpen(false)}>Início</Link>
                <Link href="/colecoes" className="text-2xl text-white uppercase tracking-[0.3em]" onClick={() => setMenuOpen(false)}>Coleções</Link>
                <Link href="/sobre" className="text-2xl text-white uppercase tracking-[0.3em]" onClick={() => setMenuOpen(false)}>Sobre Nós</Link>
              </nav>

              {/* BOTÕES DE AÇÃO INFERIORES */}
              <div className="w-full max-w-[340px] flex flex-col gap-4 mt-auto mb-10">
                {user ? (
                  <Link href="/minha-conta" className="w-full py-3 bg-neutral-900 border border-white/10 text-gold-500 rounded-full font-bold uppercase text-[10px] text-center tracking-[0.2em] font-sans" onClick={() => setMenuOpen(false)}>
                    Minha Conta ({firstName})
                  </Link>
                ) : (
                  <Link href="/login" className="w-full py-3 bg-white text-black rounded-full font-bold uppercase text-[10px] text-center tracking-[0.2em] font-sans shadow-xl" onClick={() => setMenuOpen(false)}>
                    Entrar / Cadastrar
                  </Link>
                )}

                <a href="https://wa.me/5511916053292" className="w-full py-3 bg-[#108542] text-white rounded-full font-bold uppercase text-[10px] flex justify-center items-center gap-2 tracking-[0.2em] font-sans shadow-lg">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.658 1.43 5.63 1.432h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  <span>Fale Conosco</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}