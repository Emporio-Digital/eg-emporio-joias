import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Navbar agora está dentro do CartProvider
import Footer from "@/components/Footer";
import Image from "next/image";
import { CartProvider } from "@/context/CartContext"; // <--- Importação adicionada

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EG Empório Joias | Ouro 18k, Prata e Acessórios Exclusivos",
  description: "Joias exclusivas banhadas a Ouro 18k, Prata e Ródio Branco. Peças de luxo com garantia.",
  icons: {
    icon: '/bg-joias.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      {/* bg-white forçado aqui e text-gray-800 para contraste */}
      <body className={`${inter.className} bg-white text-gray-800 min-h-screen flex flex-col`}>
        
        {/* Envolvendo tudo com o Provider para o carrinho funcionar */}
        <CartProvider>
            
            {/* Marca D'água (Ajustei a opacidade para 0.15 para ficar bem suave no fundo branco) */}
            <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="relative w-[90vw] h-[90vh] opacity-[0.15]"> 
                <Image 
                    src="/bg-joias.png" 
                    alt="Marca D'água" 
                    fill 
                    className="object-contain"
                />
            </div>
            </div>

            <div className="relative z-10 flex-grow flex flex-col">
            <Navbar /> {/* Navbar agora tem acesso ao contexto do carrinho */}
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            </div>

        </CartProvider>
      </body>
    </html>
  );
}