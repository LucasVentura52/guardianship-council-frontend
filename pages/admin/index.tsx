import Link from 'next/link';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Icon from '../../components/Icon';
import { Skeleton } from '../../components/Skeleton';
import api, { apiError } from '../../lib/api';

type DashboardData = {
  resumo: Record<string, number>;
  sugestoes_por_status: Record<string, number>;
  atividade_ultimos_7_dias: {
    data: string;
    rotulo: string;
    sugestoes: number;
    mensagens: number;
    total: number;
  }[];
  acessos_ultimos_7_dias: { data: string; rotulo: string; total: number }[];
  campanhas_recentes: { id: number; titulo: string; status: string; created_at: string }[];
  sugestoes_recentes: { id: number; nome: string; assunto: string; status: string }[];
  mensagens_recentes: { id: number; nome: string; assunto: string; lida: boolean }[];
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/admin/dashboard').then(response => setData(response.data)).catch(err => setError(apiError(err))); }, []);
  const r = data?.resumo || {};
  const atividade = data?.atividade_ultimos_7_dias || [];
  const acessos = data?.acessos_ultimos_7_dias || [];
  const maiorAcesso = Math.max(1, ...acessos.map(item => item.total));
  const totalInteracoes = atividade.reduce((total, item) => total + item.total, 0);
  const sugestoesPorStatus = data?.sugestoes_por_status || {};
  const totalSugestoes = Math.max(1, Object.values(sugestoesPorStatus).reduce((total, value) => total + value, 0));
  const statusConfig = [
    ['pendente', 'Pendentes', 'bg-amber-500'],
    ['aprovada', 'Aprovadas', 'bg-emerald-500'],
    ['reprovada', 'Reprovadas', 'bg-rose-500'],
  ] as const;
  const cards = [
    ['campaign', 'Campanhas', r.campanhas || 0, `${r.campanhas_publicadas || 0} publicadas`, 'bg-blue-50 text-blue-600'],
    ['news', 'Notícias', r.noticias || 0, `${r.noticias_publicadas || 0} publicadas`, 'bg-emerald-50 text-emerald-600'],
    ['users', 'Sugestões', r.sugestoes || 0, `${r.sugestoes_pendentes || 0} pendentes`, 'bg-amber-50 text-amber-600'],
    ['email', 'Mensagens', r.mensagens || 0, `${r.mensagens_nao_lidas || 0} não lidas`, 'bg-violet-50 text-violet-600'],
  ] as const;

  return <AdminLayout title="Dashboard">
    {error && <p className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {!data && Array.from({ length: 4 }).map((_, index) => (
        <article className="card flex items-center gap-5 p-6" key={index}>
          <Skeleton className="h-14 w-14 rounded-full bg-slate-200" />
          <div className="flex-1">
            <Skeleton className="h-3 w-20 bg-slate-200" />
            <Skeleton className="mt-2 h-9 w-16 bg-slate-200" />
            <Skeleton className="mt-2 h-3 w-24 bg-slate-200" />
          </div>
        </article>
      ))}
      {data && cards.map(([icon, label, value, sub, color]) => <article className="card flex items-center gap-5 p-6" key={label}><span className={`grid h-14 w-14 place-items-center rounded-full ${color}`}><Icon name={icon} size={26} /></span><div><span className="text-xs text-slate-500">{label}</span><strong className="block text-3xl font-extrabold">{value}</strong><small className="text-xs text-slate-500">{sub}</small></div></article>)}
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <article className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          {!data ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-56 bg-slate-200" />
              <Skeleton className="h-3 w-72 bg-slate-200" />
            </div>
          ) : (
            <div><h2 className="font-extrabold">Acessos nos últimos 7 dias</h2><p className="mt-1 text-xs text-slate-500">Visualizações registradas nas páginas públicas.</p></div>
          )}
          {!data ? (
            <Skeleton className="h-14 w-24 rounded-lg bg-slate-200" />
          ) : (
            <div className="rounded-lg bg-blue-50 px-3 py-2 text-right"><strong className="block text-lg text-blue-700">{r.acessos_7_dias || 0}</strong><span className="text-[10px] font-bold uppercase text-blue-500">acessos</span></div>
          )}
        </div>
        <div className="mt-7 flex h-52 items-end gap-3 border-b border-slate-200 px-1">
          {!data && Array.from({ length: 7 }).map((_, index) => (
            <div className="flex h-full min-w-0 flex-1 flex-col justify-end" key={index}>
              <Skeleton className="mx-auto mb-2 h-3 w-6 bg-slate-200" />
              <div className="flex h-[150px] items-end justify-center"><Skeleton className="w-full max-w-10 rounded-t bg-slate-200" style={{ height: `${35 + (index % 4) * 18}%` }} /></div>
              <Skeleton className="mt-2 h-3 w-12 bg-slate-200" />
            </div>
          ))}
          {data && acessos.map(item => (
            <div className="flex h-full min-w-0 flex-1 flex-col justify-end" key={item.data} title={`${item.total} acessos em ${new Date(`${item.data}T12:00:00`).toLocaleDateString('pt-BR')}`}>
              <span className="mb-2 text-center text-[10px] font-bold text-slate-400">{item.total}</span>
              <div className="flex h-[150px] items-end justify-center"><span className="w-full max-w-10 rounded-t bg-gradient-to-t from-blue-600 to-cyan-400 transition-all" style={{ height: item.total ? `${Math.max(8, (item.total / maiorAcesso) * 100)}%` : '3px' }} /></div>
              <span className="mt-2 truncate text-center text-[10px] font-bold uppercase text-slate-500">{item.rotulo}</span>
            </div>
          ))}
        </div>
        {!data ? (
          <Skeleton className="mt-4 h-4 w-72 bg-slate-200" />
        ) : (
          <p className="mt-4 text-xs text-slate-500"><strong className="text-slate-700">{totalInteracoes}</strong> interações recebidas no mesmo período entre mensagens e sugestões.</p>
        )}
      </article>
      <article className="card p-6">
        {!data ? (
          <>
            <Skeleton className="h-5 w-52 bg-slate-200" />
            <Skeleton className="mt-1 h-3 w-64 bg-slate-200" />
            <div className="mt-7 grid gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className="mb-2 flex items-center justify-between text-xs"><Skeleton className="h-3 w-20 bg-slate-200" /><Skeleton className="h-3 w-14 bg-slate-200" /></div>
                  <Skeleton className="h-2.5 w-full rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-7 h-11 w-full rounded-xl bg-slate-200" />
          </>
        ) : (
          <>
            <h2 className="font-extrabold">Sugestões por status</h2>
            <p className="mt-1 text-xs text-slate-500">Visão atual da fila de moderação.</p>
            <div className="mt-7 grid gap-5">
              {statusConfig.map(([key, label, color]) => {
                const value = sugestoesPorStatus[key] || 0;
                const percentage = Math.round((value / totalSugestoes) * 100);
                return <div key={key}><div className="mb-2 flex items-center justify-between text-xs"><span className="font-bold text-slate-600">{label}</span><span className="text-slate-400">{value} · {percentage}%</span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><span className={`block h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} /></div></div>;
              })}
            </div>
            <Link href="/admin/sugestoes" className="btn-secondary mt-7 w-full justify-center">Abrir moderação</Link>
          </>
        )}
      </article>
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3">
      <article className="card p-6">
        <div className="flex justify-between"><h2 className="font-extrabold">Campanhas recentes</h2><Link href="/admin/campanhas" className="text-xs font-bold text-blue-600">Ver todas</Link></div>
        <div className="mt-5 grid gap-3">
          {!data && Array.from({ length: 4 }).map((_, index) => <div className="flex items-center gap-3 border-b pb-3 last:border-0" key={index}><Skeleton className="h-10 w-10 rounded-xl bg-slate-200" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-40 bg-slate-200" /><Skeleton className="h-3 w-28 bg-slate-200" /></div><Skeleton className="h-6 w-20 rounded-full bg-slate-200" /></div>)}
          {data && data.campanhas_recentes.length === 0 && <p className="text-sm text-slate-500">Nenhuma campanha cadastrada.</p>}
          {data?.campanhas_recentes.map(item => <div key={item.id} className="flex items-center border-b pb-3 text-sm last:border-0"><strong>{item.titulo}</strong><span className="status ml-auto bg-slate-100 text-slate-600">{item.status}</span></div>)}
        </div>
      </article>
      <article className="card p-6">
        <div className="flex justify-between"><h2 className="font-extrabold">Sugestões recentes</h2><Link href="/admin/sugestoes" className="text-xs font-bold text-blue-600">Moderar</Link></div>
        <div className="mt-5 grid gap-3">
          {!data && Array.from({ length: 4 }).map((_, index) => <div className="border-b pb-3 last:border-0" key={index}><Skeleton className="h-4 w-36 bg-slate-200" /><Skeleton className="mt-2 h-3 w-48 bg-slate-200" /></div>)}
          {data && data.sugestoes_recentes.length === 0 && <p className="text-sm text-slate-500">Nenhuma sugestão recebida.</p>}
          {data?.sugestoes_recentes.map(item => <div key={item.id} className="border-b pb-3 text-sm last:border-0"><strong>{item.nome}</strong><p className="text-xs text-slate-500">{item.assunto}</p></div>)}
        </div>
      </article>
      <article className="card p-6">
        <div className="flex justify-between"><h2 className="font-extrabold">Mensagens recentes</h2><Link href="/admin/mensagens" className="text-xs font-bold text-blue-600">Abrir caixa</Link></div>
        <div className="mt-5 grid gap-3">
          {!data && Array.from({ length: 4 }).map((_, index) => <div className="flex items-center gap-3 border-b pb-3 last:border-0" key={index}><div className="flex-1 space-y-2"><Skeleton className="h-4 w-32 bg-slate-200" /><Skeleton className="h-3 w-44 bg-slate-200" /></div><Skeleton className="h-2 w-2 rounded-full bg-slate-200" /></div>)}
          {data && data.mensagens_recentes.length === 0 && <p className="text-sm text-slate-500">Nenhuma mensagem recebida.</p>}
          {data?.mensagens_recentes.map(item => <div key={item.id} className="flex items-center border-b pb-3 text-sm last:border-0"><div><strong>{item.nome}</strong><p className="text-xs text-slate-500">{item.assunto}</p></div>{!item.lida && <span className="ml-auto h-2 w-2 rounded-full bg-blue-500" />}</div>)}
        </div>
      </article>
    </div>
    <div className="card mt-5 p-6">
      <h2 className="font-extrabold">Atalhos rápidos</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        {!data && Array.from({ length: 6 }).map((_, index) => <Skeleton className="h-11 w-28 rounded-xl bg-slate-200" key={index} />)}
        {data && [['Campanhas','/admin/campanhas'],['Notícias','/admin/noticias'],['Páginas','/admin/paginas'],['Sugestões','/admin/sugestoes'],['Mensagens','/admin/mensagens'],['Telefones','/admin/telefones']].map(([label, href]) => <Link className="btn-secondary" href={href} key={href}>{label}</Link>)}
      </div>
    </div>
  </AdminLayout>;
}
