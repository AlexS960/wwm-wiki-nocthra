import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AppErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-ink-900 text-ink-100">
          <div className="max-w-lg w-full rounded-2xl border border-crimson-400/40 bg-ink-800/80 p-6 space-y-4">
            <h1 className="font-serif text-xl font-bold text-crimson-300">Ошибка интерфейса</h1>
            <p className="text-sm text-ink-300">
              Приложение не смогло отрисоваться. Откройте консоль браузера (F12) для подробностей.
            </p>
            <pre className="text-xs text-ink-400 bg-ink-900/80 rounded-lg p-3 overflow-auto max-h-40 whitespace-pre-wrap break-words">
              {this.state.error.message}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-gold-400/20 text-gold-400 text-sm font-medium hover:bg-gold-400/30 cursor-pointer"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
