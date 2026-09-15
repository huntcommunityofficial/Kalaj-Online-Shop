'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Reveal from '@/components/Reveal';
import ReadingProgress from '@/components/ReadingProgress';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '');

function readingTime(text: string) {
  const words = text?.trim().split(/\s+/).length || 0;
  return Math.max(1, Math.round(words / 120));
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/posts/${slug}`).then(({ data }) => {
      setPost(data);
      api.get('/posts').then(({ data: all }) => {
        setRelated(all.filter((p: any) => p.slug !== slug && p.category === data.category).slice(0, 3));
      });
    });
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="h-8 w-2/3 rounded animate-shimmer mb-4" />
        <div className="h-4 w-1/3 rounded animate-shimmer mb-8" />
        <div className="aspect-video rounded-2xl animate-shimmer mb-8" />
        <div className="h-4 rounded animate-shimmer mb-2 w-full" />
        <div className="h-4 rounded animate-shimmer mb-2 w-full" />
        <div className="h-4 rounded animate-shimmer w-2/3" />
      </div>
    );
  }

  const paragraphs = post.content.split('\n').filter(Boolean);

  return (
    <div>
      <ReadingProgress />
      <div className="max-w-3xl mx-auto px-4 pt-10">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[var(--color-brand)] mb-6">
          <ArrowRight size={15} /> بازگشت به مجله
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-4 pb-16">
        <Reveal>
          <span className="text-xs font-bold text-[var(--color-brand)] bg-[var(--color-brand)]/10 px-3 py-1.5 rounded-full">{post.category}</span>
          <h1 className="text-3xl md:text-4xl font-black mt-5 mb-5 leading-tight tracking-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 mb-8 pb-8 border-b border-[var(--color-line)]">
            <span className="flex items-center gap-1.5"><User size={15} /> {post.authorName}</span>
            <span className="flex items-center gap-1.5"><Calendar size={15} /> {new Date(post.createdAt).toLocaleDateString('fa-IR')}</span>
            <span className="flex items-center gap-1.5"><Clock size={15} /> {readingTime(post.content)} دقیقه مطالعه</span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="aspect-video bg-gradient-to-br from-[var(--color-paper)] to-[var(--color-coral-soft)] rounded-3xl flex items-center justify-center text-8xl mb-10 overflow-hidden shadow-layered">
            {post.coverImage ? <img src={`${API_BASE}${post.coverImage}`} alt={post.title} className="w-full h-full object-cover" /> : '📰'}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="leading-9 text-gray-700 text-[17px] flex flex-col gap-5">
            {paragraphs.map((para: string, i: number) => (
              <p key={i} className={i === 0 ? 'first-letter:text-5xl first-letter:font-black first-letter:text-[var(--color-brand)] first-letter:ml-2 first-letter:float-right' : ''}>
                {para}
              </p>
            ))}
          </div>
        </Reveal>
      </article>

      {related.length > 0 && (
        <section className="bg-white border-t border-[var(--color-line)] py-12">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="font-bold text-lg mb-6">مقاله‌های مرتبط</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group bg-[var(--color-paper)] rounded-2xl overflow-hidden hover:shadow-layered transition-all">
                  <div className="aspect-video flex items-center justify-center text-4xl bg-gradient-to-br from-white to-[var(--color-coral-soft)] overflow-hidden">
                    {p.coverImage ? <img src={`${API_BASE}${p.coverImage}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" /> : '📰'}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm group-hover:text-[var(--color-brand)] transition-colors line-clamp-2">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
