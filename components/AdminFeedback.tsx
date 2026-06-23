import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastInput = {
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
};

type Toast = Required<Omit<ToastInput, 'title'>> & {
  id: number;
  title: string;
};

type AdminFeedbackContextValue = {
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
};

const defaultTitles: Record<ToastType, string> = {
  success: 'Sucesso',
  error: 'Erro',
  warning: 'Atenção',
  info: 'Aviso',
};

const AdminFeedbackContext = createContext<AdminFeedbackContextValue | null>(null);

export function AdminFeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<number, number>());

  const removeToast = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(({ type, message, title, duration = 4500 }: ToastInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const nextToast: Toast = {
      id,
      type,
      message,
      title: title || defaultTitles[type],
      duration,
    };

    setToasts((current) => [...current, nextToast]);

    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
      timers.current.delete(id);
    }, duration) as unknown as number;

    timers.current.set(id, timer);
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
    };
  }, []);

  const value = useMemo<AdminFeedbackContextValue>(() => ({
    success: (message, title) => pushToast({ type: 'success', message, title }),
    error: (message, title) => pushToast({ type: 'error', message, title }),
    warning: (message, title) => pushToast({ type: 'warning', message, title }),
    info: (message, title) => pushToast({ type: 'info', message, title }),
  }), [pushToast]);

  return (
    <AdminFeedbackContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[120] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => {
          const styles = {
            success: 'border-emerald-200 bg-emerald-50 text-emerald-900 shadow-emerald-950/5',
            error: 'border-rose-200 bg-rose-50 text-rose-900 shadow-rose-950/5',
            warning: 'border-amber-200 bg-amber-50 text-amber-900 shadow-amber-950/5',
            info: 'border-sky-200 bg-sky-50 text-sky-900 shadow-sky-950/5',
          }[toast.type];

          const accent = {
            success: 'bg-emerald-500',
            error: 'bg-rose-500',
            warning: 'bg-amber-500',
            info: 'bg-sky-500',
          }[toast.type];

          return (
            <article
              aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
              className={`pointer-events-auto overflow-hidden rounded-2xl border shadow-xl transition-all duration-300 ${styles}`}
              key={toast.id}
              role={toast.type === 'error' ? 'alert' : 'status'}
            >
              <div className={`h-1 ${accent}`} />
              <div className="flex gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <strong className="block text-sm font-extrabold">{toast.title}</strong>
                  <p className="mt-1 text-sm leading-6 opacity-90">{toast.message}</p>
                </div>
                <button
                  aria-label="Fechar notificação"
                  className="shrink-0 rounded-lg px-2 text-xl leading-none opacity-50 transition hover:opacity-100"
                  type="button"
                  onClick={() => removeToast(toast.id)}
                >
                  ×
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </AdminFeedbackContext.Provider>
  );
}

export function useAdminFeedback() {
  const context = useContext(AdminFeedbackContext);

  if (!context) {
    throw new Error('useAdminFeedback must be used within AdminFeedbackProvider.');
  }

  return context;
}
