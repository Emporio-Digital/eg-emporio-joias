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
  images: string[];
  category: string;
  description: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
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

  return (
    <div className="w-full flex flex-col items-center">
      
        {/* === SEÇÃO DESTAQUES === */}
        {destaques.length > 0 && (
          <section className="w-full max-w-7xl mt-10 px-4 mb-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-[1px] bg-gradient-to-r from-transparent to-yellow-500 flex-1"></div>
              <h2 className="text-3xl md:text-4xl font-light text-white uppercase tracking-[0.2em] text-center drop-shadow-sm">
                Coleção <span className="text-yellow-500 font-bold serif italic">Exclusiva</span>
              </h2>
              <div className="h-[1px] bg-gradient-to-l from-transparent to-yellow-500 flex-1"></div>
            </div>

            {loading ? (
               <p className="text-center text-gray-500">Carregando coleção...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {destaques.map((item) => {
                  const discountPercent = item.sale_price ? calculateDiscount(item.price, item.sale_price) : 0;

                  return (
                    <Link href={`/produto/${item.id}`} key={item.id} className="group relative backdrop-blur-md bg-black/40 border border-white/10 hover:border-yellow-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-2 cursor-pointer block shadow-sm">
                      <div className="relative h-80 w-full overflow-hidden bg-white/5">
                         <img 
                            src={item.images?.[0] || 'https://via.placeholder.com/400x500?text=Sem+Foto'} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                         />
                         
                         {/* ETIQUETA MARKETING MELHORADA */}
                         {discountPercent > 0 ? (
                            <div className="absolute top-0 right-0 bg-gradient-to-bl from-yellow-300 via-yellow-500 to-yellow-600 text-black text-xs font-black px-4 py-2 rounded-bl-xl shadow-[0_4px_12px_rgba(234,179,8,0.4)] tracking-widest z-10 transform transition-transform hover:scale-105">
                                {discountPercent}% OFF
                            </div>
                         ) : (
                            <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm tracking-wider z-10">
                                NOVO
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
                                <p className="text-yellow-400 font-extrabold text-2xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                                  {formatMoney(item.sale_price)}
                                </p>
                              </>
                           ) : (
                              <p className="text-yellow-400 font-extrabold text-2xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                                {formatMoney(item.price)}
                              </p>
                           )}
                        </div>
                        
                        <p className="text-xs text-gray-400 mt-1 mb-4">10x sem juros</p>
                        
                        <div className="w-full py-3 bg-white text-black group-hover:bg-yellow-500 group-hover:text-black rounded-lg transition-all text-xs font-bold uppercase tracking-widest shadow-md flex items-center justify-center">
                          Ver Detalhes
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* === SEÇÃO PRODUTOS NORMAIS === */}
        <section className="w-full max-w-7xl px-4 pb-20 mt-8">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
             <div className="flex items-center">
                <div className="w-1.5 h-8 bg-yellow-500 mr-4 rounded-full"></div>
                <h3 className="text-2xl text-white uppercase tracking-wider font-light">Todas as Joias</h3>
             </div>
             <span className="text-sm text-gray-400 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10">
               {normais.length} produtos
             </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {normais.map((item) => (
              <Link href={`/produto/${item.id}`} key={item.id} className="relative group backdrop-blur-sm bg-black/40 border border-white/10 hover:border-yellow-500/50 rounded-xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer block shadow-sm">
                
                <div className="h-40 w-full bg-white/5 rounded-lg mb-3 relative overflow-hidden flex items-center justify-center border border-white/5 shadow-inner">
                  {item.images?.[0] ? (
                    <img 
                      src={item.images[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-xs uppercase font-bold tracking-widest">Sem Foto</span>
                  )}
                  {item.sale_price && (
                      <div className="absolute top-2 right-2 bg-yellow-500 w-2 h-2 rounded-full shadow-sm animate-pulse"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-yellow-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                  
                  <p className="text-[10px] text-green-400 mt-0.5 font-medium bg-green-900/30 inline-block px-2 rounded-full border border-green-800/50">Disponível</p>
                  
                  <div className="w-full mt-3 text-[10px] border border-white/20 py-2 rounded-md text-gray-300 group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-500 transition-all uppercase font-bold hover:shadow-md text-center">
                    Comprar
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
    </div>
  );
}