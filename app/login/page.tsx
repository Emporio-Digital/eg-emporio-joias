"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const res = await signIn(email, password);
    if (res.error) {
      setError("Email ou senha incorretos.");
      setLoading(false);
    }
  };

  const inputClass = "w-full p-4 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-yellow-500 transition-colors";

  return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-white mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-400 text-sm">Acesse sua conta para ver seus pedidos.</p>
        </div>

        {error && <div className="bg-red-900/30 text-red-400 p-3 rounded text-sm text-center mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Email</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="seu@email.com"
                    required 
                />
            </div>
            <div>
                <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Senha</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                    required 
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-lg transition-all uppercase tracking-widest disabled:opacity-50"
            >
                {loading ? "Entrando..." : "Acessar Conta"}
            </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
            Ainda não tem conta? <Link href="/cadastro" className="text-yellow-500 hover:underline">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
}