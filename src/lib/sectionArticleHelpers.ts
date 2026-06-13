import type { WikiArticle } from '../types/site';
import type { SectionSchema } from '../data/sectionSchemas';
import type { SectionEditorValues } from '../components/ui/SectionEditorModal';
import {
  buildSectionContent,
  listToTextarea,
  parseSectionContent,
  textareaToList,
} from './sectionContent';
import { asWikiText } from './wikiNormalize';

export type StructuredEditorValues = SectionEditorValues & {
  nameEn: string;
  tagValues: Record<string, string>;
  structuredText: Record<string, string>;
  structuredLists: Record<string, string>;
};

export function wikiArticleToStructured(article: WikiArticle, schema: SectionSchema): StructuredEditorValues {
  const parsed = parseSectionContent(article.content);
  const tagValues: Record<string, string> = {};
  schema.tagFields?.forEach(f => {
    tagValues[f.id] = asWikiText(article.fields?.[f.id]);
  });
  if (!tagValues.theme) tagValues.theme = parsed.getLine('## Тема');
  if (!tagValues.weapon) tagValues.weapon = parsed.getLine('## Оружие');

  const structuredText: Record<string, string> = {};
  const structuredLists: Record<string, string> = {};
  for (const field of schema.contentFields) {
    if (field.kind === 'list') {
      structuredLists[field.id] = listToTextarea(parsed.getList(field.header));
    } else if (field.kind === 'textarea') {
      const idx = parsed.lines.findIndex(l => l.toLowerCase() === field.header.toLowerCase());
      if (idx >= 0) {
        const chunk: string[] = [];
        for (let i = idx + 1; i < parsed.lines.length; i++) {
          const line = parsed.lines[i];
          if (line.startsWith('## ')) break;
          chunk.push(line);
        }
        structuredText[field.id] = chunk.join('\n').trim();
      } else {
        structuredText[field.id] = '';
      }
    } else {
      structuredText[field.id] = parsed.getLine(field.header);
    }
  }

  return {
    title: asWikiText(article.title),
    summary: asWikiText(article.fields?.summary),
    content: asWikiText(article.content),
    category: asWikiText(article.fields?.category),
    icon: asWikiText(article.icon),
    images: article.images || [],
    nameEn: asWikiText(article.fields?.nameEn),
    tagValues,
    structuredText,
    structuredLists,
  };
}

export function structuredToWikiPayload(
  values: StructuredEditorValues,
  schema: SectionSchema,
  normalizeCategory: (c: string) => string,
) {
  const sections = schema.contentFields.map(field => ({
    header: field.header,
    body: field.kind === 'list'
      ? textareaToList(values.structuredLists[field.id] || '')
      : (values.structuredText[field.id] || ''),
  }));

  const content = schema.contentFields.length > 0
    ? buildSectionContent(sections)
    : values.content.trim();

  const fields: Record<string, string> = {
    summary: values.summary.trim(),
    category: normalizeCategory(values.category),
  };
  if (schema.showNameEn && values.nameEn.trim()) fields.nameEn = values.nameEn.trim();
  schema.tagFields?.forEach(f => {
    const v = values.tagValues[f.id]?.trim();
    if (v) fields[f.id] = v;
  });

  return {
    title: values.title.trim(),
    content,
    icon: values.icon,
    images: values.images,
    fields,
  };
}

export function editorValuesToWikiPayload(
  values: SectionEditorValues,
  schema: SectionSchema | undefined,
  normalizeCategory: (c: string) => string,
) {
  if (!schema) {
    return {
      title: values.title,
      content: values.content,
      icon: values.icon,
      images: values.images,
      fields: {
        summary: values.summary.trim(),
        category: normalizeCategory(values.category),
      },
    };
  }

  return structuredToWikiPayload(
    {
      ...values,
      nameEn: values.nameEn || '',
      tagValues: values.tagValues || {},
      structuredText: values.structuredText || {},
      structuredLists: values.structuredLists || {},
    },
    schema,
    normalizeCategory,
  );
}

export function wikiArticleToEditorInitial(
  article: WikiArticle,
  schema: SectionSchema | undefined,
  normalizeCategory: (c: string) => string,
  defaultCategory: string,
): Partial<SectionEditorValues> {
  if (!schema) {
    return {
      title: article.title,
      summary: article.fields?.summary || '',
      content: article.content,
      category: normalizeCategory(article.fields?.category) || defaultCategory,
      icon: article.icon,
      images: article.images || [],
    };
  }

  const structured = wikiArticleToStructured(article, schema);
  return {
    ...structured,
    category: normalizeCategory(article.fields?.category) || defaultCategory,
  };
}

export function defaultStructuredInitial(schema: SectionSchema): Partial<SectionEditorValues> {
  const tagValues: Record<string, string> = {};
  schema.tagFields?.forEach(f => { tagValues[f.id] = ''; });
  const structuredText: Record<string, string> = {};
  const structuredLists: Record<string, string> = {};
  schema.contentFields.forEach(f => {
    if (f.kind === 'list') structuredLists[f.id] = '';
    else structuredText[f.id] = '';
  });
  return {
    nameEn: '',
    tagValues,
    structuredText,
    structuredLists,
    content: schema.defaultContentTemplate,
    images: [],
  };
}
