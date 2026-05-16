import { Wrench, ArrowLeft } from 'lucide-react';

interface MaintenancePageProps {
  title: string;
  message: string;
  onBack: () => void;
}

export default function MaintenancePage({ title, message: _message, onBack }: MaintenancePageProps) {
  return (
    <div className="min-h-screen bg-ink-900 text-ink-100 pt-16 md:pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-ink-400 hover:text-gold-400 transition-colors cursor-pointer mb-10">
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        <div className="rounded-3xl border border-gold-700/20 bg-ink-800/60 backdrop-blur-md p-8 md:p-12 text-center shadow-2xl shadow-black/30">
          <div className="w-20 h-20 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-10 h-10 text-gold-400" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">{title}</h1>
          <p className="text-gold-400 font-medium mb-4">Раздел находится на технических работах</p>
          <div className="mt-8 flex items-center justify-center gap-2 text-ink-500 text-sm">
            <span>⚙️</span>
            <span>Мы работаем над улучшением раздела. Загляните позже.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
