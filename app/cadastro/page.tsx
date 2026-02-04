"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const { signUp } = useAuth();
  const router = useRouter();
  
  // Campos do Formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados de Controle
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    // 1. Validação de Senhas Iguais
    if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        setLoading(false);
        return;
    }

    // 2. Validação de Tamanho de Senha
    if (password.length < 6) {
        setError("A senha precisa ter pelo menos 6 caracteres.");
        setLoading(false);
        return;
    }

    // 3. Tenta Cadastrar
    const res = await signUp(email, password, name, phone);

    if (res.error) {
      // Se der erro, traduz e mostra amigavelmente
      setError(translateError(res.error.message));
      setLoading(false);
    } else {
      // SUCESSO: Redireciona para home ou conta
      // Como desativamos a confirmação de email no Supabase, o login é automático.
      router.push("/"); 
    }
  };

  // Máscara simples de telefone (Visual)
  const handlePhoneChange = (val: string) => {
    // Remove tudo que não é número
    const v = val.replace(/\D/g, "");
    setPhone(v);
  };

  const inputClass = "w-full p-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-500";
  const labelClass = "text-xs uppercase font-bold text-gray-500 mb-1 block";

  return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center mb-10">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-white mb-2">Criar Conta</h1>
            <p className="text-gray-400 text-sm">Junte-se ao clube EG Empório.</p>
        </div>

        {/* MENSAGEM DE ERRO AMIGÁVEL */}
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
                    placeholder="Seu Nome"
                    required 
                />
            </div>
            
            <div>
                <label className={labelClass}>WhatsApp / Telefone</label>
                <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={inputClass}
                    placeholder="(11) 99999-9999"
                    required 
                />
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
                {loading ? "Criando Cadastro..." : "CADASTRAR"}
            </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
            Já tem conta? <Link href="/login" className="text-yellow-500 hover:underline font-bold">Faça Login</Link>
        </div>
      </div>
    </div>
  );
}