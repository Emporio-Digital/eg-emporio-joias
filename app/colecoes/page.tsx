import Image from "next/image";
import Link from "next/link";

// Configuração das categorias e suas respectivas fotos
const categories = [
  {
    id: 1,
    title: "Anéis",
    slug: "aneis",
    image: "/colecoes/aneis.jpg", // Caminho que criamos na pasta public
    desc: "Elegância em cada detalhe"
  },
  {
    id: 2,
    title: "Colares",
    slug: "colares",
    image: "/colecoes/colares.jpg",
    desc: "Para destacar seu brilho"
  },
  {
    id: 3,
    title: "Brincos",
    slug: "brincos",
    image: "/colecoes/brincos.jpg",
    desc: "Sofisticação para o rosto"
  },
  {
    id: 4,
    title: "Pulseiras",
    slug: "pulseiras",
    image: "/colecoes/pulseiras.jpg",
    desc: "O toque final perfeito"
  },
];

export default function Colecoes() {
  return (
    <div className="min-h-screen pt-10 pb-20 px-4 bg-neutral-950">
      
      {/* Cabeçalho */}
      <div className="max-w-7xl mx-auto text-center mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-wide">
          Nossas <span className="text-yellow-500 italic">Coleções</span>
        </h1>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"></div>
        <p className="text-gray-400 mt-4 text-sm uppercase tracking-widest">
          Explore a exclusividade por categoria
        </p>
      </div>

      {/* Grid de Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            href={`/colecoes/${cat.slug}`}
            className="group relative h-[400px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
          >
            {/* Imagem de Fundo com Zoom no Hover */}
            <div className="absolute inset-0 w-full h-full">
               <Image 
                 src={cat.image} 
                 alt={cat.title} 
                 fill 
                 className="object-cover transition-transform duration-700 group-hover:scale-110"
               />
            </div>

            {/* Overlay Escuro (Vidro) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>

            {/* Conteúdo do Card */}
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h2 className="text-3xl font-serif text-white font-bold mb-2 drop-shadow-lg">
                    {cat.title}
                </h2>
                <div className="h-[2px] w-0 bg-yellow-500 group-hover:w-16 transition-all duration-500 mb-3"></div>
                
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-6">
                    {cat.desc}
                </p>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400 border border-yellow-500/50 px-6 py-2 rounded-full hover:bg-yellow-500 hover:text-black transition-colors">
                    Ver Peças
                </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}