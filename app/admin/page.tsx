'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Ícones SVG
const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Eye: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Alert: () => <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'estoque' | 'vendas'>('estoque');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Estado para Modal de Detalhes do Pedido
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Filtros
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    if (activeTab === 'estoque') {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data);
    } else {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (data) setOrders(data);
    }
  }

  async function handleMarkDelivered(id: number) {
    if(!confirm('Confirmar entrega do pedido?')) return;
    await supabase.from('orders').update({ status: 'delivered' }).eq('id', id);
    fetchData();
  }

  async function handleDeleteProduct(id: number) {
    if (!confirm('ATENÇÃO: Isso removerá o produto do site. Confirmar?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchData();
  }

  const filteredOrders = orders.filter(order => {
    const statusMatch = filterStatus === 'todos' ? true : order.status === filterStatus;
    const dateMatch = filterDate ? order.created_at.startsWith(filterDate) : true;
    return statusMatch && dateMatch;
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto bg-neutral-950 text-gray-100">
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-white">Painel Administrativo</h1>
        {activeTab === 'estoque' && (
          <Link href="/admin/novo" className="bg-yellow-500 text-black px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-yellow-400 transition shadow-lg font-bold">
            <Icons.Plus /> Novo Produto
          </Link>
        )}
      </div>

      {/* Navegação de Abas */}
      <div className="flex gap-6 mb-8 border-b border-neutral-800">
        <button 
          onClick={() => setActiveTab('estoque')}
          className={`pb-3 px-2 font-medium transition text-lg ${activeTab === 'estoque' ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-gray-500 hover:text-white'}`}
        >
          Gestão de Estoque
        </button>
        <button 
          onClick={() => setActiveTab('vendas')}
          className={`pb-3 px-2 font-medium transition text-lg ${activeTab === 'vendas' ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-gray-500 hover:text-white'}`}
        >
          Controle de Vendas
        </button>
      </div>

      {/* CONTEÚDO: ESTOQUE (DARK) */}
      {activeTab === 'estoque' && (
        <div className="bg-neutral-900 rounded-xl shadow p-6 overflow-x-auto border border-neutral-800">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-800 text-gray-400 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">Foto</th>
                <th className="p-4">Produto</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Estoque</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-neutral-800/50 transition">
                  <td className="p-4">
                    <div className="w-12 h-12 bg-neutral-800 rounded overflow-hidden">
                       <img src={p.images?.[0] || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-white">
                    {p.title}
                    {p.highlight && <span className="ml-2 bg-yellow-900/50 text-yellow-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-yellow-500/30">DESTAQUE</span>}
                  </td>
                  <td className="p-4">
                    {p.sale_price ? (
                      <div>
                        <span className="text-gray-500 line-through text-xs block">R$ {p.price}</span>
                        <span className="text-green-400 font-bold">R$ {p.sale_price}</span>
                      </div>
                    ) : (
                      <span className="text-gray-300">R$ {p.price}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock > 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {p.stock} un
                        </span>
                        {/* ALERTA DE ESTOQUE BAIXO */}
                        {p.stock > 0 && p.stock < 3 && (
                            <div className="tooltip" title="Estoque Baixo!">
                                <Icons.Alert />
                            </div>
                        )}
                    </div>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <Link 
                        href={`/admin/editar/${p.id}`} 
                        className="p-2 text-blue-400 hover:bg-blue-900/20 rounded transition flex items-center justify-center" 
                        title="Editar"
                    >
                        <Icons.Edit />
                    </Link>
                    
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-400 hover:bg-red-900/20 rounded transition" title="Excluir"><Icons.Trash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CONTEÚDO: VENDAS (DARK) */}
      {activeTab === 'vendas' && (
        <div className="bg-neutral-900 rounded-xl shadow p-6 border border-neutral-800">
          <div className="flex flex-wrap gap-4 mb-6 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
             <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 mb-1">Data do Pedido</label>
                <input type="date" className="p-2 border border-neutral-600 bg-neutral-700 text-white rounded text-sm" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
             </div>
             <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 mb-1">Status</label>
                <select className="p-2 border border-neutral-600 bg-neutral-700 text-white rounded text-sm min-w-[150px]" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                   <option value="todos">Todos</option>
                   <option value="pending">Pendente</option>
                   <option value="paid">Pago</option>
                   <option value="shipped">Enviado</option>
                   <option value="delivered">Entregue</option>
                </select>
             </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-neutral-800 text-gray-400 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Data</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nenhum pedido encontrado.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-neutral-800/50 transition">
                    <td className="p-4 text-gray-500">#{order.id}</td>
                    <td className="p-4 text-gray-300">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-white">{order.customer_name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-green-900/30 text-green-400' :
                        order.status === 'paid' ? 'bg-blue-900/30 text-blue-400' :
                        'bg-yellow-900/30 text-yellow-500'
                      }`}>
                        {order.status === 'pending' ? 'Pendente' : order.status === 'delivered' ? 'Entregue' : order.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">R$ {order.total_amount}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                       <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-xs bg-gray-700 text-white px-3 py-1.5 rounded hover:bg-gray-600 transition shadow flex items-center gap-1"
                       >
                         <Icons.Eye /> Ver
                       </button>
                      
                      {order.status !== 'delivered' && (
                        <button 
                          onClick={() => handleMarkDelivered(order.id)}
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-500 transition shadow"
                        >
                          Entregue
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DETALHES DO PEDIDO */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-serif text-white">Detalhes do Pedido #{selectedOrder.id}</h2>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="bg-neutral-800 p-4 rounded-lg">
                        <h3 className="font-bold text-yellow-500 mb-2 uppercase text-xs tracking-wider">Dados do Cliente</h3>
                        <p><span className="text-gray-400">Nome:</span> {selectedOrder.customer_name}</p>
                        <p><span className="text-gray-400">Email:</span> {selectedOrder.customer_email}</p>
                        <p><span className="text-gray-400">CPF:</span> {selectedOrder.customer_cpf}</p>
                        <p><span className="text-gray-400">Telefone:</span> {selectedOrder.customer_phone}</p>
                    </div>

                    <div className="bg-neutral-800 p-4 rounded-lg">
                        <h3 className="font-bold text-yellow-500 mb-2 uppercase text-xs tracking-wider">Entrega & Pagamento</h3>
                        <p><span className="text-gray-400">Método de Envio:</span> {selectedOrder.shipping_method}</p>
                        <p><span className="text-gray-400">Pagamento:</span> {selectedOrder.payment_method}</p>
                        <p><span className="text-gray-400">Total:</span> R$ {selectedOrder.total_amount}</p>
                    </div>

                    <div className="bg-neutral-800 p-4 rounded-lg">
                        <h3 className="font-bold text-yellow-500 mb-2 uppercase text-xs tracking-wider">Itens Comprados</h3>
                        <ul className="divide-y divide-neutral-700">
                            {selectedOrder.items && Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, idx: number) => (
                                <li key={idx} className="py-2 flex justify-between">
                                    <span>{item.title} {item.size ? `(Tam: ${item.size})` : ''} x{item.quantity}</span>
                                    <span className="text-gray-300">R$ {item.price}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}