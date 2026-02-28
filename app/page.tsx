'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link'; 

type Product = {
  id: number;
  title: string;
  price: number;
  sale_price?: number; 
  highlight?: boolean; 
  is_visible?: boolean;
  images: string[];
  category: string;
  description: string;
  stock: number;
  display_order?: number;
};

// Dados dos Depoimentos
const testimonials = [
  { name: "Camila S.", text: "Impressionada com o acabamento. Já comprei joias online antes, mas a qualidade da EG superou minhas expectativas. Chegou super rápido!" },
  { name: "Ricardo M.", text: "O atendimento pelo WhatsApp foi o diferencial. Me ajudaram a escolher o tamanho exato da aliança. Ficou perfeita no dedo." },
  { name: "Felipe A.", text: "Comprei um colar para presentear minha esposa e ela amou. A embalagem é muito luxuosa, nem precisei embrulhar." },
  { name: "Juliana Paes", text: "Peças delicadas e com um brilho incrível. Dá para ver que é ouro de verdade e feito com carinho. Virei cliente fiel." },
  { name: "Beatriz L.", text: "Segurança total na compra. Tive receio por ser loja nova, mas recebi o código de rastreio na hora e chegou tudo certinho." },
  { name: "Gustavo R.", text: "A corrente é de qualidade, exatamente como na descrição. Valeu cada centavo. Recomendo demais a EG Empório." },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaura posição do scroll manualmente se necessário
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true }) 
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const destaques = products.filter(p => p.highlight === true);
  const normais = products.filter(p => !p.highlight);

  const formatMoney = (value: number) => 
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const calculateDiscount = (original: number, sale: number) => {
    if (!original || !sale) return 0;
    return Math.round(((original - sale) / original) * 100);
  };

  // SKELETON GIGANTE PARA SEGURAR O SCROLL
  const ProductSkeleton = () => (
    <div className="rounded-2xl border border-white/5 bg-neutral-900/50 h-[380px] w-full animate-pulse flex flex-col">
        <div className="h-64 bg-white/5 w-full"></div>
        <div className="p-4 space-y-3 flex-1">
            <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
            <div className="h-8 bg-white/10 rounded w-1/2 mx-auto"></div>
        </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      
        {/* === SEÇÃO DESTAQUES === */}
        <section className="w-full max-w-7xl mt-10 px-4 mb-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-[1px] bg-gradient-to-r from-transparent to-yellow-500 flex-1"></div>
              <h2 className="text-3xl md:text-4xl font-light text-white uppercase tracking-[0.2em] text-center drop-shadow-sm">
                Coleção <span className="text-yellow-500 font-bold serif italic">Exclusiva</span>
              </h2>
              <div className="h-[1px] bg-gradient-to-l from-transparent to-yellow-500 flex-1"></div>
            </div>

            {loading ? (
               // Renderiza 4 skeletons para segurar altura
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
                  {[1,2,3,4].map(i => <ProductSkeleton key={i} />)}
               </div>
            ) : destaques.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {destaques.map((item) => {
                  const discountPercent = item.sale_price ? calculateDiscount(item.price, item.sale_price) : 0;
                  const isOutOfStock = item.stock <= 0;

                  return (
                    <Link href={`/produto/${item.id}`} key={item.id} className="group relative backdrop-blur-md bg-black/40 border border-white/10 hover:border-yellow-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-2 cursor-pointer block shadow-sm">
                      <div className="relative h-80 w-full overflow-hidden bg-white/5">
                         <img 
                            src={item.images?.[0] || 'https://via.placeholder.com/400x500?text=Sem+Foto'} 
                            alt={item.title} 
                            className={`w-full h-full object-cover transition-transform duration-700 ${isOutOfStock ? 'grayscale opacity-50' : 'group-hover:scale-110'}`} 
                         />
                         
                         {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                                <span className="text-white font-bold border-2 border-white px-4 py-2 uppercase tracking-widest text-lg">Esgotado</span>
                            </div>
                         )}

                         {!isOutOfStock && discountPercent > 0 && (
                            <div className="absolute top-0 right-0 bg-gradient-to-bl from-yellow-300 via-yellow-500 to-yellow-600 text-black text-xs font-black px-4 py-2 rounded-bl-xl shadow-lg tracking-widest z-10">
                                {discountPercent}% OFF
                            </div>
                         )}
                      </div>
                      
                      <div className="p-6 text-center">
                        <h3 className="text-lg font-medium text-gray-100 truncate font-serif">{item.title}</h3>
                        <div className="h-[1px] w-12 bg-yellow-500/50 mx-auto my-3"></div>
                        
                        <div className="flex flex-col items-center justify-center h-14">
                           {item.sale_price ? (
                              <>
                                <span className="text-gray-500 line-through text-xs mb-1">de {formatMoney(item.price)}</span>
                                <p className="text-yellow-400 font-extrabold text-2xl">
                                  {formatMoney(item.sale_price)}
                                </p>
                              </>
                           ) : (
                              <p className="text-yellow-400 font-extrabold text-2xl">
                                {formatMoney(item.price)}
                              </p>
                           )}
                        </div>
                        
                        <p className="text-xs text-gray-400 mt-1 mb-4">em até 10x</p>
                        
                        <div className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center ${
                            isOutOfStock 
                            ? 'bg-neutral-800 text-gray-500'
                            : 'bg-white text-black group-hover:bg-yellow-500'
                        }`}>
                          {isOutOfStock ? 'Indisponível' : 'Ver Detalhes'}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
        </section>

        {/* === SEÇÃO PRODUTOS NORMAIS === */}
        <section className="w-full max-w-7xl px-4 pb-20 mt-8 min-h-[800px]">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
             <div className="flex items-center">
                <div className="w-1.5 h-8 bg-yellow-500 mr-4 rounded-full"></div>
                <h3 className="text-2xl text-white uppercase tracking-wider font-light">Todas as Joias</h3>
             </div>
             <span className="text-sm text-gray-400 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10">
               {loading ? '...' : normais.length} produtos
             </span>
          </div>
          
          {loading ? (
             // Renderiza MUITOS skeletons para simular a altura real da lista
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-64 bg-neutral-900 rounded-xl animate-pulse border border-white/5"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {normais.map((item) => {
                const isOutOfStock = item.stock <= 0;
                return (
                <Link href={`/produto/${item.id}`} key={item.id} className="relative group backdrop-blur-sm bg-black/40 border border-white/10 hover:border-yellow-500/50 rounded-xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer block shadow-sm">
                  
                  <div className="h-40 w-full bg-white/5 rounded-lg mb-3 relative overflow-hidden flex items-center justify-center border border-white/5 shadow-inner">
                    {item.images?.[0] ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.title} 
                        className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-40' : ''}`}
                      />
                    ) : (
                      <span className="text-gray-600 text-xs uppercase font-bold tracking-widest">Sem Foto</span>
                    )}
                    
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest border border-white/20">Esgotado</span>
                      </div>
                    )}

                    {!isOutOfStock && item.sale_price && (
                        <div className="absolute top-2 right-2 bg-yellow-500 w-2 h-2 rounded-full shadow-sm animate-pulse"></div>
                    )}
                  </div>
                  
                  <div className="px-1 text-center md:text-left">
                    <h4 className="text-sm text-gray-200 truncate font-medium group-hover:text-yellow-400 transition-colors">{item.title}</h4>
                    
                    <div className="mt-1 h-10 flex flex-col justify-center">
                      {item.sale_price ? (
                          <>
                          <span className="text-[10px] text-gray-500 line-through block leading-none">{formatMoney(item.price)}</span>
                          <span className="text-yellow-400 font-extrabold text-lg">{formatMoney(item.sale_price)}</span>
                          </>
                      ) : (
                          <p className="text-yellow-400 font-extrabold text-lg">
                              {formatMoney(item.price)}
                          </p>
                      )}
                    </div>
                    
                    {!isOutOfStock && (
                      <p className="text-[10px] text-green-400 mt-0.5 font-medium bg-green-900/30 inline-block px-2 rounded-full border border-green-800/50">Disponível</p>
                    )}
                    
                    <div className={`w-full mt-3 text-[10px] border border-white/20 py-2 rounded-md transition-all uppercase font-bold hover:shadow-md text-center ${
                        isOutOfStock ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-500'
                    }`}>
                      {isOutOfStock ? 'Esgotado' : 'Comprar'}
                    </div>
                  </div>
                </Link>
              )})}
            </div>
          )}
        </section>

        {/* === SEÇÃO DEPOIMENTOS === */}
        <section className="w-full bg-neutral-900 border-t border-white/10 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                   <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">O Que Dizem Nossos Clientes</h2>
                   <div className="h-1 w-20 bg-yellow-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className="bg-black/40 border border-white/5 p-6 rounded-xl hover:border-yellow-500/30 transition-all shadow-lg">
                            <div className="flex gap-1 text-yellow-500 mb-4 text-sm">★★★★★</div>
                            <p className="text-gray-300 text-sm italic mb-4 leading-relaxed">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 flex items-center justify-center text-black font-bold text-xs">
                                    {t.name.charAt(0)}
                                </div>
                                <span className="text-white text-xs font-bold uppercase tracking-wider">{t.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </div>
  );
}