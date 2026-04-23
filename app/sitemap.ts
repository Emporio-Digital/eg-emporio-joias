import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://joias.egemporiodigital.com.br'

  // 1. Busca os dados reais do banco (Apenas colunas confirmadas no seu dossiê)
  const { data: products } = await supabase
    .from('products')
    .select('id, category')

  // Se por algum motivo o banco falhar, retornamos ao menos a Home e Sobre
  if (!products || products.length === 0) {
    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/sobre`, lastModified: new Date() },
    ]
  }

  // 2. Gerar links de Produtos (/produto/[id])
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/produto/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // 3. Gerar links de Coleções (/colecoes/[categoria])
  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
  const categoryEntries: MetadataRoute.Sitemap = uniqueCategories.map((category) => ({
    url: `${baseUrl}/colecoes/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  // 4. Rotas Estáticas Principais
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Junta tudo na ordem de importância
  return [...staticEntries, ...categoryEntries, ...productEntries]
}