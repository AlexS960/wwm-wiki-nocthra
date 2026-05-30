import { Star } from 'lucide-react';
import ContentImages from './ContentImages';

export default function MarkdownBody({ content, images }: { content: string; images?: string[] }) {
  return (
    <>
      <div className="space-y-2">
        {content.split('\n').map((line, i) => {
          if (line.startsWith('## ')) {
            return (
              <h4 key={i} className="font-serif text-lg font-bold text-gold-400 mt-4 first:mt-0">
                {line.replace('## ', '')}
              </h4>
            );
          }
          if (line.startsWith('- ')) {
            return (
              <div key={i} className="flex items-start gap-2 text-sm text-ink-200">
                <Star className="w-3 h-3 text-gold-400 mt-1 shrink-0" />
                <span>{line.replace('- ', '')}</span>
              </div>
            );
          }
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <p key={i} className="text-white font-semibold text-sm">
                {line.replace(/\*\*/g, '')}
              </p>
            );
          }
          if (!line.trim()) return <div key={i} className="h-2" />;
          return <p key={i} className="text-ink-200 text-sm leading-relaxed">{line}</p>;
        })}
      </div>
      <ContentImages images={images} />
    </>
  );
}
