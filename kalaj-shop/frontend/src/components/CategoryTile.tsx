'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CategoryTile({
  slug,
  name,
  icon,
  featured = false,
  subtitle,
}: {
  slug: string;
  name: string;
  icon: string;
  featured?: boolean;
  subtitle?: string;
}) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <Link
      href={`/?category=${slug}`}
      className={`group relative h-full rounded-3xl overflow-hidden flex flex-col justify-end p-5 border border-[var(--color-line)] transition-all duration-300 hover:shadow-layered-lg hover:-translate-y-1 ${
        featured && !imgOk ? 'bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-deep)] text-white' : 'bg-white'
      }`}
    >
      {imgOk && (
        <>
          <img
            src={`/categories/${slug}.jpg`}
            alt={name}
            onError={() => setImgOk(false)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </>
      )}

      {!imgOk && (
        <span
          className={`absolute top-4 left-4 text-5xl md:text-6xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6 ${
            featured ? 'opacity-30' : 'opacity-90'
          }`}
        >
          {icon}
        </span>
      )}

      <span className={`relative z-10 font-bold ${featured ? 'text-xl md:text-2xl' : 'text-sm'} ${imgOk ? 'text-white' : ''}`}>
        {name}
      </span>
      {featured && subtitle && (
        <span className={`relative z-10 text-xs mt-1 ${imgOk ? 'text-white/80' : 'text-white/70'}`}>{subtitle}</span>
      )}
    </Link>
  );
}
