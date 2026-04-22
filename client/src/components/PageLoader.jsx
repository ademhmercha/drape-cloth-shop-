export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-cream flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <span className="font-display text-2xl tracking-[0.3em] text-charcoal animate-pulse">
          DRAPE
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
