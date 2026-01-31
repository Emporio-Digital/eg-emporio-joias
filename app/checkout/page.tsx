"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // Controla a tela de sucesso
  const [orderId, setOrderId] = useState<number | null>(null);

  // Estados do Formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  
  const [metodoPagamento, setMetodoPagamento] = useState("pix"); 
  const [freteSelecionado, setFreteSelecionado] = useState("motoboy"); 

  const subtotal = total; 
  const valorFrete = freteSelecionado === 'motoboy' ? 20.00 : 35.00;
  const valorDesconto = metodoPagamento === 'pix' ? subtotal * 0.05 : 0;
  const totalFinal = subtotal + valorFrete - valorDesconto;

  // === FUNÇÃO DE FINALIZAR COMPRA ===
  async function handleFinalizarCompra() {
    if (!nome || !email || !cpf || !whatsapp) {
        alert("Por favor, preencha todos os dados pessoais.");
        return;
    }
    if (items.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    setLoading(true);

    try {
        // 1. Verificar e Baixar Estoque (Item por Item)
        for (const item of items) {
            // Chama a função RPC segura no banco (previne venda dupla)
            const { data: stockSuccess, error: stockError } = await supabase
                .rpc('decrement_stock', { product_id: item.id, quantity: item.quantity });
            
            if (stockError || !stockSuccess) {
                throw new Error(`Estoque insuficiente para o produto: ${item.title}`);
            }
        }

        // 2. Criar Pedido na Tabela 'orders'
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    customer_name: nome,
                    customer_email: email,
                    customer_phone: whatsapp,
                    customer_cpf: cpf,
                    total_amount: totalFinal,
                    status: 'pending', // Pagamento pendente
                    payment_method: metodoPagamento,
                    shipping_method: freteSelecionado,
                    items: items // Salva o JSON dos itens
                }
            ])
            .select()
            .single();

        if (orderError) throw orderError;

        // 3. Sucesso!
        setOrderId(orderData.id);
        clearCart();
        setSuccess(true);
        // Aqui chamaria a API do Mercado Pago no futuro

    } catch (error: any) {
        console.error(error);
        alert("Erro ao processar pedido: " + error.message);
        // Obs: Em um sistema real, se falhar o pedido, deveríamos estornar o estoque.
        // Faremos essa melhoria na fase de Backend Avançado.
    } finally {
        setLoading(false);
    }
  }

  // === TELA DE SUCESSO E MARKETING DIGITAL ===
  if (success) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-center">
                
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>

                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Pedido Confirmado!</h1>
                <p className="text-gray-500 mb-8">Obrigado, {nome}. Seu pedido <strong>#{orderId}</strong> foi recebido com sucesso.</p>

                <div className="bg-gold-50 border border-gold-200 rounded-xl p-6 mb-8">
                    <p className="text-sm text-gold-800 font-bold mb-2">Próximos Passos:</p>
                    <p className="text-xs text-gold-700">
                        Enviamos os detalhes do pagamento (Código Pix) para seu e-mail: <strong>{email}</strong>.
                        <br />Assim que confirmado, iniciaremos o envio.
                    </p>
                </div>

                {/* === MARKETING EG EMPÓRIO DIGITAL === */}
                <div className="relative overflow-hidden rounded-2xl bg-gray-900 text-white p-8 md:p-10 border border-gray-700 shadow-xl group cursor-default">
                    {/* Efeito de fundo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="text-left flex-1">
                            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Parceiro Oficial</h3>
                            <h2 className="text-2xl font-bold mb-2">Gostou deste site?</h2>
                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                A <strong className="text-white">EG Empório Digital</strong> cria experiências digitais de alto padrão, como esta loja. Landing Pages, E-commerces e Sistemas Web.
                            </p>
                            <a 
                                href="https://egemporiodigital.com.br" 
                                target="_blank"
                                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wide hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-1"
                            >
                                Conhecer Serviços
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </a>
                        </div>
                        {/* Ilustração Simples de Código/Tech */}
                        <div className="text-6xl md:text-8xl opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500">
                            🚀
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 underline">
                        Voltar para a Loja
                    </Link>
                </div>

            </div>
        </div>
    );
  }

  // === TELA DE CHECKOUT NORMAL ===
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
                    <input type="text" placeholder="Nome Completo *" className="input-padrao" value={nome} onChange={e => setNome(e.target.value)} />
                    <input type="email" placeholder="E-mail *" className="input-padrao" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="text" placeholder="CPF *" className="input-padrao" value={cpf} onChange={e => setCpf(e.target.value)} />
                    <input type="tel" placeholder="WhatsApp *" className="input-padrao" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
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

                {metodoPagamento === "pix" ? (
                    <div className="bg-green-50/50 p-6 rounded-xl border border-green-100 text-center animate-fade-in">
                        <p className="text-sm text-gray-700 mb-2">O código Pix será gerado após clicar em Finalizar.</p>
                        <p className="text-xs text-gray-500">Aprovação imediata.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in opacity-50 grayscale pointer-events-none select-none">
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
                
                <div className="flex flex-col gap-4 mb-6 max-h-60 overflow-y-auto pr-2">
                    {items.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg relative overflow-hidden border border-white flex-shrink-0">
                                <img src={item.image || '/bg-joias.png'} alt="Produto" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-gray-800 line-clamp-2">{item.title}</p>
                                <p className="text-[10px] text-gray-500">Qtd: {item.quantity}</p>
                                <p className="text-xs font-bold text-gold-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="h-[1px] bg-gray-200 w-full mb-4"></div>

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

                <button 
                    onClick={handleFinalizarCompra}
                    disabled={loading || items.length === 0}
                    className="w-full py-4 bg-green-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-600/30 transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span>Processando...</span>
                    ) : (
                        <>
                            <span>Finalizar e Pagar</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </>
                    )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 opacity-50 grayscale">
                     <span className="text-[10px]">🔒 Processado por Mercado Pago</span>
                </div>
            </div>
        </div>
      </div>
      <style jsx global>{`
        .input-padrao {
            width: 100%;
            background-color: rgba(255, 255, 255, 0.5);
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.3s;
            color: #1f2937;
        }
        .input-padrao:focus {
            border-color: #eab308;
            background-color: #ffffff;
            box-shadow: 0 0 0 4px rgba(234, 179, 8, 0.1);
        }
      `}</style>
    </div>
  );
}