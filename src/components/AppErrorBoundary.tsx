import { Component, type ErrorInfo, type ReactNode } from 'react';
import { isChunkLoadError, recoverFromChunkError } from '../lib/chunkError';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  reloading: boolean;
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null, reloading: false };

  static getDerivedStateFromError(error: Error): State {
    return { error, reloading: false };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('AppErrorBoundary caught an error', 'AppErrorBoundary', { error, componentStack: info.componentStack });
    if (isChunkLoadError(error)) {
      void recoverFromChunkError().then(ok => {
        if (ok) this.setState({ reloading: true });
      });
    }
  }

  handleRecover = () => {
    this.setState({ reloading: true, error: null });
    void recoverFromChunkError(true);
  };

  render() {
    if (this.state.reloading) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-ink-900 text-ink-100">
          <p className="text-sm text-ink-300">Обновление версии сайта…</p>
        </div>
      );
    }

    if (this.state.error) {
      const isChunk = isChunkLoadError(this.state.error);
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-ink-900 text-ink-100">
          <div className="max-w-lg w-full rounded-2xl border border-crimson-400/40 bg-ink-800/80 p-6 space-y-4">
            <h1 className="font-serif text-xl font-bold text-crimson-300">Ошибка интерфейса</h1>
            <p className="text-sm text-ink-300">
              {isChunk
                ? 'Сайт обновился, а в браузере осталась старая версия. Нажмите кнопку — кэш очистится и страница перезагрузится.'
                : 'Приложение не смогло отрисоваться. Откройте консоль браузера (F12) для подробностей.'}
            </p>
            <pre className="text-xs text-ink-400 bg-ink-900/80 rounded-lg p-3 overflow-auto max-h-40 whitespace-pre-wrap break-words">
              {this.state.error.message}
            </pre>
            <button
              type="button"
              onClick={this.handleRecover}
              className="px-4 py-2 rounded-lg bg-gold-400/20 text-gold-400 text-sm font-medium hover:bg-gold-400/30 cursor-pointer"
            >
              {isChunk ? 'Обновить сайт' : 'Перезагрузить страницу'}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
