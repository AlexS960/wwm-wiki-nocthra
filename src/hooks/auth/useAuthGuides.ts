import { useCallback, useRef, useState } from 'react';
import type { GuideArticle, GuideComment, GuideVersion, User } from '../../types/site';
import {
  contentStoreLoadGuides,
  contentStoreLoadGuidesPage,
  contentStoreSearchGuides,
  contentStoreLoadGuideComments,
  contentStoreLoadGuideVersions,
  contentStoreUsesNormalized,
  contentStoreAddGuide,
  contentStoreUpdateGuide,
  contentStoreDeleteGuide,
  contentStoreAddGuideComment,
  contentStoreDeleteGuideComment,
  contentStoreUpdateGuideCommentLikes,
  contentStoreSyncGuideVersions,
} from '../../lib/contentStore';
import { sanitizeGuides, sanitizeGuideVersions } from '../../lib/siteImages';
import { asArray, MAX_GUIDE_VERSIONS } from '../../context/authContextTypes';
import { getDisplayName } from '../../lib/displayName';
import { GUIDES_PAGE_SIZE } from '../../lib/db';
import type { MutableRefObject } from 'react';
import type { NormalizedDomains } from './types';

type Deps = {
  user: User | null;
  persist: (key: string, data: unknown) => Promise<string | null>;
  setDbSaveError: (msg: string | null) => void;
  normalizedRef: MutableRefObject<NormalizedDomains>;
};

