import Image from "next/image";

export default function Footer() {
  return (
    // FOOTER: Fundo preto sólido com leve transparência e borda dourada sutil no topo
    <footer className="relative z-10 w-full border-t border-yellow-500/20 bg-neutral-950 pt-10 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          
          {/* Logo Footer (Branco/Dourado) */}
          <div className="flex flex-col items-center gap-2 mb-8 opacity-100">
             <div className="w-12 h-12 relative grayscale-0 transition-all">
                <Image src="/bg-joias.png" alt="Logo" fill className="object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]"/>
             </div>
             <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white tracking-[0.2em] text-sm font-serif">
                EG EMPÓRIO JOIAS
             </span>
          </div>

          {/* Instagram e Copyright */}
          <div className="flex flex-col items-center gap-6">
            
            {/* CTA Instagram - Mais chamativo */}
            <a 
                href="https://www.instagram.com/eg.emporio.joias" 
                target="_blank"
                className="group relative flex items-center gap-3 bg-gradient-to-r from-neutral-900 to-neutral-800 px-8 py-3 rounded-full border border-yellow-500/30 hover:border-yellow-400 transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:-translate-y-1"
            >
                <div className="bg-yellow-500 rounded-full p-1 text-black group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.232-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                    </svg>
                </div>
                <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest group-hover:text-white transition-colors">
                    Siga-nos no Instagram
                </span>
            </a>

            <div className="h-[1px] w-20 bg-white/10"></div>

            <p className="text-[10px] text-gray-500 font-medium">
                © 2026 EG Empório Joias. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
  );
}