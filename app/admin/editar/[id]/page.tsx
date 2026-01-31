'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Ícones
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

export default function EditarProduto({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); // Next.js 15 unwrap
  const productId = resolvedParams.id;
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados do Formulário
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('aneis');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('1');
  const [currentImage, setCurrentImage] = useState(''); // URL da imagem atual
  const [newImageFile, setNewImageFile] = useState<File | null>(null); // Nova imagem (opcional)

  const [isHighlight, setIsHighlight] = useState(false);
  const [discountPercent, setDiscountPercent] = useState('');
  
  // 1. Carregar dados do produto ao abrir a página
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
        setCurrentImage(data.images?.[0] || '');
        setIsHighlight(data.highlight || false);
        
        // Calcular a porcentagem inversa se tiver sale_price
        if (data.sale_price) {
            const percent = Math.round(((data.price - data.sale_price) / data.price) * 100);
            setDiscountPercent(percent.toString());
        }
        
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId, router]);

  // 2. Função de Salvar Edição
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const numericPrice = parseFloat(price);
      const numericDiscount = parseFloat(discountPercent);
      
      // Recalcula Sale Price
      let salePrice = null;
      if (!isNaN(numericDiscount) && numericDiscount > 0) {
        salePrice = numericPrice - (numericPrice * (numericDiscount / 100));
      }

      let imageUrl = currentImage;

      // Se o usuário selecionou uma NOVA imagem, faz o upload
      if (newImageFile) {
          const fileExt = newImageFile.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, newImageFile);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);
          
          imageUrl = publicUrl;
      }

      // Atualiza no Banco
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
            images: [imageUrl], // Atualiza array de imagens
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

  if (loading) return <div className="p-10 text-center">Carregando dados...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-3xl mx-auto">
      <Link href="/admin" className="flex items-center text-gray-500 hover:text-black mb-6 gap-2 w-fit">
        <ArrowLeftIcon className="w-4 h-4" /> Cancelar e Voltar
      </Link>

      <div className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-serif mb-6 text-gray-800">Editar Produto #{productId}</h1>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Preço Original */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input 
                required
                type="number" 
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>
            
            {/* Desconto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (%)</label>
              <input 
                type="number" 
                step="1"
                min="0"
                max="100"
                value={discountPercent}
                onChange={e => setDiscountPercent(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
             {/* Estoque */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                <input 
                    required
                    type="number" 
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
             </div>

             {/* Destaque */}
             <div className="flex items-center h-[50px] pb-1">
                <label className="flex items-center cursor-pointer gap-3 select-none">
                    <input 
                        type="checkbox" 
                        checked={isHighlight}
                        onChange={e => setIsHighlight(e.target.checked)}
                        className="accent-yellow-500 w-5 h-5"
                    />
                    <span className="text-sm font-medium text-gray-700">Destaque na Home</span>
                </label>
             </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="aneis">Anéis</option>
              <option value="colares">Colares</option>
              <option value="brincos">Brincos</option>
              <option value="pulseiras">Pulseiras</option>
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea 
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            />
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
            
            <div className="flex items-start gap-4">
                {/* Preview da Atual */}
                {currentImage && !newImageFile && (
                    <div className="relative w-24 h-24 border rounded-lg overflow-hidden">
                        <Image src={currentImage} alt="Atual" fill className="object-cover" />
                    </div>
                )}
                
                {/* Input para Nova Imagem */}
                <div className="flex-1">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setNewImageFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Deixe vazio para manter a imagem atual.</p>
                </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {saving ? 'Salvando Alterações...' : 'Atualizar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
}