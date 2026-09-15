import { create } from 'zustand';

export type User = { id: string; name: string; email: string; role: 'CUSTOMER' | 'SELLER' | 'ADMIN' };

type AuthState = {
  user: User | null;
  hydrated: boolean;
  setUser: (u: User | null) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  hydrated: false,
  setUser: (u) => {
    if (typeof window !== 'undefined') {
      if (u) localStorage.setItem('user', JSON.stringify(u));
      else localStorage.removeItem('user');
    }
    set({ user: u });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ user: null });
  },
  hydrate: () => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('user');
      if (raw) set({ user: JSON.parse(raw), hydrated: true });
      else set({ hydrated: true });
    }
  },
}));
