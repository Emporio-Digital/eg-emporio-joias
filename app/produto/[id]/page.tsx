"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

// === DADOS TÉCNICOS DE MEDIDAS (Estáticos) ===
const tabelasMedidas = {
  anel: {
    titulo: "Tabela de Anéis",
    instrucao: "Meça a circunferência do seu dedo com um barbante ou fita.",
    colunas: ["Circunferência", "Aro"],
    dados: [
      { col1: "5,00 cm", col2: "10" },
      { col1: "5,20 cm", col2: "12" },
      { col1: "5,40 cm", col2: "14" },
      { col1: "5,60 cm", col2: "16" },
      { col1: "5,80 cm", col2: "18" },
      { col1: "6,00 cm", col2: "20" },
      { col1: "6,20 cm", col2: "22" },
      { col1: "6,40 cm", col2: "24" },
      { col1: "6,60 cm", col2: "26" },
    ]
  },
  colar: {
    titulo: "Comprimento de Correntes",
    instrucao: "Visualize onde cada tamanho costuma ficar no corpo.",
    colunas: ["Tamanho", "Caimento Típico"],
    dados: [
      { col1: "40 cm", col2: "Choker (Bem justo ao pescoço)" },
      { col1: "45 cm", col2: "Curto (Na altura da saboneteira)" },
      { col1: "50 cm", col2: "Médio (Logo abaixo da saboneteira)" },
      { col1: "60 cm", col2: "Longo (Na altura do peito)" },
      { col1: "70 cm", col2: "Extra Longo (Abaixo do peito)" },
    ]
  },
  pulseira: {
    titulo: "Tamanho de Pulseiras",
    instrucao: "Meça seu pulso justo e adicione 1cm para folga.",
    colunas: ["Seu Pulso", "Tamanho Ideal"],
    dados: [
      { col1: "14 - 15 cm", col2: "PP (16cm)" },
      { col1: "16 - 17 cm", col2: "P (18cm)" },
      { col1: "18 - 19 cm", col2: "M (20cm)" },
      { col1: "20 - 21 cm", col2: "G (22cm)" },
    ]
  }
};

// Helper para mapear categorias do banco (plural) para as chaves da tabela (singular)
const mapCategory = (cat: string) => {
    if (!cat) return null;
    if (cat.includes('anel') || cat.includes('aneis')) return 'anel';
    if (cat.includes('colar')) return 'colar';
    if (cat.includes('pulseira')) return 'pulseira';
    if (cat.includes('brinco')) return 'brinco';
    return null;
};

