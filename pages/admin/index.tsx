import Link from 'next/link';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Icon from '../../components/Icon';
import api, { apiError } from '../../lib/api';

type DashboardData = {
  resumo: Record<string, number>;
  sugestoes_por_status: Record<string, number>;
  campanhas_recentes: { id: number; titulo: string; status: string; created_at: string }[];
  sugestoes_recentes: { id: number; nome: string; assunto: string; status: string }[];
  mensagens_recentes: { id: number; nome: string; assunto: string; lida: boolean }[];
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/admin/dashboard').then(response => setData(response.data)).catch(err => setError(apiError(err))); }, []);
  const r = data?.resumo || {};
  const cards = [
    ['campaign', 'Campanhas', r.campanhas || 0, `${r.campanhas_publicadas || 0} publicadas`, 'bg-blue-50 text-blue-600'],
    ['news', 'Notícias', r.noticias || 0, `${r.noticias_publicadas || 0} publicadas`, 'bg-emerald-50 text-emerald-600'],
    ['users', 'Sugestões', r.sugestoes || 0, `${r.sugestoes_pendentes || 0} pendentes`, 'bg-amber-50 text-amber-600'],
    ['email', 'Mensagens', r.mensagens || 0, `${r.mensagens_nao_lidas || 0} não lidas`, 'bg-violet-50 text-violet-600'],
  ] as const;

  return <AdminLayout title="Dashboard">
    {error && <p className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([icon, label, value, sub, color]) => <article className="card flex items-center gap-5 p-6" key={label}><span className={`grid h-14 w-14 place-items-center rounded-full ${color}`}><Icon name={icon} size={26} /></span><div><span className="text-xs text-slate-500">{label}</span><strong className="block text-3xl font-extrabold">{value}</strong><small className="text-xs text-slate-500">{sub}</small></div></article>)}</div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3">
      <article className="card p-6"><h2 className="font-extrabold">Campanhas recentes</h2><div className="mt-5 grid gap-3">{data?.campanhas_recentes?.map(item => <div key={item.id} className="flex items-center border-b pb-3 text-sm last:border-0"><strong>{item.titulo}</strong><span className="status ml-auto bg-slate-100 text-slate-600">{item.status}</span></div>) || <p className="text-sm text-slate-500">Carregando...</p>}</div></article>
      <article className="card p-6"><h2 className="font-extrabold">Sugestões recentes</h2><div className="mt-5 grid gap-3">{data?.sugestoes_recentes?.map(item => <div key={item.id} className="border-b pb-3 text-sm last:border-0"><strong>{item.nome}</strong><p className="text-xs text-slate-500">{item.assunto}</p></div>) || <p className="text-sm text-slate-500">Carregando...</p>}</div></article>
      <article className="card p-6"><h2 className="font-extrabold">Mensagens recentes</h2><div className="mt-5 grid gap-3">{data?.mensagens_recentes?.map(item => <div key={item.id} className="flex items-center border-b pb-3 text-sm last:border-0"><div><strong>{item.nome}</strong><p className="text-xs text-slate-500">{item.assunto}</p></div>{!item.lida && <span className="ml-auto h-2 w-2 rounded-full bg-blue-500" />}</div>) || <p className="text-sm text-slate-500">Carregando...</p>}</div></article>
    </div>
    <div className="card mt-5 p-6"><h2 className="font-extrabold">Atalhos rápidos</h2><div className="mt-5 flex flex-wrap gap-3">{[['Campanhas','/admin/campanhas'],['Notícias','/admin/noticias'],['Páginas','/admin/paginas'],['Sugestões','/admin/sugestoes'],['Mensagens','/admin/mensagens'],['Telefones','/admin/telefones']].map(([label, href]) => <Link className="btn-secondary" href={href} key={href}>{label}</Link>)}</div></div>
  </AdminLayout>;
}
