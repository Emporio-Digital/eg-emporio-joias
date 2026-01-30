import Image from "next/image";
import Link from "next/link";

export default function Sobre() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-10 pb-20 px-4">
      
      {/* Container Principal com efeito Vidro */}
      <section className="w-full max-w-5xl bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-12 animate-fade-in relative">
        
        {/* Título da Página */}
        <div className="text-center mb-12 relative z-10">
            <h2 className="text-sm md:text-base text-gold-600 font-bold tracking-[0.3em] uppercase mb-2">Quem Somos</h2>
            <h1 className="text-3xl md:text-5xl font-serif text-gray-800">
              A Essência da <span className="italic text-gold-600 font-bold">Exclusividade</span>
            </h1>
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-6"></div>
        </div>

        {/* Conteúdo: Imagem + Texto */}
        <div className="flex flex-col md:flex-row gap-10 items-center">
            
            {/* Coluna Imagem */}
            <div className="w-full md:w-1/2 relative group">
                <div className="relative h-80 md:h-96 w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                    <Image 
                        src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800" 
                        alt="Joalheiro trabalhando" 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay dourado sutil */}
                    <div className="absolute inset-0 bg-gold-500/10 mix-blend-overlay"></div>
                </div>
                {/* Quadrado decorativo flutuante */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/80 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center border border-white z-10">
                    <span className="text-gold-600 font-bold text-xl font-serif">2025</span>
                </div>
            </div>

            {/* Coluna Texto */}
            <div className="w-full md:w-1/2 flex flex-col gap-6 text-gray-700 leading-relaxed font-light text-justify md:text-left">
                <p>
                    A <strong className="text-gray-900 font-serif">EG Empório Joias</strong> nasceu do desejo de eternizar momentos. Acreditamos que uma joia não é apenas um acessório, mas um símbolo de afeto, conquista e elegância que atravessa gerações.
                </p>
                <p>
                    Nossas peças são selecionadas com rigorosa curadoria, garantindo o mais alto padrão em banho de <strong className="text-gold-600">Ouro 18k</strong>, Prata 925 e Ródio Branco. Cada detalhe é pensado para refletir o brilho de quem usa.
                </p>
                <p>
                    Mais do que vender joias, entregamos autoestima e sofisticação em uma caixinha. Seja bem-vindo ao nosso universo de luxo acessível.
                </p>

                {/* Assinatura */}
                <div className="mt-4">
                    <p className="font-serif text-xl text-gray-900 italic">Equipe EG Joias</p>
                </div>
            </div>
        </div>

        {/* Seção de Diferenciais (Ícones) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 border-t border-gray-200 pt-10">
            <div className="bg-white/50 p-6 rounded-xl border border-white text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-3xl mb-3">💎</div>
                <h3 className="font-bold text-gray-800 mb-2 uppercase text-xs tracking-wider">Qualidade Premium</h3>
                <p className="text-xs text-gray-600">Banho de alta durabilidade com verniz antialérgico.</p>
            </div>
            <div className="bg-white/50 p-6 rounded-xl border border-white text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-bold text-gray-800 mb-2 uppercase text-xs tracking-wider">Garantia Real</h3>
                <p className="text-xs text-gray-600">Todas as peças acompanham certificado de garantia.</p>
            </div>
            <div className="bg-white/50 p-6 rounded-xl border border-white text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-3xl mb-3">🚚</div>
                <h3 className="font-bold text-gray-800 mb-2 uppercase text-xs tracking-wider">Envio Seguro</h3>
                <p className="text-xs text-gray-600">Embalagem protegida e rastreamento passo a passo.</p>
            </div>
        </div>

        {/* Botão Voltar */}
        <div className="mt-12 text-center">
            <Link href="/" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg uppercase tracking-widest text-xs font-bold hover:bg-gold-600 transition-colors shadow-xl">
                Ver Coleção
            </Link>
        </div>

      </section>
    </div>
  );
}