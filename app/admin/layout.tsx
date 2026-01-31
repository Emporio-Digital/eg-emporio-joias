'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert('Erro ao entrar: ' + error.message);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-yellow-500">Carregando...</div>;

  // SE NÃO TIVER SESSÃO, MOSTRA TELA DE LOGIN
  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-white mb-2">EG Admin</h1>
            <p className="text-gray-400 text-sm">Acesso restrito à diretoria.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:border-yellow-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:border-yellow-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition"
            >
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // SE TIVER SESSÃO, MOSTRA O CONTEÚDO E BOTÃO DE SAIR
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="fixed top-0 right-0 p-4 z-50">
         <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 underline bg-neutral-900/80 px-3 py-1 rounded">
            Sair do Painel
         </button>
      </div>
      {children}
    </div>
  );
}