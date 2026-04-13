"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase"; // Importado para salvar na tabela customers
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const { signUp } = useAuth();
  const router = useRouter();
  
  // Campos do Formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState(""); // Novo campo CPF
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados de Controle
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Controle da tela de cupom

  // === TRADUTOR DE ERROS (Segurança e UX) ===
  const translateError = (errorMsg: string) => {
    if (errorMsg.includes("security purposes")) return "Muitas tentativas. Aguarde alguns segundos e tente novamente.";
    if (errorMsg.includes("already registered")) return "Este e-mail já está cadastrado.";
    if (errorMsg.includes("Password should be")) return "A senha deve ter no mínimo 6 caracteres.";
    if (errorMsg.includes("valid email")) return "Por favor, digite um e-mail válido.";
    return "Ocorreu um erro ao criar a conta. Tente novamente.";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Validações Básicas
    if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        setLoading(false);
        return;
    }

    if (password.length < 6) {
        setError("A senha precisa ter pelo menos 6 caracteres.");
        setLoading(false);
        return;
    }

    if (cpf.length < 11) {
        setError("Por favor, digite um CPF válido.");
        setLoading(false);
        return;
    }

    // 2. Tenta Cadastrar no Auth do Supabase
    const res = await signUp(email, password, name, phone);

    if (res.error) {
      setError(translateError(res.error.message));
      setLoading(false);
    } else {
      // 3. Sucesso no Auth -> Agora salva na nossa tabela de Leads (customers)
      const { error: dbError } = await supabase.from('customers').insert([
        { 
          name, 
          email, 
          cpf, 
          phone,
          created_at: new Date().toISOString()
        }
      ]);

      if (dbError) {
        console.error("Erro ao salvar lead:", dbError.message);
        // Mesmo que dê erro ao salvar o lead, a conta foi criada, então seguimos para o sucesso
      }

      setLoading(false);
      setIsSuccess(true); // Mostra a tela do cupom
    }
  };

  // Máscaras simples (Visual)
  const handlePhoneChange = (val: string) => {
    const v = val.replace(/\D/g, "").slice(0, 11);
    setPhone(v);
  };

  const handleCpfChange = (val: string) => {
    const v = val.replace(/\D/g, "").slice(0, 11);
    setCpf(v);
  };

  const inputClass = "w-full p-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-500";
  const labelClass = "text-xs uppercase font-bold text-gray-500 mb-1 block";

  // --- TELA DE SUCESSO COM O CUPOM ---
  if (isSuccess) {
    return (
        <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
            <div className="w-full max-w-md bg-neutral-900 border border-yellow-500/30 p-8 rounded-2xl shadow-2xl text-center animate-fade-in">
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl text-yellow-500">💎</span>
                </div>
                <h1 className="text-3xl font-serif text-white mb-2">Bem-vinda!</h1>
                <p className="text-gray-400 mb-8">Seu cadastro foi realizado. Como presente de boas-vindas, use o cupom abaixo em sua primeira compra:</p>
                
                <div className="bg-neutral-800 border-2 border-dashed border-yellow-500/50 p-6 rounded-xl mb-8 group cursor-pointer active:scale-95 transition-transform" 
                     onClick={() => { navigator.clipboard.writeText("BEMVINDO15"); alert("Cupom Copiado!"); }}>
                    <span className="text-xs text-gray-500 uppercase font-bold block mb-2 tracking-widest text-center">Código do Cupom</span>
                    <span className="text-4xl font-mono font-black text-yellow-500 tracking-tighter">BEMVINDO15</span>
                    <span className="text-[10px] text-gray-500 block mt-2 text-center uppercase">R$ 15,00 OFF • Clique para copiar</span>
                </div>

                <button 
                    onClick={() => router.push("/")}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-lg transition-all uppercase tracking-widest shadow-lg"
                >
                    COMEÇAR A COMPRAR
                </button>
            </div>
        </div>
    );
  }

  // --- FORMULÁRIO DE CADASTRO ---
  return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center mb-10">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-white mb-2">Criar Conta</h1>
            <p className="text-gray-400 text-sm">Junte-se ao clube EG Empório.</p>
        </div>

        {error && (
            <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-lg text-sm text-center mb-6 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
            <div>
                <label className={labelClass}>Nome Completo</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="Seu Nome Completo"
                    required 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>WhatsApp</label>
                    <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className={inputClass}
                        placeholder="Somente números"
                        required 
                    />
                </div>
                <div>
                    <label className={labelClass}>CPF</label>
                    <input 
                        type="text" 
                        value={cpf}
                        onChange={(e) => handleCpfChange(e.target.value)}
                        className={inputClass}
                        placeholder="Somente números"
                        required 
                    />
                </div>
            </div>

            <div>
                <label className={labelClass}>Email</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="seu@email.com"
                    required 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Senha</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass}
                        placeholder="Mínimo 6"
                        required 
                    />
                </div>
                <div>
                    <label className={labelClass}>Confirmar Senha</label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${inputClass} ${confirmPassword && password !== confirmPassword ? 'border-red-500' : ''}`}
                        placeholder="Repita a senha"
                        required 
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-lg transition-all uppercase tracking-widest disabled:opacity-50 mt-4 shadow-lg hover:shadow-yellow-500/20"
            >
                {loading ? "Criando Cadastro..." : "CADASTRAR E RECEBER CUPOM"}
            </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
            Já tem conta? <Link href="/login" className="text-yellow-500 hover:underline font-bold">Faça Login</Link>
        </div>
      </div>
    </div>
  );
}