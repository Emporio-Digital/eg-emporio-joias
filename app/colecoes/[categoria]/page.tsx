'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

// Mapeamento para títulos bonitos
const titulos: Record<string, string> = {
    aneis: "Anéis Exclusivos",
    colares: "Colares & Gargantilhas",
    brincos: "Brincos de Luxo",
    pulseiras: "Pulseiras e Braceletes"
};

export default function DetalheColecao({ params }: { params: Promise<{ categoria: string }> }) {
  const resolvedParams = use(params); // Next 15 unwrap
  const categoriaSlug = resolvedParams.categoria;
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      // Busca no banco onde category = categoriaSlug
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', categoriaSlug)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [categoriaSlug]);

  // Título da página (ou o slug capitalizado se não tiver no mapa)
  const pageTitle = titulos[categoriaSlug] || categoriaSlug.charAt(0).toUpperCase() + categoriaSlug.slice(1);

  return (
    <div className="min-h-screen pt-10 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
            
            {/* Cabeçalho da Coleção */}
            <div className="flex flex-col items-center mb-12">
                <span className="text-xs font-bold text-gold-600 uppercase tracking-widest mb-2">Coleção</span>
                <h1 className="text-3xl md:text-4xl font-serif text-gray-900">{pageTitle}</h1>
                <div className="h-[1px] w-20 bg-gray-300 mt-4"></div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Carregando joias...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-gray-500 font-serif text-lg">Nenhuma joia encontrada nesta coleção ainda.</p>
                    <Link href="/" className="text-gold-600 text-sm font-bold mt-2 inline-block hover:underline">Voltar para Início</Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((item) => (
                        <Link href={`/produto/${item.id}`} key={item.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gold-300 hover:shadow-xl transition-all duration-300">
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                <Image 
                                    src={item.images?.[0] || '/bg-joias.png'} 
                                    alt={item.title} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {item.sale_price && (
                                    <div className="absolute top-2 right-2 bg-gold-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                        OFERTA
                                    </div>
                                )}
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="text-sm text-gray-800 font-medium truncate mb-1">{item.title}</h3>
                                <div className="text-gold-700 font-bold">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.sale_price || item.price)}
                                </div>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-2 block group-hover:text-black transition-colors">
                                    Ver Detalhes
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

        </div>
    </div>
  );
}