import { USER_ACCENT_PALETTE, type UserAccentColor } from '../../lib/userThemePalette';

interface AccentColorPickerProps {
  value: UserAccentColor | null;
  onChange: (color: UserAccentColor) => void;
  compact?: boolean;
}

export default function AccentColorPicker({ value, onChange, compact }: AccentColorPickerProps) {
  return (
    <div className={`flex flex-wrap ${compact ? 'gap-1.5' : 'gap-2'}`} role="listbox" aria-label="Цвет интерфейса">
      {USER_ACCENT_PALETTE.map(color => {
        const selected = value === color;
        return (
          <button
            key={color}
            type="button"
            role="option"
            aria-selected={selected}
            title={color}
            onClick={() => onChange(color)}
            className={`rounded-full border-2 transition-transform cursor-pointer shrink-0 ${
              compact ? 'w-7 h-7' : 'w-8 h-8'
            } ${selected ? 'border-white scale-110 shadow-md' : 'border-ink-600/50 hover:border-ink-400/70 hover:scale-105'}`}
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}
