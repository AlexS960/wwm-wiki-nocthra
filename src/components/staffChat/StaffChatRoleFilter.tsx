interface RoleOption {
  id: string;
  label: string;
  color: string;
}

interface StaffChatRoleFilterProps {
  options: RoleOption[];
  value: string;
  onChange: (roleId: string) => void;
}

export default function StaffChatRoleFilter({ options, value, onChange }: StaffChatRoleFilterProps) {
  if (options.length <= 1) return null;
  return (
    <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-ink-700/30">
      <button
        type="button"
        onClick={() => onChange('all')}
        className={`px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer border transition-colors ${
          value === 'all'
            ? 'bg-gold-500/20 text-gold-300 border-gold-500/40'
            : 'text-ink-400 border-ink-700/50 hover:border-ink-600'
        }`}
      >
        Все роли
      </button>
      {options.map(opt => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer border transition-colors ${
            value === opt.id
              ? 'border-current'
              : 'text-ink-400 border-ink-700/50 hover:border-ink-600'
          }`}
          style={value === opt.id ? { color: opt.color, backgroundColor: `${opt.color}18`, borderColor: `${opt.color}55` } : undefined}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
