import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { compressImageFileToBlob } from '../../lib/imageUpload';
import { uploadSiteImage, deleteSiteImageByUrl, isStorageUrl } from '../../lib/storage';

const MAX_IMAGES = 10;

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  /** Папка в Storage: guides | wiki | news */
  storageFolder?: string;
}

export default function ImageUploader({ images, onChange, storageFolder = 'uploads' }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    const slots = MAX_IMAGES - images.length;
    if (slots <= 0) {
      setError(`Максимум ${MAX_IMAGES} скриншотов`);
      return;
    }
    setLoading(true);
    const next = [...images];
    try {
      for (let i = 0; i < Math.min(files.length, slots); i++) {
        const blob = await compressImageFileToBlob(files[i]);
        const { url, error: upErr } = await uploadSiteImage(blob, storageFolder);
        if (upErr || !url) throw new Error(upErr || 'Ошибка загрузки в Storage');
        next.push(url);
      }
      onChange(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = async (index: number) => {
    const url = images[index];
    if (isStorageUrl(url)) void deleteSiteImageByUrl(url);
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-gold-400/70 text-xs mb-1.5 block">
        Скриншоты <span className="text-ink-500">(до {MAX_IMAGES} шт., Supabase Storage)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {images.map((src, i) => (
          <div key={src + i} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-ink-600/50 group">
            <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 p-0.5 rounded bg-black/70 text-white opacity-0 group-hover:opacity-100 sm:opacity-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {images.length < MAX_IMAGES && (
          <button
            type="button"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-dashed border-gold-500/40 flex flex-col items-center justify-center gap-1 text-gold-400/70 hover:bg-gold-400/5 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
            <span className="text-[10px]">Добавить</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => addFiles(e.target.files)}
      />
      {error && <p className="text-crimson-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
