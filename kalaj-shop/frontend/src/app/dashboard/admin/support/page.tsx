'use client';
import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';
import { Send, User, Mail, CheckCircle2, Circle } from 'lucide-react';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function load() {
    api.get('/support/admin/all').then(({ data }) => {
      setTickets(data);
      if (!activeId && data.length > 0) setActiveId(data[0].id);
    });
  }

  useEffect(load, []);
  useEffect(() => {
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const active = tickets.find((t) => t.id === activeId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [active?.messages?.length]);

  async function reply(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !activeId) return;
    setLoading(true);
    try {
      await api.post(`/support/${activeId}/messages`, { message: text });
      setText('');
      load();
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus() {
    if (!active) return;
    await api.put(`/support/${active.id}/status`, { status: active.status === 'OPEN' ? 'CLOSED' : 'OPEN' });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">تیکت‌های پشتیبانی</h1>
      <div className="grid md:grid-cols-[280px_1fr] gap-4 bg-white border border-[var(--color-line)] rounded-2xl overflow-hidden" style={{ height: '70vh' }}>
        {/* لیست تیکت‌ها */}
        <div className="border-l border-[var(--color-line)] overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-10">هنوز پیامی دریافت نشده.</div>
          ) : (
            tickets.map((t) => {
              const last = t.messages[t.messages.length - 1];
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={`w-full text-right p-4 border-b border-[var(--color-line)] hover:bg-[var(--color-paper)] transition-colors ${activeId === t.id ? 'bg-[var(--color-paper)]' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{t.name}</span>
                    {t.status === 'OPEN' ? (
                      <Circle size={9} className="fill-[var(--color-mint)] text-[var(--color-mint)]" />
                    ) : (
                      <Circle size={9} className="fill-gray-300 text-gray-300" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{last?.message}</p>
                </button>
              );
            })
          )}
        </div>

        {/* پنل گفتگو */}
        <div className="flex flex-col">
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">یک تیکت انتخاب کنید</div>
          ) : (
            <>
              <div className="p-4 border-b border-[var(--color-line)] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5"><User size={14} /> {active.name}</div>
                  {active.email && <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5"><Mail size={12} /> {active.email}</div>}
                </div>
                <button onClick={toggleStatus} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${active.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  <CheckCircle2 size={13} /> {active.status === 'OPEN' ? 'باز است' : 'بسته شده'}
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[var(--color-paper)]">
                {active.messages.map((m: any) => (
                  <div key={m.id} className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-6 ${
                    m.sender === 'ADMIN' ? 'self-end bg-[var(--color-brand)] text-white rounded-bl-sm' : 'self-start bg-white border border-[var(--color-line)] rounded-br-sm'
                  }`}>
                    {m.message}
                  </div>
                ))}
              </div>

              <form onSubmit={reply} className="p-3 border-t border-[var(--color-line)] flex items-center gap-2 bg-white">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="پاسخ خود را بنویسید..."
                  className="flex-1 border border-[var(--color-line)] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
                <button disabled={loading} className="p-2.5 rounded-xl bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-deep)] disabled:opacity-50">
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
