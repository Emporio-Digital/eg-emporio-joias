'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  size?: string | null; // Adicionado
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number, size?: string | null) => void; // Melhorado
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

  useEffect(() => {
    const saved = localStorage.getItem('eg_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eg_cart', JSON.stringify(items));
    const newTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [items]);

  function addToCart(product: any) {
    setItems(prev => {
      // Verifica se já existe o mesmo item COM o mesmo tamanho
      const existing = prev.find(i => i.id === product.id && i.size === product.size);
      
      if (existing) {
        return prev.map(i => 
          (i.id === product.id && i.size === product.size) 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      
      return [...prev, {
        id: product.id,
        title: product.title,
        price: product.sale_price || product.price,
        image: product.images?.[0] || product.image || '',
        quantity: 1,
        size: product.size || null
      }];
    });
    setCartOpen(true);
  }

  function removeFromCart(id: number, size?: string | null) {
    setItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, clearCart, 
      cartOpen, setCartOpen, total, 
      cartCount: items.reduce((acc, item) => acc + item.quantity, 0) 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);