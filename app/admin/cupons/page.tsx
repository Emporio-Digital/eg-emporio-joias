"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// === MESMA SEGURANÇA DO PAINEL PRINCIPAL ===
const ADMIN_EMAILS = ["eg.emporiodigital@outlook.com"];

export default function AdminCupons() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [cupons, setCupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do formulário
  const [codigo, setCodigo] = useState("");
  const [valorDesconto, setValorDesconto] = useState("");
  const [pedidoMinimo, setPedidoMinimo] = useState("");
  const [criando, setCriando] = useState(false);

  // 1. EFEITO DE SEGURANÇA
  useEffect(() => {
    async function checkAdmin() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
            window.location.href = "/"; 
        } else {
            setIsAdmin(true);
            setCheckingAuth(false);
        }
    }
    checkAdmin();
  }, []);

  // 2. CARREGAR DADOS SE FOR ADMIN
  useEffect(() => {
    if (isAdmin) {
      carregarCupons();
    }
  }, [isAdmin]);

  async function carregarCupons() {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCupons(data || []);
    } catch (error) {
      console.error("Erro ao carregar cupons:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCriarCupom(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo || !valorDesconto || !pedidoMinimo) {
      alert("Preencha todos os campos.");
      return;
    }

    setCriando(true);
    try {
      const { error } = await supabase.from("coupons").insert([
        {
          code: codigo.trim().toUpperCase(),
          discount_value: parseFloat(valorDesconto),
          min_order_value: parseFloat(pedidoMinimo),
          is_active: true,
        },
      ]);

      if (error) throw error;

      alert("Cupom criado com sucesso!");
      setCodigo("");
      setValorDesconto("");
      setPedidoMinimo("");
      carregarCupons();
    } catch (error: any) {
      alert("Erro ao criar cupom: " + error.message);
    } finally {
      setCriando(false);
    }
  }

  async function handleDeletar(id: number) {
    if (!confirm("Tem certeza que deseja excluir este cupom?")) return;
    
    try {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
      carregarCupons();
    } catch (error) {
      alert("Erro ao excluir.");
    }
  }

  async function handleToggleStatus(id: number, statusAtual: boolean) {
    try {
      const { error } = await supabase
        .from("coupons")
        .update({ is_active: !statusAtual })
        .eq("id", id);
        
      if (error) throw error;
      carregarCupons();
    } catch (error) {
      alert("Erro ao alterar status.");
    }
  }

  // TELA DE CARREGAMENTO / PROTEÇÃO
  if (checkingAuth || !isAdmin) {
      return (
          <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
      );
  }

  // TELA REAL DE CUPONS (Mesmo padrão visual do painel)
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto bg-neutral-950 text-gray-100">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-neutral-800 pb-8">
          <div>
            <h1 className="text-3xl font-serif text-white">Gestão de Cupons</h1>
            <p className="text-gray-400 mt-1">Crie descontos para suas campanhas promocionais.</p>
          </div>
          <Link href="/admin" className="text-sm bg-neutral-800 text-white border border-neutral-700 px-6 py-3 rounded-lg hover:bg-neutral-700 transition font-bold">
            Voltar ao Dashboard
          </Link>
        </div>

        {/* Criar Novo Cupom */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8 shadow-xl">
          <h2 className="text-lg font-bold mb-4 text-yellow-500">Criar Novo Cupom</h2>
          <form onSubmit={handleCriarCupom} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs text-gray-400 mb-1 block font-bold">Código do Cupom</label>
              <input 
                type="text" 
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 uppercase"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder="Ex: DIADASMAES"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs text-gray-400 mb-1 block font-bold">Desconto R$</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500"
                value={valorDesconto}
                onChange={e => setValorDesconto(e.target.value)}
                placeholder="Ex: 50.00"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs text-gray-400 mb-1 block font-bold">Pedido Mínimo R$</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500"
                value={pedidoMinimo}
                onChange={e => setPedidoMinimo(e.target.value)}
                placeholder="Ex: 199.00"
              />
            </div>
            <button 
              type="submit" 
              disabled={criando}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl transition-all w-full md:w-auto disabled:opacity-50"
            >
              {criando ? "Criando..." : "Salvar Cupom"}
            </button>
          </form>
        </div>

        {/* Lista de Cupons */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-neutral-800">
            <h2 className="text-lg font-bold text-white">Cupons Cadastrados</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Consultando banco de dados...</div>
          ) : cupons.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhum cupom ativo no momento.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-800 text-xs uppercase text-gray-400">
                    <th className="p-4 font-bold">Código</th>
                    <th className="p-4 font-bold">Desconto</th>
                    <th className="p-4 font-bold">Pedido Mínimo</th>
                    <th className="p-4 font-bold text-center">Status</th>
                    <th className="p-4 font-bold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-sm">
                  {cupons.map((cupom) => (
                    <tr key={cupom.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="p-4 font-bold text-yellow-500">{cupom.code}</td>
                      <td className="p-4 text-white">R$ {cupom.discount_value.toFixed(2)}</td>
                      <td className="p-4 text-gray-400">R$ {cupom.min_order_value.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleToggleStatus(cupom.id, cupom.is_active)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                            cupom.is_active ? 'bg-green-900/40 text-green-400 border border-green-500/30 hover:bg-green-900/60' : 'bg-neutral-800 text-gray-500 border border-neutral-600 hover:bg-neutral-700'
                          }`}
                        >
                          {cupom.is_active ? '✅ Ativo' : '❌ Inativo'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeletar(cupom.id)}
                          className="bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors p-2 rounded-lg"
                          title="Excluir Definitivamente"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </div>
  );
}