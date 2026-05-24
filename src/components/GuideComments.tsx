import { useState } from 'react';
import { MessageCircle, Send, Trash2, ThumbsUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface GuideCommentsProps {
  guideId: string;
  onLoginClick?: () => void;
}

export default function GuideComments({ guideId, onLoginClick }: GuideCommentsProps) {
  const { user, guideComments, addGuideComment, deleteGuideComment, toggleGuideCommentLike, isAdmin } = useAuth();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const comments = guideComments
    .filter(c => c.guideId === guideId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleSubmit = async () => {
    if (!user) {
      onLoginClick?.();
      return;
    }
    if (!text.trim() || sending) return;
    setSending(true);
    const err = await addGuideComment(guideId, text.trim());
    setSending(false);
    if (!err) setText('');
  };

  return (
    <div className="mt-8 bg-ink-800/40 border border-ink-700/30 rounded-xl p-5 sm:p-6">
      <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-gold-400" />
        Комментарии
        <span className="text-ink-500 text-sm font-normal">({comments.length})</span>
      </h3>

      {comments.length === 0 ? (
        <p className="text-ink-500 text-sm mb-4">Пока нет комментариев. Будьте первым!</p>
      ) : (
        <ul className="space-y-3 mb-4 max-h-[360px] overflow-y-auto pr-1">
          {comments.map(c => {
            const likes = c.likes || [];
            const liked = user ? likes.includes(user.id) : false;
            return (
              <li key={c.id} className="bg-ink-900/50 border border-ink-700/25 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-gold-400/90 text-xs font-medium">{c.userName}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-ink-600 text-[10px]">
                      {new Date(c.createdAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {(user?.id === c.userId || isAdmin()) && (
                      <button
                        type="button"
                        onClick={() => deleteGuideComment(c.id)}
                        className="p-1 text-ink-600 hover:text-crimson-400 cursor-pointer"
                        title="Удалить"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-ink-200 text-sm whitespace-pre-wrap break-words mb-2">{c.text}</p>
                <button
                  type="button"
                  onClick={() => {
                    if (!user) onLoginClick?.();
                    else toggleGuideCommentLike(c.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs cursor-pointer transition-colors ${
                    liked
                      ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                      : 'bg-ink-800 text-ink-400 border border-ink-700/40 hover:text-gold-300'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                  {likes.length > 0 && <span>{likes.length}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {user ? (
        <div className="flex gap-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={2}
            maxLength={800}
            placeholder="Написать комментарий..."
            className="flex-1 bg-ink-900/80 border border-ink-600/40 rounded-xl px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/40 resize-none"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim() || sending}
            className="self-end px-4 py-2 rounded-xl bg-gold-400/20 text-gold-400 border border-gold-400/40 hover:bg-gold-400/30 cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onLoginClick}
          className="text-sm text-gold-400 hover:underline cursor-pointer"
        >
          Войдите, чтобы оставить комментарий
        </button>
      )}
    </div>
  );
}
