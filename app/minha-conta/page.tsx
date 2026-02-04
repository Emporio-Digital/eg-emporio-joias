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
    
    // Busca pedidos pelo email do usuário logado
    const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email) // Segurança: só vê os proprios
        .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoadingOrders(false);
  }

  if (loading || !user) return <div className="min-h-screen pt-32 text-center">Carregando perfil...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
      
      {/* CABEÇALHO DA CONTA */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-serif text-white mb-1">Minha Conta</h1>
            <p className="text-gray-400">Olá, <span className="text-yellow-500 font-bold">{user.user_metadata.full_name || "Cliente"}</span></p>
            <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <button 
            onClick={signOut}
            className="text-red-400 hover:text-red-300 text-sm underline font-medium"
        >
            Sair da Conta
        </button>
      </div>

      {/* LISTA DE PEDIDOS */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Meus Pedidos</h2>

        {loadingOrders ? (
            <div className="text-gray-500">Buscando histórico...</div>
        ) : orders.length === 0 ? (
            <div className="bg-neutral-900 border border-white/5 p-8 rounded-xl text-center">
                <p className="text-gray-400 mb-4">Você ainda não fez nenhum pedido.</p>
                <Link href="/" className="bg-white text-black px-6 py-3 rounded-full font-bold uppercase text-xs hover:bg-yellow-500 transition">
                    Ir às Compras
                </Link>
            </div>
        ) : (
            <div className="grid gap-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-neutral-900 border border-white/10 p-6 rounded-xl hover:border-yellow-500/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono text-xs text-gray-500">#{order.id}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                    order.status === 'delivered' ? 'bg-green-900/30 text-green-400' :
                                    order.status === 'paid' ? 'bg-blue-900/30 text-blue-400' :
                                    'bg-yellow-900/30 text-yellow-500'
                                }`}>
                                    {order.status === 'pending' ? 'Pendente' : order.status === 'delivered' ? 'Entregue' : order.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-300">Data: {new Date(order.created_at).toLocaleDateString()}</p>
                            <p className="text-sm text-white font-bold mt-1">Total: R$ {order.total_amount}</p>
                        </div>

                        {/* Lista simplificada de itens */}
                        <div className="flex-1 md:px-8">
                             <p className="text-xs text-gray-500 mb-1">Itens:</p>
                             <ul className="text-sm text-gray-300">
                                {order.items && Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                                    <li key={idx} className="truncate max-w-[200px] md:max-w-xs">
                                        • {item.quantity}x {item.title}
                                    </li>
                                ))}
                             </ul>
                        </div>

                        {order.status !== 'delivered' && (
                            <a 
                                href="https://wa.me/5511916053292"
                                target="_blank"
                                className="text-xs bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                            >
                                Falar no WhatsApp
                            </a>
                        )}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}