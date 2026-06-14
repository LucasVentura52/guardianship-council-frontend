import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Icon from '../../components/Icon';
import api, { apiError } from '../../lib/api';

type Sugestao = { id: number; nome: string; email: string; assunto: string; mensagem: string; status: string };

export default function Sugestoes() {
  const [items, setItems] = useState<Sugestao[]>([]);
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/sugestoes', { params: filter ? { status: filter } : {} });
      setItems(data.data || []);
    } catch (error) { setMessage(apiError(error)); }
  }, [filter]);

  useEffect(() => { void load(); }, [load]);

  async function moderate(id: number, action: 'aprovar' | 'reprovar') {
    try {
      await api.put(`/admin/sugestoes/${id}/${action}`);
      setMessage(`Sugestão ${action === 'aprovar' ? 'aprovada' : 'reprovada'} com sucesso.`);
      await load();
    } catch (error) { setMessage(apiError(error)); }
  }

  return <AdminLayout title="Sugestões da Comunidade">
    {message && <p className="mb-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">{message}</p>}
    <div className="mb-5 flex flex-wrap gap-2">{[
      ['', 'Todas'], ['pendente', 'Pendentes'], ['aprovada', 'Aprovadas'], ['reprovada', 'Reprovadas'],
    ].map(([value, label]) => <button onClick={() => setFilter(value)} className={`rounded-lg px-4 py-2 text-xs font-bold ${filter === value ? 'bg-blue-600 text-white' : 'border bg-white text-slate-600'}`} key={value}>{label}</button>)}</div>
    <div className="card overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Nome</th><th className="px-5 py-4">Assunto</th><th className="px-5 py-4">Mensagem</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Ações</th></tr></thead><tbody>
      {items.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Nenhuma sugestão encontrada.</td></tr>}
      {items.map(item => <tr className="border-b last:border-0" key={item.id}><td className="px-5 py-5"><strong className="block">{item.nome}</strong><small className="text-slate-400">{item.email}</small></td><td className="px-5 py-5">{item.assunto}</td><td className="max-w-sm px-5 py-5 text-slate-500">{item.mensagem}</td><td className="px-5 py-5"><span className={`status ${item.status === 'aprovada' ? 'bg-emerald-50 text-emerald-700' : item.status === 'reprovada' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{item.status}</span></td><td className="px-5 py-5"><div className="flex gap-2"><button title="Aprovar" onClick={() => moderate(item.id, 'aprovar')} className="grid h-9 w-9 place-items-center rounded border text-emerald-600"><Icon name="check" size={15} /></button><button title="Reprovar" onClick={() => moderate(item.id, 'reprovar')} className="grid h-9 w-9 place-items-center rounded border text-rose-500">×</button></div></td></tr>)}
    </tbody></table></div>
  </AdminLayout>;
}
