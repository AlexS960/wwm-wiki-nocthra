import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, Mail, Lock, User, AlertTriangle } from 'lucide-react';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
}

export default function AuthModal({ mode: initialMode, onClose }: AuthModalProps) {
  const { loginWithPassword, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const handleAsync = async () => {
      if (mode === 'login') {
        if (!email.trim()) { setError('Введите email'); return; }
        const err = await loginWithPassword(email.trim(), password, true);
        if (err) setError(err);
        else onClose();
      } else {
        if (!name.trim()) { setError('Введите имя'); return; }
        if (!email.trim()) { setError('Введите email'); return; }
        const err = await register(name.trim(), password, name.trim());
        if (err) setError(err);
        else onClose();
      }
    };
    handleAsync();
  };

  const demoAccounts = [
    { email: 'admin@nocthra.gg', role: 'Администратор' },
    { email: 'editor@nocthra.gg', role: 'Редактор' },
    { email: 'fox@game.gg', role: 'Пользователь' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-ink-800 border border-gold-700/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-ink-400 hover:text-white cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="font-serif text-xl font-bold text-white mb-1">
            {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
          </h2>
          <p className="text-ink-400 text-sm">
            {mode === 'login' ? 'Войдите в свой аккаунт Nocthra' : 'Создайте новый аккаунт'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-ink-400 text-xs mb-1 block">Имя</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Ваше имя" className="w-full bg-ink-700/50 border border-ink-600/30 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" />
              </div>
            </div>
          )}

          <div>
            <label className="text-ink-400 text-xs mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com" className="w-full bg-ink-700/50 border border-ink-600/30 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" />
            </div>
          </div>

          <div>
            <label className="text-ink-400 text-xs mb-1 block">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" className="w-full bg-ink-700/50 border border-ink-600/30 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-crimson-400 text-sm bg-crimson-400/5 border border-crimson-400/20 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <button type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-gold-400/20 text-gold-400 border border-gold-400/40 rounded-xl font-medium hover:bg-gold-400/30 transition-all cursor-pointer">
            {mode === 'login' ? <><LogIn className="w-4 h-4" /> Войти</> : <><UserPlus className="w-4 h-4" /> Зарегистрироваться</>}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-ink-400 hover:text-gold-400 text-sm cursor-pointer transition-colors">
            {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>

        {/* Demo accounts */}
        {mode === 'login' && (
          <div className="mt-6 pt-4 border-t border-ink-700/30">
            <p className="text-ink-500 text-xs text-center mb-3">Демо-аккаунты (любой пароль):</p>
            <div className="space-y-1.5">
              {demoAccounts.map(acc => (
                <button key={acc.email} onClick={() => { setEmail(acc.email); setPassword('demo'); }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-ink-700/30 text-xs hover:bg-ink-700/50 transition-colors cursor-pointer">
                  <span className="text-ink-300">{acc.email}</span>
                  <span className="text-ink-500 ml-2">— {acc.role}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
