import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import Brand from './Brand';
import Icon from './Icon';
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

export default function AdminLayout({ children, title, action }: { children: ReactNode; title: string; action?: ReactNode }) {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState({ name: 'Administrador', email: '' });

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      void router.replace('/admin/login');
      return;
    }
    api.get('/admin/usuario')
      .then(({ data }) => {
        setUser(data.data);
        setReady(true);
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        void router.replace('/admin/login');
      });
  }, [router]);

  async function logout() {
    try { await api.post('/admin/logout'); } catch {}
    localStorage.removeItem('admin_token');
    await router.push('/admin/login');
  }

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="grid justify-items-center gap-4 text-sm font-bold text-slate-500"><Brand compact />Validando acesso...</div></div>;
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
