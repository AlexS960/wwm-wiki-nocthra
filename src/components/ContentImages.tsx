/** Галерея скриншотов в статьях / гайдах */
export default function ContentImages({ images }: { images?: string[] }) {
  if (!images?.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-ink-700/30">
      {images.map((src, i) => (
        <a
          key={i}
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl overflow-hidden border border-ink-600/30 hover:border-gold-500/30 transition-colors"
        >
          <img src={src} alt={`Скриншот ${i + 1}`} className="w-full h-auto max-h-80 object-contain bg-ink-900" loading="lazy" />
        </a>
      ))}
    </div>
  );
}
