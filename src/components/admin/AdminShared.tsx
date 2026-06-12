export function StatBox({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="font-serif text-2xl font-bold text-gold-400">{value}</div>
      <div className="text-ink-400 text-xs">{label}</div>
    </div>
  );
}

export function ConfirmModal({ title, message, onConfirm, onCancel }: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative bg-ink-800 border border-crimson-400/30 rounded-xl p-6 max-w-sm w-full">
        <h3 className="font-serif text-lg text-white font-bold mb-2">{title}</h3>
        <p className="text-ink-300 text-sm mb-4">{message}</p>
        <div className="flex gap-2">
          <button type="button" onClick={onConfirm} className="flex-1 bg-crimson-400/20 text-crimson-400 py-2 rounded-lg font-medium hover:bg-crimson-400/30 cursor-pointer">
            Подтвердить
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-ink-700 text-ink-300 py-2 rounded-lg hover:bg-ink-600 cursor-pointer">
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
