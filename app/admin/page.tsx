'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Ícones SVG
const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'estoque' | 'vendas'>('estoque');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
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

  // Lógica de Filtro de Vendas
  const filteredOrders = orders.filter(order => {
    const statusMatch = filterStatus === 'todos' ? true : order.status === filterStatus;
    const dateMatch = filterDate ? order.created_at.startsWith(filterDate) : true;
    return statusMatch && dateMatch;
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto bg-[#f8f5f2]">
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-gray-800">Painel Administrativo</h1>
        {activeTab === 'estoque' && (
          <Link href="/admin/novo" className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-lg">
            <Icons.Plus /> Novo Produto
          </Link>
        )}
      </div>

      {/* Navegação de Abas */}
      <div className="flex gap-6 mb-8 border-b border-gray-300">
        <button 
          onClick={() => setActiveTab('estoque')}
          className={`pb-3 px-2 font-medium transition text-lg ${activeTab === 'estoque' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
        >
          Gestão de Estoque
        </button>
        <button 
          onClick={() => setActiveTab('vendas')}
          className={`pb-3 px-2 font-medium transition text-lg ${activeTab === 'vendas' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
        >
          Controle de Vendas
        </button>
      </div>

      {/* CONTEÚDO: ESTOQUE */}
      {activeTab === 'estoque' && (
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">Foto</th>
                <th className="p-4">Produto</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Estoque</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                       <img src={p.images?.[0] || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    {p.title}
                    {p.highlight && <span className="ml-2 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-bold border border-yellow-200">DESTAQUE</span>}
                  </td>
                  <td className="p-4">
                    {p.sale_price ? (
                      <div>
                        <span className="text-gray-400 line-through text-xs block">R$ {p.price}</span>
                        <span className="text-green-600 font-bold">R$ {p.sale_price}</span>
                      </div>
                    ) : (
                      <span>R$ {p.price}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock} un
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    {/* BOTÃO EDITAR CORRIGIDO AQUI PARA LINK */}
                    <Link 
                        href={`/admin/editar/${p.id}`} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition flex items-center justify-center" 
                        title="Editar"
                    >
                        <Icons.Edit />
                    </Link>
                    
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Excluir"><Icons.Trash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CONTEÚDO: VENDAS */}
      {activeTab === 'vendas' && (
        <div className="bg-white rounded-xl shadow p-6">
          {/* Barra de Filtros */}
          <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
             <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 mb-1">Data do Pedido</label>
                <input type="date" className="p-2 border rounded text-sm" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
             </div>
             <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 mb-1">Status</label>
                <select className="p-2 border rounded text-sm min-w-[150px]" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                   <option value="todos">Todos</option>
                   <option value="pending">Pendente</option>
                   <option value="paid">Pago</option>
                   <option value="shipped">Enviado</option>
                   <option value="delivered">Entregue</option>
                </select>
             </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Data</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nenhum pedido encontrado com esses filtros.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-500">#{order.id}</td>
                    <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">{order.customer_name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status === 'pending' ? 'Pendente' : order.status === 'delivered' ? 'Entregue' : order.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold">R$ {order.total_amount}</td>
                    <td className="p-4 text-right">
                      {order.status !== 'delivered' && (
                        <button 
                          onClick={() => handleMarkDelivered(order.id)}
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition shadow"
                        >
                          Marcar Entregue
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
    </div>
  );
}