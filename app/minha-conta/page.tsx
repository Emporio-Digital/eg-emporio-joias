"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MinhaConta() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      fetchMyOrders();
    }
  }, [user, loading, router]);

  async function fetchMyOrders() {
    if (!user?.email) return;
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });
      
      if (data) setOrders(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoadingOrders(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-yellow-500 font-serif italic">
        Carregando seu portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 md:px-8 max-w-4xl mx-auto">
      
      {/* CABEÇALHO DO CLIENTE - ESTILO VIP */}
      <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-6 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-yellow-500"><path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" /></svg>
        </div>
        
        <div className="flex flex-col gap-4 relative z-10">
          <div>
            <h1 className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-2 font-bold">Portal do Cliente</h1>
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-700 to-yellow-400 flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-yellow-500/20">
                 {user.user_metadata?.full_name?.substring(0, 1) || "C"}
               </div>
               <div>
                  <p className="text-2xl font-serif text-white leading-tight">
                    Olá, <span className="text-yellow-500">{user.user_metadata?.full_name?.split(' ')[0] || "Cliente"}</span>
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user.email}</p>
               </div>
            </div>
          </div>
          
          <button 
            onClick={signOut}
            className="w-fit text-[10px] font-bold uppercase tracking-widest text-red-400 border border-red-400/20 px-4 py-2 rounded-full hover:bg-red-400/10 transition-all"
          >
            Sair da Conta
          </button>
        </div>
      </div>

      {/* SEÇÃO DE PEDIDOS */}
      <div className="space-y-6">
        <h2 className="text-xs font-bold text-white uppercase tracking-[0.4em] flex items-center gap-4">
          Meus Pedidos <span className="h-[1px] flex-1 bg-white/10"></span>
        </h2>

        {loadingOrders ? (
            <div className="text-center py-10">
                <div className="inline-block w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : orders.length === 0 ? (
            <div className="bg-neutral-900/20 border border-white/5 p-10 rounded-3xl text-center">
                <p className="text-gray-400 font-serif italic mb-6">Nenhum pedido encontrado no seu histórico.</p>
                <Link href="/" className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-yellow-500 transition-all shadow-xl">
                    Começar Coleção
                </Link>
            </div>
        ) : (
            <div className="grid gap-6">
                {orders.map((order) => {
                    // LINK DO WHATSAPP COM ID DINÂMICO
                    const message = encodeURIComponent(`Olá vim pelo site de Joias e preciso de ajuda com o pedido #${order.id}`);
                    const whatsappLink = `https://wa.me/5511916053292?text=${message}`;

                    return (
                        <div key={order.id} className="bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            {/* Header do Card */}
                            <div className="px-5 py-3 bg-white/[0.03] border-b border-white/5 flex justify-between items-center">
                                <span className="text-[9px] font-mono text-gray-500 uppercase">PEDIDO #{order.id.toString().substring(0,8)}</span>
                                <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
                                    order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                    order.status === 'paid' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                    'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                }`}>
                                    {order.status === 'pending' ? 'Pendente' : order.status === 'delivered' ? 'Entregue' : order.status}
                                </span>
                            </div>

                            {/* Corpo do Card */}
                            <div className="p-5">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Data da compra</p>
                                        <p className="text-sm text-gray-200">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total</p>
                                        <p className="text-xl font-serif text-yellow-500">
                                          R$ {Number(order.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>

                                {/* Listagem de Itens minimalista */}
                                <div className="mb-6 pt-4 border-t border-white/5">
                                    <p className="text-[9px] text-gray-600 uppercase font-bold mb-2 tracking-widest text-center">Itens do pedido</p>
                                    <ul className="space-y-1">
                                        {order.items && Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                                            <li key={idx} className="text-xs text-gray-400 flex justify-between">
                                                <span>{item.title}</span>
                                                <span className="text-gray-600">x{item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Botão Suporte WhatsApp Dinâmico */}
                                <a 
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#25D366]/20 transition-all"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.605 6.033L0 24l6.117-1.605a11.803 11.803 0 005.925 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.76 11.76 0 00-3.475-8.513" /></svg>
                                    Suporte do Pedido
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
}