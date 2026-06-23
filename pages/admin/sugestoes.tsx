import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAdminFeedback } from '../../components/AdminFeedback';
import Icon from '../../components/Icon';
import { Skeleton } from '../../components/Skeleton';
import api, { apiError } from '../../lib/api';

type Sugestao = { id: number; nome: string; email: string; telefone?: string; assunto: string; mensagem: string; status: string; resposta_admin?: string; created_at?: string };

export default function Sugestoes() {
  const [items, setItems] = useState<Sugestao[]>([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Sugestao | null>(null);
  const [resposta, setResposta] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const feedback = useAdminFeedback();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/sugestoes', { params: filter ? { status: filter } : {} });
      setItems(data.data || []);
    } catch (error) { feedback.error(apiError(error)); }
    finally { setLoading(false); }
  }, [feedback, filter]);

  useEffect(() => { void load(); }, [load]);

  function review(item: Sugestao) {
    setSelected(item);
    setResposta(item.resposta_admin || '');
  }

  async function moderate(action: 'aprovar' | 'reprovar') {
    if (!selected) return;
    setSaving(true);
    try {
      await api.put(`/admin/sugestoes/${selected.id}/${action}`, action === 'reprovar' ? { resposta_admin: resposta } : {});
      feedback.success(`Sugestão ${action === 'aprovar' ? 'aprovada' : 'reprovada'} com sucesso.`);
      setSelected(null);
      await load();
    } catch (error) { feedback.error(apiError(error)); }
    finally { setSaving(false); }
  }

  return <AdminLayout title="Sugestões da Comunidade">
    <div className="mb-5 flex flex-wrap gap-2">{[
      ['', 'Todas'], ['pendente', 'Pendentes'], ['aprovada', 'Aprovadas'], ['reprovada', 'Reprovadas'],
    ].map(([value, label]) => <button type="button" onClick={() => setFilter(value)} className={`rounded-lg px-4 py-2 text-xs font-bold ${filter === value ? 'bg-blue-600 text-white' : 'border bg-white text-slate-600'}`} key={value}>{label}</button>)}</div>
    <div className="card overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Nome</th><th className="px-5 py-4">Assunto</th><th className="px-5 py-4">Mensagem</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Ações</th></tr></thead><tbody>
      {loading && Array.from({ length: 6 }).map((_, index) => <tr className="border-b last:border-0" key={index}><td className="px-5 py-5"><Skeleton className="h-4 w-32 bg-slate-200" /><Skeleton className="mt-2 h-3 w-40 bg-slate-200" /></td><td className="px-5 py-5"><Skeleton className="h-4 w-48 bg-slate-200" /></td><td className="max-w-sm px-5 py-5"><Skeleton className="h-3 w-full bg-slate-200" /><Skeleton className="mt-2 h-3 w-4/5 bg-slate-200" /></td><td className="px-5 py-5"><Skeleton className="h-6 w-24 rounded-full bg-slate-200" /></td><td className="px-5 py-5"><Skeleton className="h-9 w-9 rounded bg-slate-200" /></td></tr>)}
      {!loading && items.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Nenhuma sugestão encontrada.</td></tr>}
      {!loading && items.map(item => <tr className="border-b last:border-0" key={item.id}><td className="px-5 py-5"><strong className="block">{item.nome}</strong><small className="text-slate-400">{item.email}</small></td><td className="px-5 py-5">{item.assunto}</td><td className="max-w-sm px-5 py-5 text-slate-500"><p className="line-clamp-2">{item.mensagem}</p></td><td className="px-5 py-5"><span className={`status ${item.status === 'aprovada' ? 'bg-emerald-50 text-emerald-700' : item.status === 'reprovada' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{item.status}</span></td><td className="px-5 py-5"><button title="Analisar sugestão" type="button" onClick={() => review(item)} className="grid h-9 w-9 place-items-center rounded border text-blue-600"><Icon name="eye" size={16} /></button></td></tr>)}
    </tbody></table></div>
    {selected && <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/55 p-5" role="dialog" aria-modal="true" aria-labelledby="titulo-sugestao">
      <section className="my-8 w-full max-w-2xl rounded-2xl bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4"><div><span className={`status ${selected.status === 'aprovada' ? 'bg-emerald-50 text-emerald-700' : selected.status === 'reprovada' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{selected.status}</span><h2 id="titulo-sugestao" className="mt-3 text-xl font-extrabold">{selected.assunto}</h2></div><button type="button" aria-label="Fechar" className="text-2xl text-slate-400" onClick={() => setSelected(null)}>×</button></div>
        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm"><strong>{selected.nome}</strong><p className="mt-1 text-slate-500">{selected.email}{selected.telefone ? ` · ${selected.telefone}` : ''}{selected.created_at ? ` · ${new Date(selected.created_at).toLocaleDateString('pt-BR')}` : ''}</p></div>
        <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-700">{selected.mensagem}</p>
        <label className="mt-6 block text-sm font-bold">Resposta interna / motivo da reprovação<textarea className="form-input mt-2 min-h-24" value={resposta} onChange={event => setResposta(event.target.value)} maxLength={2000} placeholder="Opcional. Registre uma observação para a equipe." /></label>
        <div className="mt-7 flex flex-wrap justify-end gap-3"><button className="btn-secondary" type="button" onClick={() => setSelected(null)}>Cancelar</button><button className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60" type="button" disabled={saving} onClick={() => moderate('reprovar')}><span className="inline-flex h-4 w-4 items-center justify-center">{saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : null}</span>{saving ? 'Processando...' : 'Reprovar'}</button><button className="btn-primary disabled:cursor-not-allowed disabled:opacity-60" type="button" disabled={saving} onClick={() => moderate('aprovar')}><span className="inline-flex h-4 w-4 items-center justify-center">{saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Icon name="check" size={16} />}</span>{saving ? 'Processando...' : 'Aprovar'}</button></div>
      </section>
    </div>}
  </AdminLayout>;
}
