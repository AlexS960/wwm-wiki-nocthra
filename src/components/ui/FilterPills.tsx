interface FilterPillsProps {
  options: { value: string; label: string; icon?: string }[];
  active: string;
  onChange: (value: string) => void;
}

export default function FilterPills({ options, active, onChange }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
            active === option.value
              ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
              : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'
          }`}
        >
          {option.icon && <span>{option.icon}</span>}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
