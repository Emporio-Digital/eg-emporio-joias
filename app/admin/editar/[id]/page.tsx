'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

const SIZE_OPTIONS: Record<string, string[]> = {
  aneis: ['10', '12', '14', '16', '18', '20', '22', '24', '26', '28'],
  colares: ['40cm', '45cm', '50cm', '60cm', '70cm'],
  pulseiras: ['PP (16cm)', 'P (17cm)', 'M (19cm)', 'G (21cm)'],
  brincos: ['Único'],
};

export default function EditarProduto({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('aneis');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('1');
  const [displayOrder, setDisplayOrder] = useState('0'); // Nova ordem

  // Imagem Principal
  const [currentImage, setCurrentImage] = useState(''); 
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // Galeria
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  const [isHighlight, setIsHighlight] = useState(false);
  const [discountPercent, setDiscountPercent] = useState('');

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        alert('Erro ao carregar produto.');
        router.push('/admin');
        return;
      }

      if (data) {
        setTitle(data.title);
        setPrice(data.price.toString());
        setCategory(data.category);
        setDescription(data.description || '');
        setStock(data.stock.toString());
        setDisplayOrder(data.display_order ? data.display_order.toString() : '0');
        
        setCurrentImage(data.images?.[0] || '');
        setCurrentGallery(data.gallery || []);

        setIsHighlight(data.highlight || false);
        setSelectedSizes(data.sizes || []);
        
        if (data.sale_price) {
            const percent = Math.round(((data.price - data.sale_price) / data.price) * 100);
            setDiscountPercent(percent.toString());
        }
        
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId, router]);

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const removeGalleryImage = (urlToRemove: string) => {
      if (confirm('Remover esta foto da galeria?')) {
          setCurrentGallery(prev => prev.filter(u => u !== urlToRemove));
      }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          setNewGalleryFiles(Array.from(e.target.files));
      }
  };

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      if (selectedSizes.length === 0) throw new Error('Selecione ao menos um tamanho.');

      const numericPrice = parseFloat(price);
      const numericDiscount = parseFloat(discountPercent);
      const numericOrder = parseInt(displayOrder) || 0;
      
      let salePrice = null;
      if (!isNaN(numericDiscount) && numericDiscount > 0) {
        salePrice = numericPrice - (numericPrice * (numericDiscount / 100));
      }

      let imageUrl = currentImage;
      if (newImageFile) {
          const fileExt = newImageFile.name.split('.').pop();
          const fileName = `main_${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, newImageFile);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);
          
          imageUrl = publicUrl;
      }

      let updatedGallery = [...currentGallery];
      if (newGalleryFiles.length > 0) {
          for (let i = 0; i < newGalleryFiles.length; i++) {
              const file = newGalleryFiles[i];
              const ext = file.name.split('.').pop();
              const name = `gallery_${Date.now()}_${i}.${ext}`;
              
              const { error: gErr } = await supabase.storage
                .from('products')
                .upload(name, file);

              if (!gErr) {
                 const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(name);
                 updatedGallery.push(publicUrl);
              }
          }
      }

      const { error: updateError } = await supabase
        .from('products')
        .update({
            title,
            price: numericPrice,
            sale_price: salePrice,
            highlight: isHighlight,
            description,
            category,
            stock: parseInt(stock),
            images: [imageUrl], 
            gallery: updatedGallery,
            sizes: selectedSizes,
            display_order: numericOrder
        })
        .eq('id', productId);

      if (updateError) throw updateError;

      alert('Produto atualizado com sucesso!');
      router.push('/admin');

    } catch (error: any) {
      console.error(error);
      alert('Erro ao atualizar: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full p-3 rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 placeholder-gray-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";
  const currentSizeOptions = SIZE_OPTIONS[category] || [];

  if (loading) return <div className="p-10 text-center text-white">Carregando dados...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-3xl mx-auto">
      <Link href="/admin" className="flex items-center text-gray-400 hover:text-white mb-6 gap-2 w-fit">
        <ArrowLeftIcon className="w-4 h-4" /> Cancelar e Voltar
      </Link>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-serif mb-6 text-white">Editar Produto #{productId}</h1>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className={labelClass}>Nome</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Preço (R$)</label>
              <input 
                required
                type="number" 
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className={inputClass}
              />
            </div>
            
            <div>
              <label className={labelClass}>Desconto (%)</label>
              <input 
                type="number" 
                step="1"
                min="0"
                max="100"
                value={discountPercent}
                onChange={e => setDiscountPercent(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-end">
             <div>
                <label className={labelClass}>Estoque Total</label>
                <input 
                    required
                    type="number" 
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    className={inputClass}
                />
             </div>
             
             <div>
                <label className={labelClass}>Ordem Exibição</label>
                <input 
                    type="number" 
                    value={displayOrder}
                    onChange={e => setDisplayOrder(e.target.value)}
                    className={inputClass}
                />
             </div>

             <div className="flex items-center h-[50px] pb-1">
                <label className="flex items-center cursor-pointer gap-3 select-none">
                    <input 
                        type="checkbox" 
                        checked={isHighlight}
                        onChange={e => setIsHighlight(e.target.checked)}
                        className="accent-yellow-500 w-5 h-5"
                    />
                    <span className="text-sm font-medium text-gray-300 ml-3">Destaque</span>
                </label>
             </div>
          </div>

          <div>
            <label className={labelClass}>Categoria</label>
            <select 
              value={category}
              onChange={e => {
                  setCategory(e.target.value);
                  setSelectedSizes([]); 
              }}
              className={inputClass}
            >
              <option value="aneis">Anéis</option>
              <option value="colares">Colares</option>
              <option value="brincos">Brincos</option>
              <option value="pulseiras">Pulseiras</option>
            </select>
          </div>

          <div>
             <label className={labelClass}>Tamanhos Disponíveis</label>
             <div className="flex flex-wrap gap-2 mt-2">
                {currentSizeOptions.map(size => (
                    <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                            selectedSizes.includes(size)
                             ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg scale-105'
                             : 'bg-neutral-800 text-gray-400 border-neutral-700 hover:border-gray-500'
                        }`}
                    >
                        {size}
                    </button>
                ))}
             </div>
          </div>

          <div>
            <label className={labelClass}>Descrição</label>
            <textarea 
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* IMAGENS (MANTIDO) */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <h3 className="text-white font-bold text-lg">Gerenciar Imagens</h3>

            <div>
                <label className={labelClass}>Foto Principal</label>
                <div className="flex items-start gap-4">
                    {currentImage && !newImageFile && (
                        <div className="relative w-24 h-24 border border-neutral-700 rounded-lg overflow-hidden bg-black">
                            <Image src={currentImage} alt="Atual" fill className="object-cover" />
                        </div>
                    )}
                    
                    <div className="flex-1">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => setNewImageFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-yellow-500 hover:file:bg-neutral-700"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">Selecione para trocar a capa atual.</p>
                    </div>
                </div>
            </div>

            <div>
                <label className={labelClass}>Galeria de Fotos Extras</label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {currentGallery.map((url, idx) => (
                        <div key={idx} className="relative w-20 h-20 border border-neutral-700 rounded-lg overflow-hidden group">
                             <Image src={url} alt={`Galeria ${idx}`} fill className="object-cover" />
                             <button
                                type="button"
                                onClick={() => removeGalleryImage(url)}
                                className="absolute top-0 right-0 bg-red-600 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                             </button>
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                    <p className="text-xs text-gray-400 mb-2">Adicionar mais à galeria:</p>
                    <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 file:text-yellow-500 hover:file:bg-neutral-700"
                    />
                </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-white text-black py-4 rounded-lg font-bold hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {saving ? 'Salvando Alterações...' : 'Atualizar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
}