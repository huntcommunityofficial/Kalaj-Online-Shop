'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };
type ToastContextType = { show: (message: string, type?: Toast['type']) => void };

const ToastContext = createContext<ToastContextType>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  const ICONS = { success: CheckCircle2, error: XCircle, info: Info };
  const COLORS = {
    success: 'bg-[var(--color-mint)]',
    error: 'bg-red-500',
    info: 'bg-[var(--color-brand)]',
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-5 left-5 z-[100] flex flex-col gap-2 max-w-xs w-full">
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div
              key={t.id}
              className={`${COLORS[t.type]} text-white rounded-2xl shadow-layered-lg px-4 py-3 flex items-center gap-2 animate-scale-in`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="text-sm font-medium flex-1">{t.message}</span>
              <button onClick={() => remove(t.id)} className="shrink-0 opacity-70 hover:opacity-100">
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
