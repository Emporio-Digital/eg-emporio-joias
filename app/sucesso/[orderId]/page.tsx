"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function PaginaSucesso() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      // Busca o pedido no banco para garantir que os dados são reais e permanentes
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (!error && data) {
        setOrder(data);
      }
      setLoading(false);
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  const gerarLinkWhatsapp = () => {
    if (!order) return "#";

    const quebra = "\n"; 
    const traco = "--------------------------------";
    
    // 1. Cálculo dos itens (Subtotal)
    const subtotal = order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    
    // 2. Definição do Frete baseado no método salvo
    const valorFrete = order.shipping_method === 'motoboy' ? 25.00 : 35.00;

    // 3. Cálculo do Desconto Pix (5% sobre o subtotal) - Apenas se o método for pix
    const valorDescontoPix = order.payment_method === 'pix' ? subtotal * 0.05 : 0;

    // 4. Valor do Cupom (Cálculo matemático reverso para aceitar qualquer cupom dinâmico)
    let valorCupom = order.applied_coupon ? (subtotal + valorFrete - valorDescontoPix) - order.total_amount : 0;
    if (valorCupom < 0.01) valorCupom = 0; // Previne quebra de dízima flutuante

    const fmt = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const listaItens = order.items.map((i: any) => 
        `- ${i.quantity}x ${i.title}${i.size ? `${quebra}  Tam: ${i.size}` : ''}`
    ).join(quebra);

    const linhas = [
        `*NOVO PEDIDO REALIZADO*`,
        `Número do Pedido: #${order.id}`,
        traco,
        `*DADOS DO CLIENTE*`,
        `Nome: ${order.customer_name}`,
        `CPF: ${order.customer_cpf}`,
        traco,
        `*ENTREGA*`,
        `Método: ${order.shipping_method === 'motoboy' ? 'Motoboy Express' : 'Correios (PAC/Sedex)'}`,
        `Endereço: ${order.address_full}`,
        traco,
        `*ITENS DO PEDIDO*`,
        listaItens,
        traco,
        `*RESUMO FINANCEIRO*`,
        `Subtotal: ${fmt(subtotal)}`,
        `Frete: ${fmt(valorFrete)}`,
        order.applied_coupon ? `Cupom (${order.applied_coupon}): - ${fmt(valorCupom)}` : `Cupom: R$ 0,00`,
        order.payment_method === 'pix' ? `Desconto Pix (5%): - ${fmt(valorDescontoPix)}` : `Desconto Pix: R$ 0,00`,
        traco,
        `*TOTAL A PAGAR: ${fmt(order.total_amount)}*`,
        traco,
        `Aguardo a chave Pix para pagamento.`
    ];

    const mensagem = linhas.filter(l => l !== '').join(quebra);
    return `https://wa.me/5511952835361?text=${encodeURIComponent(mensagem)}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white font-serif italic">
      Carregando detalhes da sua joia...
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
      Pedido não encontrado.
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 pt-10 pb-20 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        
        {/* CARD PRINCIPAL */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          
          {/* ÍCONE DE SUCESSO */}
          <div className="w-20 h-20 bg-green-900/30 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="text-3xl font-serif font-bold text-white mb-2">Pedido Criado!</h1>
          <p className="text-gray-400 mb-8">Olá, {order.customer_name.split(' ')[0]}. Seu pedido <strong className="text-white">#{order.id}</strong> já está em nosso sistema.</p>

          {/* ÁREA DO WHATSAPP (Apenas para PIX) */}
          {order.payment_method === 'pix' && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6 mb-8 animate-pulse text-center">
              <p className="text-xs text-green-400 font-bold mb-2 uppercase tracking-widest">⚠️ Ação Necessária</p>
              <p className="text-gray-300 mb-6 text-sm">
                Para validar seus descontos e receber a chave Pix, envie os dados do pedido para nosso WhatsApp agora.
              </p>
              <a 
                href={gerarLinkWhatsapp()}
                target="_blank"
                className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-green-500 transition-all shadow-lg w-full justify-center"
              >
                Confirmar no WhatsApp
              </a>
            </div>
          )}

          {/* STATUS DO MERCADO PAGO (Apenas para Cartão) */}
          {order.payment_method === 'cartao' && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 mb-8 text-center">
              <p className="text-xs text-blue-400 font-bold mb-2 uppercase tracking-widest">✅ Pagamento Automático</p>
              <p className="text-gray-300 text-sm">
                Seu pagamento está sendo processado pelo Mercado Pago. O status será atualizado em instantes nesta página.
              </p>
            </div>
          )}

          {/* RESUMO TÉCNICO DETALHADO (FATURA DE LUXO) */}
          <div className="text-left bg-black/40 rounded-2xl p-6 border border-white/5 mb-8">
            <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Detalhes da Compra</h3>
            
            {/* LISTA DE PRODUTOS */}
            <div className="space-y-3 mb-6">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-400">{item.quantity}x {item.title}</span>
                    {item.size && <span className="text-[10px] text-yellow-500/70 font-bold uppercase tracking-widest italic">Opção: {item.size}</span>}
                  </div>
                  <span className="text-white font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-white/5 pt-4 mb-4">
              {/* CÁLCULOS DINÂMICOS PARA A TELA */}
              {(() => {
                const subtotal = order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
                const valorFrete = order.shipping_method === 'motoboy' ? 25.00 : 35.00;
                const valorDescontoPix = order.payment_method === 'pix' ? subtotal * 0.05 : 0;
                let valorCupom = order.applied_coupon ? (subtotal + valorFrete - valorDescontoPix) - order.total_amount : 0;
                if (valorCupom < 0.01) valorCupom = 0;
                const fmt = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

                return (
                  <>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtotal</span>
                      <span>{fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Frete ({order.shipping_method === 'motoboy' ? 'Motoboy' : 'Correios'})</span>
                      <span className="text-yellow-500/80">{fmt(valorFrete)}</span>
                    </div>
                    <div className={`flex justify-between text-xs ${valorCupom > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                      <span>Cupom {order.applied_coupon ? `(${order.applied_coupon})` : ''}</span>
                      <span>- {fmt(valorCupom)}</span>
                    </div>
                    <div className={`flex justify-between text-xs ${valorDescontoPix > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                      <span>Desconto Pix (5% OFF)</span>
                      <span>- {fmt(valorDescontoPix)}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-4">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Status Financeiro</span>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${order.payment_status === 'paid' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-black'}`}>
                {order.payment_status === 'paid' ? 'PAGO / APROVADO' : 'AGUARDANDO PAGAMENTO'}
              </span>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white uppercase tracking-tighter">Total Final</span>
                <span className="text-2xl font-bold text-white tracking-tighter">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_amount)}
                </span>
            </div>
          </div>

          {/* BANNER MARKETING EG DIGITAL */}
          <div className="relative overflow-hidden rounded-2xl bg-black border border-white/10 p-6 shadow-2xl group text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[50px]"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Agência Principal</h3>
                <h2 className="text-lg font-serif text-white mb-2 leading-tight">Gostou da experiência desta loja?</h2>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                  A <strong className="text-white">EG Empório Digital</strong> desenvolve e-commerces de luxo e sistemas sob medida.
                </p>
                <a 
                  href="https://egemporiodigital.com.br" 
                  target="_blank"
                  className="inline-flex items-center gap-2 text-xs font-bold text-white border border-white/20 px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-all"
                >
                  Conhecer a Agência
                </a>
              </div>
              <div className="hidden sm:block text-4xl opacity-20">🚀</div>
            </div>
          </div>

          <div className="mt-10">
            <Link href="/" className="text-sm text-gray-500 hover:text-white underline">
              Voltar para a Vitrine
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}