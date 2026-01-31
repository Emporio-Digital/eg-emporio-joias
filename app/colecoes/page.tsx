import Link from "next/link";
import Image from "next/image";

// Dados estáticos das Coleções (Categorias)
// Nota: Usamos a mesma imagem de placeholder por enquanto, mas o ideal é ter capas bonitas
const colecoes = [
    {
        id: 'aneis',
        titulo: 'Anéis Exclusivos',
        descricao: 'Símbolos de elegância para suas mãos.',
        imagem: '/bg-joias.png', // Usando o BG por enquanto, depois trocamos por fotos de capa reais
    },
    {
        id: 'colares',
        titulo: 'Colares & Gargantilhas',
        descricao: 'Destaque sua beleza com brilho e sofisticação.',
        imagem: '/bg-joias.png',
    },
    {
        id: 'brincos',
        titulo: 'Brincos de Luxo',
        descricao: 'O detalhe perfeito para iluminar seu rosto.',
        imagem: '/bg-joias.png',
    },
    {
        id: 'pulseiras',
        titulo: 'Pulseiras',
        descricao: 'Charme e delicadeza em cada movimento.',
        imagem: '/bg-joias.png',
    }
];

export default function Colecoes() {
  return (
    <div className="min-h-screen pt-10 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-16">
                <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 tracking-wide">Nossas Coleções</h1>
                <p className="text-gray-500 max-w-2xl mx-auto font-light">
                    Explore nossa curadoria de peças banhadas a Ouro 18k e Prata. Cada categoria foi pensada para trazer o máximo de elegância para você.
                </p>
                <div className="h-[1px] w-24 bg-gold-400 mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {colecoes.map((c) => (
                    <Link 
                        key={c.id} 
                        href={`/colecoes/${c.id}`} // Link para a página de filtro
                        className="group relative h-80 w-full overflow-hidden rounded-3xl shadow-xl border border-white cursor-pointer"
                    >
                        {/* Imagem de Fundo com Zoom no Hover */}
                        <div className="absolute inset-0 bg-gray-200 group-hover:scale-110 transition-transform duration-1000">
                            <Image 
                                src={c.imagem} 
                                alt={c.titulo} 
                                fill 
                                className="object-cover opacity-80"
                            />
                        </div>
                        
                        {/* Overlay Escuro para leitura */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>

                        {/* Texto Centralizado */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
                            <h2 className="text-3xl font-serif font-bold mb-2 tracking-wider translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                {c.titulo}
                            </h2>
                            <p className="text-sm font-light opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                {c.descricao}
                            </p>
                            <span className="mt-6 border border-white/50 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-500 delay-200">
                                Ver Produtos
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    </div>
  );
}