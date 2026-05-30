interface SectionHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
  sectionId?: string;
}

export default function SectionHeader({ icon, title, subtitle, sectionId }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      <div className="text-gold-400 text-3xl mb-3">{icon}</div>
      <h2 id={sectionId} className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">{title}</h2>
      <p className="text-ink-300 max-w-xl mx-auto">{subtitle}</p>
      <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
    </div>
  );
}
