"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Checkout() {
  const [metodoPagamento, setMetodoPagamento] = useState("pix"); // pix ou cartao
  const [freteSelecionado, setFreteSelecionado] = useState("motoboy"); // motoboy ou correios

  // === LÓGICA DE CÁLCULO (Correção Solicitada) ===
  const subtotal = 2500.00; // Valor vindo do carrinho
  const valorFrete = freteSelecionado === 'motoboy' ? 20.00 : 35.00;
  
  // Desconto só aplica se for PIX
  const valorDesconto = metodoPagamento === 'pix' ? subtotal * 0.05 : 0;
  
  const totalFinal = subtotal + valorFrete - valorDesconto;

  return (
    <div className="w-full min-h-screen pt-6 pb-20 px-4 flex justify-center bg-gray-50">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
        
        {/* === COLUNA ESQUERDA: FORMULÁRIOS === */}
        <div className="flex-1 flex flex-col gap-6">
            
            {/* 1. Identificação */}
            <section className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm animate-fade-in">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="bg-gold-50 text-gold-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <h2 className="text-lg font-serif font-bold text-gray-800">Dados Pessoais</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Nome Completo *" className="input-padrao" />
                    <input type="email" placeholder="E-mail *" className="input-padrao" />
                    <input type="text" placeholder="CPF *" className="input-padrao" />
                    <input type="tel" placeholder="WhatsApp *" className="input-padrao" />
                </div>
            </section>

            {/* 2. Entrega */}
            <section className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm animate-fade-in">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="bg-gold-50 text-gold-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <h2 className="text-lg font-serif font-bold text-gray-800">Endereço de Entrega</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <input type="text" placeholder="CEP *" className="input-padrao md:col-span-1" />
                    <div className="flex items-center text-xs text-gold-600 font-bold cursor-pointer hover:underline">
                        Não sei meu CEP
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Rua / Avenida *" className="input-padrao w-full" />
                    <input type="text" placeholder="Número *" className="input-padrao w-full" />
                    <input type="text" placeholder="Bairro *" className="input-padrao w-full" />
                    <input type="text" placeholder="Cidade *" className="input-padrao w-full" />
                </div>
                <input type="text" placeholder="Complemento (Apto, Bloco...)" className="input-padrao w-full" />

                {/* Opções de Frete */}
                <div className="mt-6 flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Opções de Envio</h3>
                    
                    {/* Opção 1: Motoboy */}
                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${freteSelecionado === 'motoboy' ? 'border-gold-500 bg-gold-50/30' : 'border-gray-200 hover:border-gold-300'}`}>
                        <div className="flex items-center gap-3">
                            <input 
                                type="radio" 
                                name="frete" 
                                checked={freteSelecionado === 'motoboy'} 
                                onChange={() => setFreteSelecionado('motoboy')}
                                className="accent-gold-500" 
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800">Motoboy Express (SP Capital)</span>
                                <span className="text-[10px] text-green-600 font-bold">Chega Hoje (se pedido até 14h)</span>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-gray-800">R$ 20,00</span>
                    </label>

                    {/* Opção 2: Correios */}
                    <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${freteSelecionado === 'correios' ? 'border-gold-500 bg-gold-50/30' : 'border-gray-200 hover:border-gold-300'}`}>
                        <div className="flex items-center gap-3">
                            <input 
                                type="radio" 
                                name="frete" 
                                checked={freteSelecionado === 'correios'} 
                                onChange={() => setFreteSelecionado('correios')}
                                className="accent-gold-500" 
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800">PAC / Sedex (Correios)</span>
                                <span className="text-[10px] text-gray-500">3 a 5 dias úteis</span>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-gray-800">R$ 35,00</span>
                    </label>
                </div>
            </section>

            {/* 3. Pagamento */}
            <section className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm animate-fade-in">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="bg-gold-50 text-gold-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-serif font-bold text-gray-800">Pagamento</h2>
                        <span className="text-[10px] text-gray-500">Processado via <strong>Mercado Pago</strong></span>
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <button 
                        onClick={() => setMetodoPagamento("pix")}
                        className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${metodoPagamento === "pix" ? "bg-green-50 border-green-500 text-green-700 shadow-sm" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                    >
                        PIX (5% OFF)
                    </button>
                    <button 
                        onClick={() => setMetodoPagamento("cartao")}
                        className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${metodoPagamento === "cartao" ? "bg-gray-900 border-gray-900 text-white shadow-lg" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                    >
                        Cartão de Crédito
                    </button>
                </div>

                {/* Conteúdo Dinâmico do Pagamento */}
                {metodoPagamento === "pix" ? (
                    <div className="bg-green-50/50 p-6 rounded-xl border border-green-100 text-center animate-fade-in">
                        <p className="text-sm text-gray-700 mb-2">O código Pix será gerado pelo <strong>Mercado Pago</strong>.</p>
                        <p className="text-xs text-gray-500">Aprovação imediata.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in opacity-50 grayscale pointer-events-none select-none">
                         {/* Form desativado visualmente apenas para indicar que será no próximo passo ou modal */}
                         <div className="col-span-2 text-center text-xs text-gray-500 mb-2">
                             O pagamento será realizado em ambiente seguro do Mercado Pago na próxima etapa.
                         </div>
                         <input type="text" placeholder="Número do Cartão" className="input-padrao w-full col-span-2" />
                         <input type="text" placeholder="Nome no Cartão" className="input-padrao w-full col-span-2" />
                         <input type="text" placeholder="Validade" className="input-padrao w-full" />
                         <input type="text" placeholder="CVV" className="input-padrao w-full" />
                    </div>
                )}
            </section>
        </div>

        {/* === COLUNA DIREITA: RESUMO === */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
            <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6 font-serif tracking-wide">Resumo do Pedido</h3>
                
                {/* Lista de Produtos (Simulada) */}
                <div className="flex flex-col gap-4 mb-6 max-h-60 overflow-y-auto pr-2">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg relative overflow-hidden border border-white">
                                <Image src="/bg-joias.png" alt="Produto" fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-gray-800 line-clamp-2">Anel Solitário Ouro 18k</p>
                                <p className="text-[10px] text-gray-500">Qtd: 1</p>
                                <p className="text-xs font-bold text-gold-600">R$ 1.250,00</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="h-[1px] bg-gray-200 w-full mb-4"></div>

                {/* Totais COM A MATEMÁTICA CORRIGIDA */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Subtotal</span>
                    <span className="text-xs font-bold text-gray-800">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                    </span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Frete ({freteSelecionado === 'motoboy' ? 'Motoboy' : 'Correios'})</span>
                    <span className="text-xs font-bold text-gold-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorFrete)}
                    </span>
                </div>
                
                {metodoPagamento === "pix" && (
                    <div className="flex justify-between items-center mb-2 text-green-600">
                        <span className="text-xs font-bold">Desconto Pix (5%)</span>
                        <span className="text-xs font-bold">
                            - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorDesconto)}
                        </span>
                    </div>
                )}

                <div className="h-[1px] bg-gray-200 w-full my-4"></div>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold text-gray-900 uppercase">Total</span>
                    <span className="text-xl font-bold text-gray-900 animate-pulse">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFinal)}
                    </span>
                </div>

                <button className="w-full py-4 bg-green-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-600/30 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                    <span>Finalizar e Pagar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                    </svg>
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 opacity-50 grayscale">
                     <span className="text-[10px]">🔒 Processado por Mercado Pago</span>
                </div>
            </div>
        </div>
      </div>

      {/* Estilo Global para Inputs desta página */}
      <style jsx global>{`
        .input-padrao {
            width: 100%;
            background-color: rgba(255, 255, 255, 0.5);
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem; /* rounded-xl */
            padding: 0.75rem 1rem;
            font-size: 0.875rem; /* text-sm */
            outline: none;
            transition: all 0.3s;
            color: #1f2937;
        }
        .input-padrao:focus {
            border-color: #eab308; /* border-gold-500 */
            background-color: #ffffff;
            box-shadow: 0 0 0 4px rgba(234, 179, 8, 0.1);
        }
      `}</style>
    </div>
  );
}