import SectionHeader from './ui/SectionHeader';
import SectionWikiBody from './wiki/SectionWikiBody';

export default function MysticArtsSection() {
  return (
    <section id="mystic" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="mystic"
          icon="✨"
          title="Мистические Арты"
          subtitle="Мощные способности, открываемые через квесты, боссов и секты"
        />
        <SectionWikiBody sectionId="mystic" />
      </div>
    </section>
  );
}
