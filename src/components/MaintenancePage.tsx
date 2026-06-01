import { Wrench, ArrowLeft } from 'lucide-react';

interface MaintenancePageProps { title: string; message: string; onBack: () => void; }

export default function MaintenancePage({ title, message, onBack }: MaintenancePageProps) {
  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
      <div className="text-center max-w-md">
        <Wrench className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-ink-400 mb-6">{message}</p>
        <button onClick={onBack} className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold-400/10 text-gold-400 rounded-lg cursor-pointer hover:bg-gold-400/20">
          <ArrowLeft className="w-4 h-4" /> Вернуться на главную
        </button>
      </div>
    </div>
  );
}
