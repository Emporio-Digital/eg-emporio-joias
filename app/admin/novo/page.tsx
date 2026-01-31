'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

function PhotoIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('aneis');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('1');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isHighlight, setIsHighlight] = useState(false); 
  const [discountPercent, setDiscountPercent] = useState(''); 
  const [finalPricePreview, setFinalPricePreview] = useState<number | null>(null);

  useEffect(() => {
    const p = parseFloat(price);
    const d = parseFloat(discountPercent);
    if (!isNaN(p) && !isNaN(d) && d > 0) {
      setFinalPricePreview(p - (p * (d / 100)));
    } else {
      setFinalPricePreview(null);
    }
  }, [price, discountPercent]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!imageFile) throw new Error('Por favor, selecione uma imagem.');

      const numericPrice = parseFloat(price);
      const numericDiscount = parseFloat(discountPercent);
      
      let salePrice = null;
      if (!isNaN(numericDiscount) && numericDiscount > 0) {
        salePrice = numericPrice - (numericPrice * (numericDiscount / 100));
      }

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('products')
        .insert([
          {
            title,
            price: numericPrice,
            sale_price: salePrice,
            highlight: isHighlight,
            description,
            category,
            stock: parseInt(stock),
            images: [publicUrl],
            sizes: category === 'aneis' ? ['12', '14', '16', '18', '20', '22'] : [], 
          },
        ]);

      if (dbError) throw dbError;

      alert('Produto cadastrado com sucesso!');
      router.push('/admin');

    } catch (error: any) {
      console.error(error);
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  // ESTILOS DE INPUT PADRONIZADOS PARA DARK MODE
  const inputClass = "w-full p-3 rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 placeholder-gray-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-3xl mx-auto">
      <Link href="/admin" className="flex items-center text-gray-400 hover:text-white mb-6 gap-2 w-fit">
        <ArrowLeftIcon className="w-4 h-4" /> Voltar para Dashboard
      </Link>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-serif mb-6 text-white">Novo Produto</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Nome do Produto</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Ex: Anel Solitário Ouro 18k"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Preço Original (R$)</label>
              <input 
                required
                type="number" 
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className={inputClass}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className={labelClass}>Desconto (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="1"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={e => setDiscountPercent(e.target.value)}
                  className={inputClass}
                  placeholder="0"
                />
                <div className="absolute right-3 top-3 text-gray-500 pointer-events-none">%</div>
              </div>
            </div>
          </div>

          {finalPricePreview !== null && (
            <div className="bg-green-900/30 border border-green-800 p-3 rounded-lg flex items-center gap-2 text-sm">
                <span className="text-green-400 font-bold">Preço Final no Site:</span>
                <span className="text-green-300">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalPricePreview)}
                </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className={labelClass}>Estoque</label>
              <input 
                required
                type="number" 
                value={stock}
                onChange={e => setStock(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex items-center h-[50px] pb-1">
                <label className="flex items-center cursor-pointer gap-3 select-none">
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={isHighlight}
                            onChange={e => setIsHighlight(e.target.checked)}
                        />
                        <div className={`block w-14 h-8 rounded-full transition-colors ${isHighlight ? 'bg-yellow-500' : 'bg-neutral-700'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isHighlight ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                        Produto em Destaque?
                    </span>
                </label>
            </div>
          </div>

          <div>
            <label className={labelClass}>Categoria</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="aneis">Anéis</option>
              <option value="colares">Colares</option>
              <option value="brincos">Brincos</option>
              <option value="pulseiras">Pulseiras</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Descrição</label>
            <textarea 
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={inputClass}
              placeholder="Detalhes da joia..."
            />
          </div>

          <div>
            <label className={labelClass}>Foto Principal</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-neutral-700 border-dashed rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition relative overflow-hidden">
                
                {imageFile ? (
                   <div className="absolute inset-0 flex items-center justify-center bg-green-900/50">
                      <p className="text-green-300 font-medium truncate px-4">{imageFile.name}</p>
                   </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PhotoIcon className="w-8 h-8 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-500">
                      Clique para enviar imagem
                    </p>
                  </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-lg font-bold hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Cadastrar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
}