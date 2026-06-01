import { Trash2 } from 'lucide-react';

interface StaffChatDialogMenuProps {
  x: number;
  y: number;
  onDeleteForMe: () => void;
  onDeleteForAll: () => void;
}

export default function StaffChatDialogMenu({ x, y, onDeleteForMe, onDeleteForAll }: StaffChatDialogMenuProps) {
  return (
    <div
      className="fixed z-[130] min-w-[220px] py-1 bg-ink-900 border border-ink-700/50 rounded-xl shadow-xl"
      style={{ left: Math.min(x, window.innerWidth - 240), top: Math.max(8, y - 8) }}
      onClick={e => e.stopPropagation()}
      role="menu"
    >
      <button
        type="button"
        onClick={onDeleteForMe}
        className="w-full px-3 py-2 text-left text-sm text-ink-200 hover:bg-ink-800 flex items-center gap-2 cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" /> Удалить у меня
      </button>
      <button
        type="button"
        onClick={onDeleteForAll}
        className="w-full px-3 py-2 text-left text-sm text-crimson-300 hover:bg-ink-800 flex items-center gap-2 cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" /> Удалить у всех
      </button>
    </div>
  );
}
