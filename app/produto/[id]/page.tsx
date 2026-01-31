"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";

// === DADOS TÉCNICOS DE MEDIDAS (Estáticos para Guia) ===
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
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
        if (!produtoId) return;
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', produtoId)
            .single();
        
        if (data) {
             setProduto(data);
             // Se tiver apenas um tamanho (ex: brinco 'único'), seleciona automaticamente
             if (data.sizes && data.sizes.length === 1) {
                 setSelectedSize(data.sizes[0]);
             }
        }
        if (error) console.error("Erro ao buscar produto:", error);
        setLoading(false);
    }
    fetchProduct();
  }, [produtoId]);

  const handleAddToCart = () => {
      if (!produto) return;
      if (produto.stock <= 0) return;
      
      // Se tiver opções de tamanho e o usuário não selecionou
      if (produto.sizes && produto.sizes.length > 0 && !selectedSize) {
          alert('Por favor, selecione um tamanho/opção.');
          return;
      }

      // Adiciona ao carrinho com o tamanho selecionado
      addToCart({
          ...produto,
          size: selectedSize
      });
  };

  if (loading) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      );
  }

  if (!produto) {
      return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-serif text-white">Produto não encontrado.</h1>
            <Link href="/" className="text-yellow-500 underline">Voltar para Início</Link>
        </div>
      );
  }

  const categoriaNormalizada = mapCategory(produto.category);
  const guiaAtual = categoriaNormalizada && categoriaNormalizada in tabelasMedidas 
    ? tabelasMedidas[categoriaNormalizada as keyof typeof tabelasMedidas] 
    : null;

  const precoExibicao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.sale_price || produto.price);
  
  const descontoPorcentagem = produto.sale_price 
    ? Math.round(((produto.price - produto.sale_price) / produto.price) * 100) 
    : 0;
  
  const isOutOfStock = produto.stock <= 0;

  return (
    <>
      <div className="w-full min-h-screen pt-10 pb-20 px-4 flex justify-center">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          
          {/* === COLUNA ESQUERDA: FOTO === */}
          <div className="w-full md:w-1/2 sticky top-24">
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 bg-black">
                  <Image 
                      src={produto.images?.[0] || '/placeholder.jpg'} 
                      alt={produto.title} 
                      fill 
                      className={`object-cover transition-transform duration-1000 ${isOutOfStock ? 'grayscale opacity-50' : 'hover:scale-110'}`}
                  />
                  
                  {isOutOfStock && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                         <span className="text-white font-bold border-2 border-white px-6 py-3 uppercase tracking-widest text-xl">Esgotado</span>
                     </div>
                  )}

                  {!isOutOfStock && produto.sale_price && (
                     <div className="absolute top-0 right-0 bg-gradient-to-bl from-yellow-300 via-yellow-500 to-yellow-600 text-black text-sm font-black px-6 py-2 rounded-bl-2xl shadow-lg tracking-wider transform transition-transform hover:scale-105 z-10">
                        {descontoPorcentagem}% OFF
                     </div>
                  )}
              </div>
          </div>
    
          {/* === COLUNA DIREITA: DETALHES (DARK) === */}
          <div className="w-full md:w-1/2 flex flex-col animate-fade-in bg-neutral-900/80 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-white/10 shadow-xl">
              
              <nav className="text-xs text-gray-400 mb-6 uppercase tracking-wider font-medium">
                  <Link href="/" className="hover:text-yellow-400 transition-colors">Início</Link> 
                  <span className="mx-2 text-gray-600">/</span> 
                  <span className="text-gray-500">Coleção</span> 
                  <span className="mx-2 text-gray-600">/</span> 
                  <span className="text-yellow-500 font-bold">{produto.title}</span>
              </nav>
    
              <h1 className="text-3xl md:text-5xl font-serif text-white mb-2">{produto.title}</h1>
              
              <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-yellow-500 text-sm">★★★★★</div>
                  <span className="text-xs text-gray-400">Novo lançamento exclusivo</span>
              </div>
    
              <div className="mb-2">
                 {produto.sale_price ? (
                    <div className="flex flex-col">
                        <span className="text-gray-500 line-through text-lg">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.price)}
                        </span>
                        <span className="text-4xl text-yellow-400 font-bold drop-shadow-sm">
                            {precoExibicao}
                        </span>
                    </div>
                 ) : (
                    <p className="text-4xl text-yellow-400 font-bold">{precoExibicao}</p>
                 )}
              </div>

              <p className="text-sm text-gray-300 mb-8">
                  Em até 10x sem juros no cartão ou <span className="text-green-400 font-bold">5% OFF</span> no Pix.
              </p>
    
              <div className="h-[1px] bg-white/10 w-full mb-8"></div>
    
              <div className="mb-8">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3">Descrição</h3>
                  <p className="text-gray-300 leading-relaxed font-light whitespace-pre-line">
                      {produto.description || "Uma joia exclusiva feita para durar. Banhada a ouro 18k com tripla camada de verniz italiano, garantindo brilho intenso e durabilidade superior."}
                  </p>
              </div>
    
              {/* SELEÇÃO DE TAMANHOS */}
              <div className="mb-10">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3">
                    {categoriaNormalizada === 'colar' ? 'Comprimento' : categoriaNormalizada === 'pulseira' ? 'Tamanho' : 'Selecione a Opção'}
                  </h3>
                  
                  <div className="flex gap-3 flex-wrap">
                      {produto.sizes && produto.sizes.length > 0 ? (
                          produto.sizes.map((t: string) => (
                              <button 
                                key={t} 
                                onClick={() => setSelectedSize(t)}
                                className={`btn-tamanho px-4 w-auto ${selectedSize === t ? 'border-yellow-500 bg-yellow-500 text-black font-bold' : ''}`}
                              >
                                {t}
                              </button>
                          ))
                      ) : (
                         <span className="text-sm text-gray-500 italic">Tamanho Único</span>
                      )}
                  </div>
                  
                  {guiaAtual && (
                    <button 
                        onClick={() => setShowGuia(true)}
                        className="text-[11px] text-gray-400 mt-4 underline cursor-pointer hover:text-yellow-400 flex items-center gap-1 transition-colors"
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
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full py-4 text-sm font-bold uppercase tracking-[0.2em] rounded-xl transition-all transform hover:-translate-y-1 active:scale-95 ${
                        isOutOfStock 
                        ? 'bg-neutral-800 text-gray-500 cursor-not-allowed hover:none'
                        : 'bg-white text-black hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                    }`}
                  >
                      {isOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
                  </button>
                  
                  {!isOutOfStock && (
                    <a 
                        href={`https://wa.me/5511916053292?text=Olá! Gostaria de saber mais sobre o produto: ${produto.title} (${precoExibicao})`} 
                        target="_blank"
                        className="w-full py-4 bg-green-600 text-white text-sm font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-green-500 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                        </svg>
                        Comprar no WhatsApp
                    </a>
                  )}
              </div>
    
              <div className="flex gap-4 mt-8 pt-6 border-t border-white/10 justify-center opacity-60 grayscale hover:grayscale-0 transition-all text-white">
                  <div className="text-center">
                      <span className="block text-2xl mb-1">🔒</span>
                      <span className="text-[10px] uppercase font-bold">Compra Segura</span>
                  </div>
                  <div className="text-center">
                      <span className="block text-2xl mb-1">💎</span>
                      <span className="text-[10px] uppercase font-bold">Garantia de 1 Ano</span>
                  </div>
              </div>
    
          </div>
        </div>
      </div>
    
      {/* === MODAL GUIA DE MEDIDAS === */}
      {showGuia && guiaAtual && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowGuia(false)}
            ></div>
            <div className="relative bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up text-white">
                <div className="p-4 bg-neutral-800 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-yellow-500">{guiaAtual.titulo}</h3>
                    <button onClick={() => setShowGuia(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6">
                    <p className="text-xs text-gray-300 mb-4">{guiaAtual.instrucao}</p>
                    <table className="w-full text-sm text-left border border-white/10 rounded-lg overflow-hidden">
                        <thead className="bg-neutral-800 text-gray-200">
                            <tr>
                                <th className="p-3 border-b border-white/10">{guiaAtual.colunas[0]}</th>
                                <th className="p-3 border-b border-white/10 text-center">{guiaAtual.colunas[1]}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-gray-300">
                            {guiaAtual.dados.map((linha, index) => (
                                <tr key={index}>
                                    <td className="p-3">{linha.col1}</td>
                                    <td className="p-3 text-center font-bold text-yellow-500">{linha.col2}</td>
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
            min-width: 3rem;
            height: 3rem;
            border-radius: 9999px;
            border: 1px solid rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
            color: #d1d5db;
            background: rgba(0,0,0,0.5);
            transition: all 0.3s;
        }
        .btn-tamanho:hover {
            border-color: #eab308;
            color: #000;
            background-color: #eab308;
            font-weight: bold;
        }
      `}</style>
    </>
  );
}