'use client';

export default function TextReveal({ text, className = '', delayStart = 0 }: { text: string; className?: string; delayStart?: number }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block animate-word-in"
            style={{ animationDelay: `${delayStart + i * 70}ms` }}
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </span>
  );
}
