import SectionHeader from './ui/SectionHeader';
import SectionWikiBody from './wiki/SectionWikiBody';

export default function SectsSection() {
  return (
    <section id="sects" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="sects"
          icon="🏛️"
          title="Секты и Фракции"
          subtitle="Игровые секты со своими уникальными способностями, оружием и стилем"
        />
        <SectionWikiBody sectionId="sects" />
      </div>
    </section>
  );
}
