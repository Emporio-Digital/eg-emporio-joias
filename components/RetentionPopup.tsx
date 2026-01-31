"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Para redirecionar

export default function RetentionPopup() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verifica se já foi fechado nesta sessão
    const hasSeen = sessionStorage.getItem("eg_retention_seen");
    
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 10000); // 10 segundos

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("eg_retention_seen", "true");
  };

  const handleRedirect = () => {
    handleClose();
    router.push("/cadastro"); // Redireciona para a tela de cadastro oficial
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay Escuro */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up flex flex-col md:flex-row">
        
        {/* Lado Esquerdo (Visual) */}
        <div className="w-full md:w-2/5 bg-gray-900 relative min-h-[150px] md:min-h-full flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-40">
                <Image src="/bg-joias.png" alt="Bg" fill className="object-cover" />
             </div>
             <div className="relative z-10 text-center p-4">
                <span className="text-gold-500 text-3xl font-bold font-serif">VIP</span>
                <p className="text-white text-xs uppercase tracking-widest mt-1">Access</p>
             </div>
        </div>

        {/* Lado Direito (Texto e Ação) */}
        <div className="w-full md:w-3/5 p-8 relative">
            <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
                ✕
            </button>

            <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">Junte-se ao Clube</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Crie sua conta completa agora para desbloquear ofertas exclusivas e agilizar suas compras futuras.
                <br/><br/>
                <span className="text-gold-600 font-bold">Cadastre-se e ganhe benefícios imediatos.</span>
            </p>

            <button 
                onClick={handleRedirect}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold uppercase text-xs hover:bg-gold-600 transition-all shadow-lg hover:shadow-gold-500/20 transform hover:-translate-y-0.5"
            >
                Criar Minha Conta Agora
            </button>
            
            <button onClick={handleClose} className="w-full text-center mt-4 text-[10px] text-gray-400 underline hover:text-gray-600">
                Continuar navegando como visitante
            </button>
        </div>
      </div>
    </div>
  );
}