export default function ProdutoDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const produtoId = parseInt(resolvedParams.id);
  
  const { addToCart } = useCart();
  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showGuia, setShowGuia] = useState(false);

  // Busca produto real no Supabase
  useEffect(() => {
    async function fetchProduct() {
        if (!produtoId) return;
        
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', produtoId)
            .single();
        
        if (data) setProduto(data);
        if (error) console.error("Erro ao buscar produto:", error);
        
        setLoading(false);
    }
    fetchProduct();
  }, [produtoId]);

  if (loading) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
        </div>
      );
  }

  if (!produto) {
      return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-serif text-gray-800">Produto não encontrado.</h1>
            <Link href="/" className="text-gold-600 underline">Voltar para Início</Link>
        </div>
      );
  }

  // Lógica da Tabela de Medidas
  const categoriaNormalizada = mapCategory(produto.category);
  const guiaAtual = categoriaNormalizada && categoriaNormalizada in tabelasMedidas 
    ? tabelasMedidas[categoriaNormalizada as keyof typeof tabelasMedidas] 
    : null;

  // Formatação de Preço
  const precoExibicao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.sale_price || produto.price);
  
  return (
    <>
      <div className="w-full min-h-screen pt-10 pb-20 px-4 flex justify-center">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          
          {/* === COLUNA ESQUERDA: FOTO === */}
          <div className="w-full md:w-1/2 sticky top-24">
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white">
                  <Image 
                      src={produto.images?.[0] || '/placeholder.jpg'} 
                      alt={produto.title} 
                      fill 
                      className="object-cover hover:scale-110 transition-transform duration-1000"
                  />
                  {/* Tag de Desconto na Foto */}
                  {produto.sale_price && (
                     <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        OFERTA
                     </div>
                  )}
              </div>
          </div>
    
          {/* === COLUNA DIREITA: DETALHES === */}
          <div className="w-full md:w-1/2 flex flex-col animate-fade-in bg-white/40 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-white/50">
              
              <nav className="text-xs text-gray-500 mb-6 uppercase tracking-wider font-medium">
                  <Link href="/" className="hover:text-gold-600 transition-colors">Início</Link> 
                  <span className="mx-2">/</span> 
                  <span className="text-gray-400">Coleção</span> 
                  <span className="mx-2">/</span> 
                  <span className="text-gold-600 font-bold">{produto.title}</span>
              </nav>
    
              <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-2">{produto.title}</h1>
              
              <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-gold-500 text-sm">★★★★★</div>
                  <span className="text-xs text-gray-400">Novo lançamento</span>
              </div>
    
              {/* Preço com lógica de Promoção */}
              <div className="mb-2">
                 {produto.sale_price ? (
                    <div className="flex flex-col">
                        <span className="text-gray-400 line-through text-lg">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.price)}
                        </span>
                        <span className="text-4xl text-green-600 font-bold">
                            {precoExibicao}
                        </span>
                    </div>
                 ) : (
                    <p className="text-4xl text-gold-600 font-bold">{precoExibicao}</p>
                 )}
              </div>

              <p className="text-sm text-gray-500 mb-8">
                  Em até 10x sem juros no cartão ou <span className="text-green-600 font-bold">5% OFF</span> no Pix.
              </p>
    
              <div className="h-[1px] bg-gray-200 w-full mb-8"></div>
    
              <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Descrição</h3>
                  <p className="text-gray-600 leading-relaxed font-light whitespace-pre-line">
                      {produto.description || "Uma joia exclusiva feita para durar. Banhada a ouro 18k com tripla camada de verniz italiano, garantindo brilho intenso e durabilidade superior."}
                  </p>
              </div>
    
              {/* Seletor de Opções (Baseado na categoria do banco) */}
              <div className="mb-10">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">
                    {categoriaNormalizada === 'colar' ? 'Comprimento' : categoriaNormalizada === 'pulseira' ? 'Tamanho' : 'Aro/Tamanho'}
                  </h3>
                  
                  <div className="flex gap-3 flex-wrap">
                      {/* Se for anel, exibe numerações padrão ou o que vier do banco no futuro */}
                      {categoriaNormalizada === 'anel' && [12, 14, 16, 18, 20, 22, 24].map((t) => (
                          <button key={t} className="btn-tamanho">{t}</button>
                      ))}
                      {categoriaNormalizada === 'colar' && ['45cm', '50cm', '60cm'].map((t) => (
                           <button key={t} className="btn-tamanho px-4 w-auto">{t}</button>
                      ))}
                      {categoriaNormalizada === 'pulseira' && ['P', 'M', 'G'].map((t) => (
                           <button key={t} className="btn-tamanho">{t}</button>
                      ))}
                      {categoriaNormalizada === 'brinco' && (
                          <span className="text-sm text-gray-500 italic border border-gray-200 px-3 py-1 rounded-full">Tamanho Único</span>
                      )}
                  </div>
                  
                  {/* Botão Guia de Medidas */}
                  {guiaAtual && (
                    <button 
                        onClick={() => setShowGuia(true)}
                        className="text-[10px] text-gray-500 mt-3 underline cursor-pointer hover:text-gold-600 flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        Guia de Medidas ({guiaAtual.titulo})
                    </button>
                  )}
              </div>
    
              <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => addToCart(produto)}
                    className="w-full py-4 bg-gray-900 text-white text-sm font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-gold-600 hover:shadow-xl hover:shadow-gold-500/20 transition-all transform hover:-translate-y-1 active:scale-95"
                  >
                      Adicionar ao Carrinho
                  </button>
                  
                  <a 
                      href={`https://wa.me/5511916053292?text=Olá! Gostaria de saber mais sobre o produto: ${produto.title} (${precoExibicao})`} 
                      target="_blank"
                      className="w-full py-4 bg-green-600 text-white text-sm font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-green-700 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                      </svg>
                      Comprar no WhatsApp
                  </a>
              </div>
    
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200/60 justify-center opacity-60 grayscale hover:grayscale-0 transition-all">
                  <div className="text-center">
                      <span className="block text-2xl">🔒</span>
                      <span className="text-[10px] uppercase font-bold">Compra Segura</span>
                  </div>
                  <div className="text-center">
                      <span className="block text-2xl">💎</span>
                      <span className="text-[10px] uppercase font-bold">Garantia Eterna</span>
                  </div>
              </div>
    
          </div>
        </div>
      </div>
    
      {/* === MODAL GUIA DE MEDIDAS === */}
      {showGuia && guiaAtual && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowGuia(false)}
            ></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">{guiaAtual.titulo}</h3>
                    <button onClick={() => setShowGuia(false)} className="text-gray-400 hover:text-red-500 text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6">
                    <p className="text-xs text-gray-500 mb-4">{guiaAtual.instrucao}</p>
                    <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3 border-b">{guiaAtual.colunas[0]}</th>
                                <th className="p-3 border-b text-center">{guiaAtual.colunas[1]}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-600">
                            {guiaAtual.dados.map((linha, index) => (
                                <tr key={index}>
                                    <td className="p-3">{linha.col1}</td>
                                    <td className="p-3 text-center font-bold">{linha.col2}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}
    
      <style jsx>{`
        .btn-tamanho {
            width: 3rem;
            height: 3rem;
            border-radius: 9999px;
            border: 1px solid #d1d5db;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
            color: #4b5563;
            transition: all 0.3s;
        }
        .btn-tamanho:hover {
            border-color: #eab308;
            color: #ca8a04;
            background-color: #fefce8;
        }
        .btn-tamanho:focus {
            background-color: #111827;
            color: #ffffff;
            border-color: #111827;
        }
      `}</style>
    </>
  );
}