// Deterministic petal layout so server and client render the same markup.
const PETALS = Array.from({ length: 16 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin((i + 1) * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  return {
    left: `${Math.round(r(1) * 100)}%`,
    size: 8 + Math.round(r(2) * 10),
    duration: 14 + Math.round(r(3) * 12),
    delay: -Math.round(r(4) * 24),
  };
});

export function Petals({ count = 16, className = "" }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {PETALS.slice(0, count).map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.25,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="gold-line w-16 sm:w-24" />
      <svg width="22" height="22" viewBox="0 0 24 24" className="text-gold" fill="none">
        <path
          d="M12 3c1.6 2.6 1.6 5.4 0 8-1.6-2.6-1.6-5.4 0-8Zm0 8c2.4-1.9 5.2-2.4 8-1.4-1.4 2.6-4.2 3.6-8 1.4Zm0 0c-2.4-1.9-5.2-2.4-8-1.4 1.4 2.6 4.2 3.6 8 1.4Zm0 0v9"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <span className="gold-line w-16 sm:w-24" />
    </div>
  );
}
