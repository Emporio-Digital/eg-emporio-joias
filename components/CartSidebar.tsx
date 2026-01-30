"use client";

import Image from "next/image";
import Link from "next/link"; 
import { useCart } from "@/context/CartContext"; // <--- Import do Contexto

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Props isOpen e onClose agora podem ser ignorados se usarmos o contexto direto, 
// mas mantivemos para compatibilidade com a chamada no Navbar
export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  
  // Pegando dados reais do contexto
  const { items, total, removeFromCart, cartOpen, setCartOpen } = useCart();

  // Função interna para fechar usando o contexto
  const handleClose = () => {
    setCartOpen(false);
    onClose(); // Chama o prop se for passado
  };

  // Garante que usa o estado do contexto se disponível
  const openState = cartOpen || isOpen;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ${openState ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={handleClose}
      ></div>

      {/* Gaveta Lateral */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-2xl shadow-2xl z-[70] transform transition-transform duration-500 ease-out border-l border-white ${openState ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <h2 className="text-xl font-serif font-bold text-gray-800 tracking-wide">Seu Carrinho ({items.length})</h2>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Lista de Itens */}
        <div className="flex-1 overflow-y-auto p-6 h-[calc(100%-240px)]">
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 opacity-50">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <p className="text-sm font-medium">Seu carrinho está vazio</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {items.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex gap-4 items-center animate-fade-in">
                            <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-gray-200">
                                {/* Verifica se é URL externa ou arquivo local, se vazio poe placeholder */}
                                <img 
                                  src={item.image || '/bg-joias.png'} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{item.title}</h3>
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-gold-600 font-bold text-sm">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Qtd: {item.quantity}</span>
                                        <button 
                                          onClick={() => removeFromCart(item.id)}
                                          className="text-red-500 hover:text-red-700 text-xs font-medium ml-2"
                                        >
                                          Remover
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Rodapé do Carrinho */}
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 flex gap-3 items-start">
                <span className="text-lg">🚚</span>
                <p className="text-[10px] text-blue-800 leading-tight">
                    <span className="font-bold block mb-0.5">Entrega Flash (SP Capital)</span>
                    Pedidos confirmados até às <strong>14h</strong> são entregues no mesmo dia.
                </p>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 text-sm font-medium uppercase">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                </span>
            </div>
            
            <Link 
                href="/checkout"
                onClick={handleClose}
                className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gold-600 transition-all shadow-lg hover:shadow-gold-500/20 hover:-translate-y-1 block text-center"
            >
                Finalizar Compra
            </Link>
            
            <button 
                onClick={handleClose} 
                className="w-full mt-3 py-3 border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-colors"
            >
                Continuar Comprando
            </button>
        </div>

      </div>
    </>
  );
}