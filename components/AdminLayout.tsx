import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import Brand from './Brand';
import Icon from './Icon';
import { Skeleton } from './Skeleton';
import api from '../lib/api';

const nav = [
  ['home', 'Dashboard', '/admin'],
  ['campaign', 'Campanhas', '/admin/campanhas'],
  ['news', 'Notícias', '/admin/noticias'],
  ['document', 'Páginas', '/admin/paginas'],
  ['users', 'Sugestões', '/admin/sugestoes'],
  ['email', 'Mensagens', '/admin/mensagens'],
  ['phone', 'Telefones Úteis', '/admin/telefones'],
  ['image', 'Mídia', '/admin/midia'],
  ['settings', 'Configurações', '/admin/configuracoes'],
  ['shield', 'Minha senha', '/admin/senha'],
  ['chart', 'Relatórios', '/admin/relatorios'],
] as const;

type AdminUser = {
  name: string;
  email: string;
};

let cachedToken: string | null = null;
let cachedUser: AdminUser | null = null;
let validationPromise: Promise<AdminUser> | null = null;

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function AdminLayout({ children, title, action }: { children: ReactNode; title: string; action?: ReactNode }) {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AdminUser>({ name: 'Administrador', email: '' });

  useIsomorphicLayoutEffect(() => {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      cachedToken = null;
      cachedUser = null;
      void router.replace('/admin/login');
      return;
    }

    if (cachedToken === token && cachedUser) {
      setUser(cachedUser);
      setReady(true);
      return;
    }

    let cancelled = false;

    const ensureUser = validationPromise || (validationPromise = api.get('/admin/usuario').then(({ data }) => data.data));

    void ensureUser
      .then((adminUser) => {
        if (cancelled) return;
        cachedToken = token;
        cachedUser = adminUser;
        setUser(adminUser);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem('admin_token');
        cachedToken = null;
        cachedUser = null;
        void router.replace('/admin/login');
      })
      .finally(() => {
        if (validationPromise === ensureUser) {
          validationPromise = null;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function logout() {
    try { await api.post('/admin/logout'); } catch {}
    localStorage.removeItem('admin_token');
    cachedToken = null;
    cachedUser = null;
    await router.push('/admin/login');
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#f4f7fb]">
        <aside className="fixed inset-y-0 left-0 hidden w-64 bg-[#082754] p-5 text-white lg:block">
          <Brand light />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-3 w-36 bg-white/15" />
            <Skeleton className="h-3 w-28 bg-white/15" />
          </div>
          <div className="mt-8 grid gap-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <div className="flex items-center gap-3 rounded-lg px-4 py-3" key={index}>
                <Skeleton className="h-5 w-5 rounded-md bg-white/15" />
                <Skeleton className="h-4 flex-1 bg-white/15" />
              </div>
            ))}
          </div>
        </aside>
        <div className="lg:pl-64">
          <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
            <Skeleton className="h-10 w-10 rounded-lg bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <Skeleton className="h-4 w-28 bg-slate-200" />
                <Skeleton className="mt-2 h-3 w-36 bg-slate-200" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
            </div>
          </header>
          <main className="p-5 lg:p-8">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <Skeleton className="h-7 w-56 bg-slate-200" />
                <Skeleton className="mt-3 h-4 w-80 bg-slate-200" />
              </div>
              <Skeleton className="h-11 w-36 rounded-xl bg-slate-200" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <article className="card p-6" key={index}>
                  <div className="flex items-center gap-5">
                    <Skeleton className="h-14 w-14 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-24 bg-slate-200" />
                      <Skeleton className="h-9 w-16 bg-slate-200" />
                      <Skeleton className="h-3 w-20 bg-slate-200" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }
  return <div className="min-h-screen bg-[#f4f7fb]">
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#082754] p-5 text-white transition lg:translate-x-0 ${menu ? 'translate-x-0' : '-translate-x-full'}`}>
      <Brand light /><p className="mt-3 text-xs font-bold uppercase tracking-wider text-blue-400">Painel administrativo</p>
      <nav className="mt-8 grid gap-1">{nav.map(([icon, label, href]) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${router.pathname === href ? 'bg-blue-600 text-white' : 'text-blue-100/80 hover:bg-white/10'}`}><Icon name={icon} size={19} />{label}</Link>)}</nav>
      <button onClick={logout} className="absolute bottom-6 left-5 right-5 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-blue-100/80 hover:bg-white/10"><Icon name="logout" /> Sair</button>
    </aside>
    {menu && <button aria-label="Fechar menu" className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setMenu(false)} />}
    <div className="lg:pl-64">
      <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8"><button onClick={() => setMenu(true)} className="grid h-10 w-10 place-items-center rounded-lg border lg:hidden"><Icon name="menu" /></button><span className="hidden lg:block" /><div className="flex items-center gap-3"><div className="text-right"><strong className="block text-sm">{user.name}</strong><small className="text-xs text-slate-400">{user.email}</small></div><span className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">{user.name?.[0] || 'A'}</span></div></header>
      <main className="p-5 lg:p-8"><div className="mb-7 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-extrabold text-[#11213e]">{title}</h1><p className="mt-1 text-sm text-slate-500">Gerencie as informações da plataforma.</p></div>{action}</div>{children}</main>
    </div>
  </div>;
}
