import { create } from 'zustand';
import api from '@/lib/api';

type CartItem = {
  id: string;
  quantity: number;
  productId: string;
  product: { id: string; title: string; price: number; images: string; stock: number; slug: string };
};

type CartState = {
  items: CartItem[];
  loading: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  drawerOpen: false,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/cart');
      set({ items: data.items || [] });
    } catch {
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },
  addItem: async (productId, quantity = 1) => {
    await api.post('/cart/items', { productId, quantity });
    await get().fetchCart();
  },
  updateItem: async (id, quantity) => {
    await api.put(`/cart/items/${id}`, { quantity });
    await get().fetchCart();
  },
  removeItem: async (id) => {
    await api.delete(`/cart/items/${id}`);
    await get().fetchCart();
  },
  count: () => get().items.reduce((s, i) => s + i.quantity, 0),
  subtotal: () => get().items.reduce((s, i) => s + i.quantity * i.product.price, 0),
}));
