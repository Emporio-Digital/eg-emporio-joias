'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipagem do item no carrinho
type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

// Tipagem das funções do contexto
type CartContextType = {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  total: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [total, setTotal] = useState(0);

  // Carregar do LocalStorage ao iniciar (Persistência)
  useEffect(() => {
    const saved = localStorage.getItem('eg_cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // Salvar no LocalStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('eg_cart', JSON.stringify(items));
    
    // Calcula total
    const newTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [items]);

  function addToCart(product: any) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      
      // Se já existe, aumenta quantidade
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      
      // Se é novo, adiciona
      return [...prev, {
        id: product.id,
        title: product.title,
        price: product.sale_price || product.price, // Pega o preço promocional se existir
        image: product.images?.[0] || '', // Pega a primeira imagem
        quantity: 1
      }];
    });
    setCartOpen(true); // Abre a gaveta automaticamente
  }

  function removeFromCart(id: number) {
    setItems(prev => prev.filter(item => item.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      cartOpen, 
      setCartOpen, 
      total, 
      cartCount: items.reduce((acc, item) => acc + item.quantity, 0) 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);