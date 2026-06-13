import SectionHeader from './ui/SectionHeader';
import SectionWikiBody from './wiki/SectionWikiBody';

export default function BossesSection() {
  return (
    <section id="bosses" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="bosses"
          icon="👹"
          title="Боссы и Стратегии"
          subtitle="Полное руководство по всем боссам: локации, стратегии, награды и советы"
        />
        <SectionWikiBody sectionId="bosses" />
      </div>
    </section>
  );
}
