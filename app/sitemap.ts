import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase' // Caminho conforme seu print

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://joias.egemporiodigital.com.br'

  // 1. Buscar todos os produtos ativos do Supabase
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')

  // 2. Buscar categorias únicas (para gerar links de coleções)
  const { data: categoriesData } = await supabase
    .from('products')
    .select('category')
  
  const uniqueCategories = Array.from(new Set(categoriesData?.map(p => p.category)))

  // Mapear links de produtos
  const productEntries: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${baseUrl}/produto/${product.id}`,
    lastModified: product.updated_at || new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Mapear links de coleções
  const categoryEntries: MetadataRoute.Sitemap = uniqueCategories.map((category) => ({
    url: `${baseUrl}/colecoes/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  // Rotas Estáticas Principais
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Home é a mais importante
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  return [...staticEntries, ...categoryEntries, ...productEntries]
}