export function useAuthGuides({ user, persist, setDbSaveError, normalizedRef }: Deps) {
  const [guides, setGuides] = useState<GuideArticle[]>([]);
  const [guideComments, setGuideComments] = useState<GuideComment[]>([]);
  const [guideVersions, setGuideVersions] = useState<GuideVersion[]>([]);
  const [guidesLoaded, setGuidesLoaded] = useState(false);
  const [guideMetaLoaded, setGuideMetaLoaded] = useState(false);
  const [guidesHasMore, setGuidesHasMore] = useState(false);
  const [guidesTotal, setGuidesTotal] = useState(0);
  const [guidesLoading, setGuidesLoading] = useState(false);
  const [guidesListQuery, setGuidesListQuery] = useState('');
  const [guidesListCategory, setGuidesListCategory] = useState('Все');

  const guidesRef = useRef(guides);
  const guideCommentsRef = useRef(guideComments);
  const guidesLoadRef = useRef<Promise<void> | null>(null);
  const guideMetaLoadRef = useRef<Promise<void> | null>(null);
  const guidesPageRef = useRef(1);

  guidesRef.current = guides;
  guideCommentsRef.current = guideComments;

  const fetchGuidesPage = useCallback(async (
    page: number,
    append: boolean,
    query = guidesListQuery,
    category = guidesListCategory,
  ) => {
    setGuidesLoading(true);
    try {
      const result = await contentStoreLoadGuidesPage({
        page,
        limit: GUIDES_PAGE_SIZE,
        category,
        query,
      });
      setGuidesTotal(result.total);
      setGuidesHasMore(result.hasMore);
      setGuides(prev => (append ? [...prev, ...result.items] : result.items));
      guidesPageRef.current = page;
    } finally {
      setGuidesLoading(false);
    }
  }, [guidesListCategory, guidesListQuery]);

  const ensureGuidesLoaded = useCallback(async () => {
    if (guidesLoaded) return;
    if (!guidesLoadRef.current) {
      guidesLoadRef.current = (async () => {
        normalizedRef.current.guides = await contentStoreUsesNormalized('guides');
        if (normalizedRef.current.guides) {
          guidesPageRef.current = 1;
          await fetchGuidesPage(1, false);
        } else {
          setGuides(sanitizeGuides(await contentStoreLoadGuides()));
          setGuidesHasMore(false);
          setGuidesTotal(guidesRef.current.length);
        }
        setGuidesLoaded(true);
      })();
    }
    await guidesLoadRef.current;
  }, [guidesLoaded, normalizedRef, fetchGuidesPage]);

  const loadMoreGuides = useCallback(async () => {
    if (!guidesHasMore || guidesLoading) return;
    await fetchGuidesPage(guidesPageRef.current + 1, true);
  }, [guidesHasMore, guidesLoading, fetchGuidesPage]);

  const searchGuidesList = useCallback(async (query: string, category: string) => {
    setGuidesListQuery(query);
    setGuidesListCategory(category);
    guidesPageRef.current = 1;
    if (!guidesLoaded) {
      normalizedRef.current.guides = await contentStoreUsesNormalized('guides');
      if (normalizedRef.current.guides) {
        await fetchGuidesPage(1, false, query, category);
      } else {
        setGuides(sanitizeGuides(await contentStoreLoadGuides()));
      }
      setGuidesLoaded(true);
      return;
    }
    await fetchGuidesPage(1, false, query, category);
  }, [guidesLoaded, normalizedRef, fetchGuidesPage]);

  const searchGuidesRemote = useCallback((query: string) => contentStoreSearchGuides(query), []);

  const ensureGuideMetaLoaded = useCallback(async () => {
    if (guideMetaLoaded) return;
    if (!guideMetaLoadRef.current) {
      guideMetaLoadRef.current = (async () => {
        normalizedRef.current.comments = await contentStoreUsesNormalized('comments');
        normalizedRef.current.versions = await contentStoreUsesNormalized('versions');
        const [comments, versions] = await Promise.all([
          contentStoreLoadGuideComments(),
          contentStoreLoadGuideVersions(),
        ]);
        setGuideComments(asArray<GuideComment>(comments));
        setGuideVersions(sanitizeGuideVersions(versions));
        setGuideMetaLoaded(true);
      })();
    }
    await guideMetaLoadRef.current;
  }, [guideMetaLoaded, normalizedRef]);

  const addGuide = useCallback((g: Omit<GuideArticle, 'id' | 'authorName' | 'updatedAt'>) => {
    const newGuide = {
      ...g,
      id: 'g' + Date.now(),
      authorName: user?.name || '',
      updatedAt: new Date().toISOString(),
    } as GuideArticle;
    setGuides(prev => [newGuide, ...prev]);
    void (async () => {
      if (await contentStoreUsesNormalized('guides')) {
        const ok = await contentStoreAddGuide(newGuide);
        if (!ok) setDbSaveError('Не удалось сохранить гайд');
      } else {
        await persist('guides', [newGuide, ...guidesRef.current]);
      }
    })();
  }, [user?.name, persist, setDbSaveError]);

  const updateGuide = useCallback(async (id: string, u: Partial<GuideArticle>) => {
    const current = guides.find(x => x.id === id);
    let nextVersions = guideVersions;
    if (current && user) {
      const snapshot: GuideVersion = {
        id: 'gv' + Date.now(),
        guideId: id,
        title: current.title,
        summary: current.summary,
        content: current.content,
        category: current.category,
        difficulty: current.difficulty,
        readTime: current.readTime,
        icon: current.icon,
        images: current.images,
        savedAt: new Date().toISOString(),
        savedBy: getDisplayName(user),
      };
      const forGuide = [snapshot, ...guideVersions.filter(v => v.guideId === id)].slice(0, MAX_GUIDE_VERSIONS);
      nextVersions = [...guideVersions.filter(v => v.guideId !== id), ...forGuide];
      setGuideVersions(nextVersions);
      const verErr = await contentStoreSyncGuideVersions(nextVersions);
      if (verErr.error) return verErr.error;
    }
    const nextGuides = guides.map(x => x.id === id ? { ...x, ...u, updatedAt: new Date().toISOString() } : x);
    setGuides(nextGuides);
    const updated = nextGuides.find(x => x.id === id);
    if (await contentStoreUsesNormalized('guides') && updated) {
      const ok = await contentStoreUpdateGuide(id, updated);
      if (!ok) return 'Не удалось обновить гайд';
    } else {
      await persist('guides', nextGuides);
    }
  }, [guides, guideVersions, user, persist]);

  const getGuideVersions = useCallback((guideId: string) =>
    guideVersions
      .filter(v => v.guideId === guideId)
      .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()),
  [guideVersions]);

  const restoreGuideVersion = useCallback(async (guideId: string, versionId: string) => {
    const version = guideVersions.find(v => v.id === versionId && v.guideId === guideId);
    if (!version) return 'Версия не найдена';
    const current = guides.find(g => g.id === guideId);
    if (!current) return 'Гайд не найден';
    let nextVersions = guideVersions;
    if (user) {
      const snapshot: GuideVersion = {
        id: 'gv' + Date.now(),
        guideId,
        title: current.title,
        summary: current.summary,
        content: current.content,
        category: current.category,
        difficulty: current.difficulty,
        readTime: current.readTime,
        icon: current.icon,
        images: current.images,
        savedAt: new Date().toISOString(),
        savedBy: getDisplayName(user),
      };
      const forGuide = [snapshot, ...guideVersions.filter(v => v.guideId === guideId)].slice(0, MAX_GUIDE_VERSIONS);
      nextVersions = [...guideVersions.filter(v => v.guideId !== guideId), ...forGuide];
    }
    const restored = {
      title: version.title,
      summary: version.summary,
      content: version.content,
      category: version.category,
      difficulty: version.difficulty,
      readTime: version.readTime,
      icon: version.icon,
      images: version.images,
      updatedAt: new Date().toISOString(),
    };
    const nextGuides = guides.map(g => g.id === guideId ? { ...g, ...restored } : g);
    setGuides(nextGuides);
    setGuideVersions(nextVersions);
    const e1 = await contentStoreSyncGuideVersions(nextVersions);
    if (e1.error) return e1.error;
    const updated = nextGuides.find(g => g.id === guideId);
    if (await contentStoreUsesNormalized('guides') && updated) {
      const ok = await contentStoreUpdateGuide(guideId, updated);
      return ok ? null : 'Не удалось восстановить гайд';
    }
    return persist('guides', nextGuides);
  }, [guideVersions, guides, user, persist]);

  const deleteGuide = useCallback((id: string) => {
    const prev = guidesRef.current;
    const next = prev.filter(x => x.id !== id);
    setGuides(next);
    void (async () => {
      if (await contentStoreUsesNormalized('guides')) {
        const ok = await contentStoreDeleteGuide(id);
        if (!ok) {
          setGuides(prev);
          setDbSaveError('Не удалось удалить гайд');
        }
      } else {
        await persist('guides', next);
      }
    })();
  }, [persist, setDbSaveError]);

  const addGuideComment = useCallback(async (guideId: string, text: string) => {
    if (!user) return 'Войдите в аккаунт';
    const c: GuideComment = {
      id: 'gc' + Date.now(),
      guideId,
      userId: user.id,
      userName: getDisplayName(user),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      likes: [],
    };
    const prev = guideCommentsRef.current;
    const next = [...prev, c];
    setGuideComments(next);
    if (await contentStoreUsesNormalized('comments')) {
      const ok = await contentStoreAddGuideComment(c);
      if (!ok) {
        setGuideComments(prev);
        return 'Не удалось сохранить комментарий';
      }
    } else {
      const err = await persist('guide_comments', next);
      if (err) {
        setGuideComments(prev);
        return err;
      }
    }
    return null;
  }, [user, persist]);

  const deleteGuideComment = useCallback((id: string) => {
    const prev = guideCommentsRef.current;
    const next = prev.filter(x => x.id !== id);
    setGuideComments(next);
    void (async () => {
      if (await contentStoreUsesNormalized('comments')) {
        const ok = await contentStoreDeleteGuideComment(id);
        if (!ok) {
          setGuideComments(prev);
          setDbSaveError('Не удалось удалить комментарий');
        }
      } else {
        await persist('guide_comments', next);
      }
    })();
  }, [persist, setDbSaveError]);

  const toggleGuideCommentLike = useCallback(async (commentId: string, userId: string) => {
    const prev = guideCommentsRef.current;
    const next = prev.map(c => {
      if (c.id !== commentId) return c;
      const likes = c.likes || [];
      const has = likes.includes(userId);
      return { ...c, likes: has ? likes.filter(uid => uid !== userId) : [...likes, userId] };
    });
    setGuideComments(next);
    if (await contentStoreUsesNormalized('comments')) {
      const c = next.find(x => x.id === commentId);
      if (!c) return 'Комментарий не найден';
      const ok = await contentStoreUpdateGuideCommentLikes(commentId, c.likes || []);
      if (!ok) {
        setGuideComments(prev);
        return 'Не удалось обновить лайк';
      }
      return null;
    }
    return persist('guide_comments', next);
  }, [persist]);

  return {
    guides,
    setGuides,
    guideComments,
    setGuideComments,
    guideVersions,
    setGuideVersions,
    guidesLoaded,
    guideMetaLoaded,
    setGuideMetaLoaded,
    guidesHasMore,
    guidesTotal,
    guidesLoading,
    ensureGuidesLoaded,
    ensureGuideMetaLoaded,
    loadMoreGuides,
    searchGuidesList,
    searchGuidesRemote,
    addGuide,
    updateGuide,
    deleteGuide,
    getGuideVersions,
    restoreGuideVersion,
    addGuideComment,
    deleteGuideComment,
    toggleGuideCommentLike,
  };
}
