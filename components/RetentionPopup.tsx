"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RetentionPopup() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("eg_retention_seen");
    
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 45000); 

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("eg_retention_seen", "true");
  };

  const handleRedirect = () => {
    handleClose();
    router.push("/cadastro");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay de Alto Foco */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal Luxo EG Privée */}
      <div className="relative bg-neutral-950 border border-yellow-500/30 rounded-[2rem] shadow-[0_0_50px_rgba(234,179,8,0.15)] w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row min-h-[400px]">
        
        {/* Lado Esquerdo: Identidade Visual */}
        <div className="w-full md:w-5/12 bg-neutral-900 relative flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-yellow-500/10">
             <div className="absolute inset-0 opacity-20 scale-125">
                <Image src="/bg-joias.png" alt="EG Logo Background" fill className="object-contain" />
             </div>
             
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 border border-yellow-500/40 rounded-full flex items-center justify-center mb-4">
                    <span className="text-yellow-500 text-2xl font-serif">EG</span>
                </div>
                <div className="h-[1px] w-12 bg-yellow-500/50 mb-4"></div>
                <span className="text-yellow-500 text-4xl font-serif italic">R$15</span>
                <p className="text-white text-[10px] uppercase tracking-[0.4em] mt-2 font-bold">OFF</p>
             </div>
             
             {/* Brilho Decorativo */}
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Lado Direito: O Convite */}
        <div className="w-full md:w-7/12 p-10 flex flex-col justify-center relative">
            <button 
                onClick={handleClose}
                className="absolute top-6 right-6 text-gray-500 hover:text-yellow-500 transition-colors p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">
                Membro Exclusivo
            </span>
            
            <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
                Um presente de <br />
                <span className="italic text-yellow-500">Boas-Vindas</span>
            </h3>
            
            <p className="text-sm text-gray-400 mb-8 leading-relaxed font-light">
                Desbloqueie um benefício exclusivo de <span className="text-white font-bold">R$15 OFF</span> na sua primeira compra e receba lançamentos em primeira mão.
            </p>

            <div className="flex flex-col gap-4">
                <button 
                    onClick={handleRedirect}
                    className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-yellow-500 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] transform hover:-translate-y-1 active:scale-95"
                >
                    Resgatar meu benefício
                </button>
                
                <button 
                    onClick={handleClose} 
                    className="w-full text-center text-[9px] text-gray-300 uppercase tracking-widest hover:text-gray-400 transition-colors"
                >
                    Não tenho interesse em ofertas exclusivas
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}