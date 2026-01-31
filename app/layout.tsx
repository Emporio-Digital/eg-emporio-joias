import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer";
import Image from "next/image";
import { CartProvider } from "@/context/CartContext"; 
import RetentionPopup from "@/components/RetentionPopup"; 

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
      {/* MUDANÇA: Fundo agora é bg-neutral-950 (Preto Suave) e texto claro */}
      <body className={`${inter.className} bg-neutral-950 text-gray-200 min-h-screen flex flex-col`}>
        
        <CartProvider>
            
            {/* Marca D'água */}
            <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                {/* MUDANÇA: Opacidade reduzida para 0.10 para ficar sutil no fundo preto */}
                <div className="relative w-[90vw] h-[90vh] opacity-[0.10]"> 
                    <Image 
                        src="/bg-joias.png" 
                        alt="Marca D'água" 
                        fill 
                        className="object-contain"
                    />
                </div>
            </div>

            <div className="relative z-10 flex-grow flex flex-col">
                <Navbar /> 
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </div>

            <RetentionPopup />

        </CartProvider>
      </body>
    </html>
  );
}