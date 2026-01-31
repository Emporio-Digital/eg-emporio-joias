import Image from "next/image";
import Link from "next/link";

export default function Cadastro() {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      
      {/* Container de Vidro Escuro */}
      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8 md:p-10 animate-fade-in relative overflow-hidden">
        
        {/* Detalhe Dourado */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>

        <div className="flex flex-col items-center text-center mb-6">
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">Crie sua Conta</h1>
            <p className="text-xs text-gray-400 mt-2 uppercase tracking-wider">Junte-se ao clube de exclusividade</p>
        </div>

        {/* Formulário */}
        <form className="flex flex-col gap-4">
            
            {/* Nome */}
            <div className="relative group">
                <input 
                    required
                    type="text" 
                    placeholder="Nome Completo *" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:bg-black/60 transition-all placeholder:text-gray-600 text-gray-200"
                />
            </div>

            {/* Email */}
            <div className="relative group">
                <input 
                    required
                    type="email" 
                    placeholder="Seu melhor e-mail *" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:bg-black/60 transition-all placeholder:text-gray-600 text-gray-200"
                />
            </div>

            {/* WhatsApp */}
            <div className="relative group">
                <input 
                    required
                    type="tel" 
                    placeholder="WhatsApp / Celular *" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:bg-black/60 transition-all placeholder:text-gray-600 text-gray-200"
                />
            </div>

            {/* CPF */}
            <div className="relative group">
                <input 
                    required
                    type="text" 
                    placeholder="CPF (somente números) *" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:bg-black/60 transition-all placeholder:text-gray-600 text-gray-200"
                />
            </div>

            {/* Senha */}
            <div className="relative group">
                <input 
                    required
                    type="password" 
                    placeholder="Crie uma senha *" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-500 focus:bg-black/60 transition-all placeholder:text-gray-600 text-gray-200"
                />
            </div>

            {/* Termos */}
            <div className="flex items-center gap-2 mt-2">
                <input required type="checkbox" id="termos" className="accent-yellow-500 w-4 h-4 cursor-pointer" />
                <label htmlFor="termos" className="text-[10px] text-gray-400 cursor-pointer">
                    Li e aceito os <a href="#" className="underline hover:text-yellow-500">Termos de Uso</a> e <a href="#" className="underline hover:text-yellow-500">Privacidade</a>.
                </label>
            </div>

            {/* Botão Cadastrar */}
            <button type="submit" className="w-full mt-4 bg-white text-black py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-yellow-500 hover:text-white hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all transform hover:-translate-y-0.5">
                Criar Minha Conta
            </button>
        </form>

        {/* Voltar para Login */}
        <div className="mt-8 text-center pt-6 border-t border-white/10">
            <p className="text-xs text-gray-500">
                Já é cliente? <Link href="/login" className="text-yellow-500 font-bold hover:underline">Fazer Login</Link>
            </p>
        </div>

      </div>
    </div>
  );
}