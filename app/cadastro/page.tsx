import Image from "next/image";
import Link from "next/link";

export default function Cadastro() {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      
      {/* Container de Vidro */}
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in relative overflow-hidden">
        
        {/* Detalhe Dourado */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>

        <div className="flex flex-col items-center text-center mb-6">
            <h1 className="text-2xl font-serif font-bold text-gray-800 tracking-wide">Crie sua Conta</h1>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">Junte-se ao clube de exclusividade</p>
        </div>

        {/* Formulário */}
        <form className="flex flex-col gap-4">
            
            {/* Nome */}
            <div className="relative group">
                <input 
                    required
                    type="text" 
                    placeholder="Nome Completo *" 
                    className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800"
                />
            </div>

            {/* Email */}
            <div className="relative group">
                <input 
                    required
                    type="email" 
                    placeholder="Seu melhor e-mail *" 
                    className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800"
                />
            </div>

            {/* WhatsApp (Novo Campo) */}
            <div className="relative group">
                <input 
                    required
                    type="tel" 
                    placeholder="WhatsApp / Celular *" 
                    className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800"
                />
            </div>

            {/* CPF */}
            <div className="relative group">
                <input 
                    required
                    type="text" 
                    placeholder="CPF (somente números) *" 
                    className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800"
                />
            </div>

            {/* Senha */}
            <div className="relative group">
                <input 
                    required
                    type="password" 
                    placeholder="Crie uma senha *" 
                    className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-800"
                />
            </div>

            {/* Termos */}
            <div className="flex items-center gap-2 mt-2">
                <input required type="checkbox" id="termos" className="accent-gold-500 w-4 h-4 cursor-pointer" />
                <label htmlFor="termos" className="text-[10px] text-gray-500 cursor-pointer">
                    Li e aceito os <a href="#" className="underline hover:text-gold-600">Termos de Uso</a> e <a href="#" className="underline hover:text-gold-600">Privacidade</a>.
                </label>
            </div>

            {/* Botão Cadastrar */}
            <button type="submit" className="w-full mt-4 bg-gray-900 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-500/20 transition-all transform hover:-translate-y-0.5">
                Criar Minha Conta
            </button>
        </form>

        {/* Voltar para Login */}
        <div className="mt-8 text-center pt-6 border-t border-gray-200/50">
            <p className="text-xs text-gray-500">
                Já é cliente? <Link href="/login" className="text-gold-600 font-bold hover:underline">Fazer Login</Link>
            </p>
        </div>

      </div>
    </div>
  );
}