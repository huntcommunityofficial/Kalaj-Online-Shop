'use client';
import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/store/auth';
import { MessageCircle, X, Send, Headphones } from 'lucide-react';

function getGuestId() {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('guest_id');
  if (!id) {
    id = 'guest-' + Math.random().toString(36).slice(2, 12);
    localStorage.setItem('guest_id', id);
  }
  return id;
}

export default function SupportWidget() {
  const { user, hydrate } = useAuth();
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { hydrate(); }, [hydrate]);

  async function loadTicket() {
    const guestId = getGuestId();
    const { data } = await api.get('/support/mine', { params: user ? {} : { guestId } });
    if (data.length > 0) setTicket(data[0]);
  }

  useEffect(() => {
    if (open) loadTicket();
  }, [open, user]);

  useEffect(() => {
    if (!open || !ticket) return;
    const interval = setInterval(async () => {
      const guestId = getGuestId();
      const { data } = await api.get('/support/mine', { params: user ? {} : { guestId } });
      if (data.length > 0) setTicket(data[0]);
    }, 4000);
    return () => clearInterval(interval);
  }, [open, ticket, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [ticket?.messages?.length]);

  async function startTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/support', {
        name: user?.name || name || 'کاربر مهمان',
        email: user?.email,
        message: text,
        guestId: getGuestId(),
      });
      setTicket(data);
      setText('');
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !ticket) return;
    setLoading(true);
    try {
      await api.post(`/support/${ticket.id}/messages`, { message: text, guestId: getGuestId() });
      setText('');
      await loadTicket();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-[90] w-14 h-14 rounded-full brand-gradient text-white shadow-brand-glow flex items-center justify-center hover:scale-110 active:scale-95 transition-transform animate-pulse-glow"
        title="پشتیبانی آنلاین"
      >
        {open ? <X size={22} /> : <Headphones size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[90] w-[92vw] max-w-sm h-[70vh] max-h-[520px] bg-white dark:bg-[#1c1730] rounded-3xl shadow-2xl border border-[var(--color-line)] flex flex-col overflow-hidden animate-scale-in">
          <div className="brand-gradient text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle size={20} />
            </div>
            <div>
              <div className="font-bold text-sm">پشتیبانی کالاژ</div>
              <div className="text-xs text-white/70">معمولاً در چند دقیقه پاسخ می‌دیم</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[var(--color-paper)]">
            {!ticket ? (
              <div className="text-center text-sm text-gray-400 py-8">
                سوال یا مشکلی داری؟ پیامت رو بنویس تا سریع بررسی کنیم 👇
              </div>
            ) : (
              ticket.messages.map((m: any) => (
                <div key={m.id} className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-6 ${
                  m.sender === 'USER' ? 'self-end bg-[var(--color-brand)] text-white rounded-bl-sm' : 'self-start bg-white border border-[var(--color-line)] rounded-br-sm'
                }`}>
                  {m.message}
                </div>
              ))
            )}
          </div>

          <form onSubmit={ticket ? sendMessage : startTicket} className="p-3 border-t border-[var(--color-line)] flex flex-col gap-2 bg-white">
            {!ticket && !user && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="نام شما (اختیاری)"
                className="border border-[var(--color-line)] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
            )}
            <div className="flex items-center gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="پیامت رو بنویس..."
                className="flex-1 border border-[var(--color-line)] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
              />
              <button disabled={loading} className="p-2.5 rounded-xl bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-deep)] disabled:opacity-50">
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
