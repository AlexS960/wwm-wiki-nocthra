import { useState } from 'react';
import { X, User, LogIn, UserPlus, Eye, EyeOff, Shield, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginWithPassword, register } = useAuth();
  const t = (key: string) => {
    const m: Record<string, string> = {
      'auth.login': 'Вход', 'auth.register': 'Регистрация', 'auth.username': 'Логин', 'auth.password': 'Пароль',
      'auth.password.repeat': 'Повторите пароль', 'auth.remember': 'Запомнить меня', 'auth.submit.login': 'Войти',
      'auth.submit.register': 'Создать аккаунт', 'auth.no.account': 'Нет аккаунта?', 'auth.has.account': 'Уже есть аккаунт?',
      'auth.register.link': 'Зарегистрируйтесь', 'auth.login.link': 'Войдите', 'auth.enter.login': 'Введите логин',
      'auth.enter.pass': 'Введите пароль', 'auth.success': 'Аккаунт создан! Добро пожаловать!',
    };
    return m[key] || key;
  };
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [gameNickname, setGameNickname] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setUsername(''); setPassword(''); setPasswordConfirm(''); setGameNickname('');
    setError(null); setSuccess(false); setShowPassword(false);
  };

  const switchMode = (m: 'login' | 'register') => {
    setMode(m); resetForm();
  };

  const handleLogin = async () => {
    setError(null);
    if (!username.trim() || !password) { setError('Введите логин и пароль'); return; }
    const err = await loginWithPassword(username.trim(), password, remember);
    if (err) { setError(err); return; }
    resetForm(); onClose();
  };

  const handleRegister = async () => {
    setError(null);
    if (!username.trim() || !password || !gameNickname.trim()) { setError('Заполните все поля'); return; }
    if (password !== passwordConfirm) { setError('Пароли не совпадают'); return; }
    const err = await register(username.trim(), password, gameNickname.trim());
    if (err) { setError(err); return; }
    setSuccess(true);
    setTimeout(() => { resetForm(); onClose(); }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (mode === 'login') handleLogin();
      else handleRegister();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-ink-800 border border-gold-700/30 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-6 text-center border-b border-ink-700/50">
          <button onClick={onClose}
            className="absolute top-4 right-4 p-2 text-ink-400 hover:text-white transition-colors rounded-lg hover:bg-ink-700/50 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mx-auto mb-3 border-2 border-gold-400/30">
            {mode === 'login' ? <LogIn className="w-7 h-7 text-gold-400" /> : <UserPlus className="w-7 h-7 text-gold-400" />}
          </div>
          <h2 className="font-serif text-xl font-bold text-white">
            {mode === 'login' ? t('auth.login') : t('auth.register')}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ink-700/50">
          <button onClick={() => switchMode('login')}
            className={`flex-1 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
              mode === 'login' ? 'text-gold-400 border-b-2 border-gold-400 -mb-px' : 'text-ink-400 hover:text-ink-200'
            }`}>
            {t('auth.login')}
          </button>
          <button onClick={() => switchMode('register')}
            className={`flex-1 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
              mode === 'register' ? 'text-gold-400 border-b-2 border-gold-400 -mb-px' : 'text-ink-400 hover:text-ink-200'
            }`}>
            {t('auth.register')}
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4" onKeyDown={handleKeyDown}>
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-crimson-400/10 border border-crimson-400/30 rounded-lg px-3 py-2.5 text-crimson-400 text-sm animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 bg-jade-400/10 border border-jade-400/30 rounded-lg px-3 py-2.5 text-jade-400 text-sm animate-fadeIn">
              <Check className="w-4 h-4 shrink-0" />
              <span>Аккаунт создан! Добро пожаловать!</span>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="text-ink-400 text-xs mb-1.5 block">{t('auth.username')}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(null); }}
                placeholder={t('auth.enter.login')}
                autoFocus
                className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl pl-10 pr-4 py-3 text-sm text-white
                         placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-ink-400 text-xs mb-1.5 block">{t('auth.password')}</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(null); }}
                placeholder={t('auth.enter.pass')}
                className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl pl-10 pr-10 py-3 text-sm text-white
                         placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
              <button onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (register only) */}
          {mode === 'register' && (
            <div className="animate-fadeIn">
              <label className="text-ink-400 text-xs mb-1.5 block">{t('auth.password.repeat')}</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={e => { setPasswordConfirm(e.target.value); setError(null); }}
                  placeholder="Повторите пароль"
                  className={`w-full bg-ink-900/50 border rounded-xl pl-10 pr-4 py-3 text-sm text-white
                           placeholder:text-ink-500 focus:outline-none transition-colors ${
                    passwordConfirm && password !== passwordConfirm
                      ? 'border-crimson-400/50 focus:border-crimson-400/70'
                      : 'border-ink-600/40 focus:border-gold-400/50'
                  }`}
                />
              </div>
              {passwordConfirm && password !== passwordConfirm && (
                <p className="text-crimson-400 text-[11px] mt-1">Пароли не совпадают</p>
              )}
            </div>
          )}

          {/* Game Nickname (register only) */}
          {mode === 'register' && (
            <div className="animate-fadeIn">
              <label className="text-ink-400 text-xs mb-1.5 block">Игровой ник</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  type="text"
                  value={gameNickname}
                  onChange={e => { setGameNickname(e.target.value); setError(null); }}
                  placeholder="Введите игровой ник"
                  className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl pl-10 pr-4 py-3 text-sm text-white
                           placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Remember me (login only) */}
          {mode === 'login' && (
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                remember ? 'bg-gold-400/20 border-gold-400' : 'border-ink-500 group-hover:border-ink-400'
              }`}
                onClick={() => setRemember(!remember)}>
                {remember && <Check className="w-3 h-3 text-gold-400" />}
              </div>
              <span className="text-ink-300 text-sm select-none" onClick={() => setRemember(!remember)}>{t('auth.remember')}</span>
            </label>
          )}

          {/* Submit */}
          <button
            onClick={mode === 'login' ? handleLogin : handleRegister}
            disabled={!username.trim() || !password || (mode === 'register' && (!passwordConfirm || !gameNickname.trim()))}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400/20 to-gold-600/20
                     border border-gold-400/40 text-gold-400 rounded-xl py-3 px-4 font-semibold
                     hover:from-gold-400/30 hover:to-gold-600/30 hover:border-gold-400/60
                     transition-all duration-300 cursor-pointer
                     disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {mode === 'login' ? (
              <><LogIn className="w-4 h-4" /> {t('auth.submit.login')}</>
            ) : (
              <><UserPlus className="w-4 h-4" /> {t('auth.submit.register')}</>
            )}
          </button>

          {/* Switch hint */}
          <p className="text-center text-ink-500 text-xs">
            {mode === 'login' ? (
              <>{t('auth.no.account')} <button onClick={() => switchMode('register')} className="text-gold-400 hover:text-gold-300 cursor-pointer">{t('auth.register.link')}</button></>
            ) : (
              <>{t('auth.has.account')} <button onClick={() => switchMode('login')} className="text-gold-400 hover:text-gold-300 cursor-pointer">{t('auth.login.link')}</button></>
            )}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-ink-900/50 border-t border-ink-700/50">
          <p className="text-[10px] text-ink-500 text-center">
            Данные хранятся локально в вашем браузере.
          </p>
        </div>
      </div>
    </div>
  );
}
