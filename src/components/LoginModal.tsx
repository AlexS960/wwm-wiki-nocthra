import { useState, useEffect } from 'react';
import { X, User, LogIn, UserPlus, Eye, EyeOff, Shield, AlertCircle, Check, Gamepad2, Users } from 'lucide-react';
import { useAuthState, useAuthActions } from '../context/AuthContext';
import { validateUsername, validatePassword, validateGameNickname } from '../lib/validation';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import AccentColorPicker from './ui/AccentColorPicker';
import { applyUserAccent, loadGuestAccent, saveGuestAccent } from '../lib/userAccent';
import type { UserAccentColor } from '../lib/userThemePalette';

type AuthMode = 'login' | 'register';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export default function LoginModal({ isOpen, onClose, initialMode = 'login' }: LoginModalProps) {
  const { registeredGuilds } = useAuthState();
  const { loginWithPassword, register, ensureGuildsLoaded } = useAuthActions();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [gameNickname, setGameNickname] = useState('');
  const [guildId, setGuildId] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [accent, setAccent] = useState<UserAccentColor | null>(() => loadGuestAccent());

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      if (initialMode === 'register') void ensureGuildsLoaded();
    }
  }, [isOpen, initialMode, ensureGuildsLoaded]);

  if (!isOpen) return null;

  const isRegister = mode === 'register';

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setPasswordRepeat('');
    setGameNickname('');
    setGuildId('');
    setError(null);
    setShowPassword(false);
    setShowPasswordRepeat(false);
    setSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    setMode(initialMode);
    onClose();
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setPassword('');
    setPasswordRepeat('');
    setError(null);
    setShowPassword(false);
    setShowPasswordRepeat(false);
  };

  const handleSubmit = async () => {
    setError(null);
    const login = username.trim();
    
    // Validate username
    const usernameValidation = validateUsername(login);
    if (!usernameValidation.valid) {
      setError(usernameValidation.error);
      return;
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.error);
      return;
    }
    
    if (isRegister) {
      // Validate password repeat
      if (password !== passwordRepeat) {
        setError('Пароли не совпадают');
        return;
      }
      
      // Validate game nickname
      const nicknameValidation = validateGameNickname(gameNickname);
      if (!nicknameValidation.valid) {
        setError(nicknameValidation.error);
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        const err = await register(login, password, gameNickname.trim(), guildId);
        if (err) {
          setError(err.includes('duplicate') || err.includes('unique')
            ? 'Такой логин уже занят'
            : err);
          return;
        }
      } else {
        const err = await loginWithPassword(login, password, remember);
        if (err) {
          setError(err);
          return;
        }
      }
      resetForm();
      setMode(initialMode);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') void handleSubmit();
  };

  const canSubmit = isRegister
    ? username.trim().length > 0 && password.length > 0 && passwordRepeat.length > 0
    : username.trim().length > 0 && password.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="overlay-panel relative bg-ink-800 border border-gold-700/30 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="relative p-6 text-center border-b border-ink-700/50">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-ink-400 hover:text-white transition-colors rounded-lg hover:bg-ink-700/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center mx-auto mb-3 border-2 border-gold-400/30">
            {isRegister ? <UserPlus className="w-7 h-7 text-gold-400" /> : <LogIn className="w-7 h-7 text-gold-400" />}
          </div>
          <h2 className="font-serif text-xl font-bold text-white">
            {isRegister ? 'Регистрация' : 'Вход'}
          </h2>
          {isRegister && (
            <p className="text-ink-400 text-xs mt-1">Создайте аккаунт для гайдов, чата и профиля</p>
          )}
        </div>

        <div className="p-6 space-y-4" onKeyDown={handleKeyDown}>
          {error && (
            <div className="flex items-center gap-2 bg-crimson-400/10 border border-crimson-400/30 rounded-lg px-3 py-2.5 text-crimson-400 text-sm animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="text-ink-400 text-xs mb-1.5 block">Логин</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(null); }}
                placeholder="Введите логин"
                autoFocus
                autoComplete="username"
                className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl pl-10 pr-4 py-3 text-sm text-white
                         placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">
                Игровой ник <span className="text-ink-500">(необязательно)</span>
              </label>
              <div className="relative">
                <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  type="text"
                  value={gameNickname}
                  onChange={e => { setGameNickname(e.target.value); setError(null); }}
                  placeholder="Как вас видно в игре"
                  autoComplete="nickname"
                  className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl pl-10 pr-4 py-3 text-sm text-white
                           placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">
                Гильдия <span className="text-ink-500">(необязательно)</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none" />
                <select
                  value={guildId}
                  onChange={e => { setGuildId(e.target.value); setError(null); }}
                  className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Не выбрана</option>
                  {registeredGuilds.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="text-ink-400 text-xs mb-1.5 block">Пароль</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(null); }}
                placeholder="Введите пароль"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl pl-10 pr-10 py-3 text-sm text-white
                         placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">Повторите пароль</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  type={showPasswordRepeat ? 'text' : 'password'}
                  value={passwordRepeat}
                  onChange={e => { setPasswordRepeat(e.target.value); setError(null); }}
                  placeholder="Ещё раз пароль"
                  autoComplete="new-password"
                  className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl pl-10 pr-10 py-3 text-sm text-white
                           placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 cursor-pointer"
                >
                  {showPasswordRepeat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {!isRegister && (
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  remember ? 'bg-gold-400/20 border-gold-400' : 'border-ink-500 group-hover:border-ink-400'
                }`}
                onClick={() => setRemember(!remember)}
              >
                {remember && <Check className="w-3 h-3 text-gold-400" />}
              </div>
              <span className="text-ink-300 text-sm select-none" onClick={() => setRemember(!remember)}>
                Запомнить меня
              </span>
            </label>
          )}

          <div className="pt-2 border-t border-ink-700/30">
            <p className="text-ink-500 text-[10px] mb-2">Цвет интерфейса</p>
            <AccentColorPicker
              value={accent}
              onChange={color => {
                setAccent(color);
                saveGuestAccent(color);
                applyUserAccent(color);
              }}
              compact
            />
          </div>

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!canSubmit || submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400/20 to-gold-600/20
                     border border-gold-400/40 text-gold-400 rounded-xl py-3 px-4 font-semibold
                     hover:from-gold-400/30 hover:to-gold-600/30 hover:border-gold-400/60
                     transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {submitting ? 'Подождите…' : isRegister ? 'Создать аккаунт' : 'Войти'}
          </button>

          <p className="text-center text-sm text-ink-400">
            {isRegister ? (
              <>
                Уже есть аккаунт?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-gold-400 hover:text-gold-300 font-medium cursor-pointer"
                >
                  Войдите
                </button>
              </>
            ) : (
              <>
                Нет аккаунта?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-gold-400 hover:text-gold-300 font-medium cursor-pointer"
                >
                  Зарегистрируйтесь
                </button>
              </>
            )}
          </p>
        </div>

        <div className="px-6 py-3 bg-ink-900/50 border-t border-ink-700/50">
          <p className="text-[10px] text-ink-500 text-center">
            {isRegister
              ? 'Аккаунт сохраняется на сервере. После входа сессия хранится в браузере.'
              : 'Данные сессии хранятся в вашем браузере.'}
          </p>
        </div>
      </div>
    </div>
  );
}
