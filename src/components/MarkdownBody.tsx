import ContentImages from './ContentImages';
import { renderWikiContent } from '../lib/wikiContent';

export default function MarkdownBody({ content, images }: { content: string; images?: string[] }) {
  return (
    <>
      <div className="space-y-2">{renderWikiContent(content)}</div>
      <ContentImages images={images} />
    </>
  );
}
