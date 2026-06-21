import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Icon from '../../components/Icon';
import api, { apiError } from '../../lib/api';

type Mensagem = { id: number; nome: string; email: string; telefone?: string; assunto: string; mensagem: string; lida: boolean; created_at: string };

export default function Mensagens() {
  const [items, setItems] = useState<Mensagem[]>([]);
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<Mensagem | null>(null);

  async function load() {
    try { const { data } = await api.get('/admin/mensagens'); setItems(data.data || []); }
    catch (error) { setMessage(apiError(error)); }
  }
  useEffect(() => { void load(); }, []);

  async function read(item: Mensagem) {
    try {
      if (!item.lida) await api.put(`/admin/mensagens/${item.id}/marcar-como-lida`);
      setSelected({ ...item, lida: true });
      await load();
    } catch (error) { setMessage(apiError(error)); }
  }
  async function remove(item: Mensagem) {
    if (!window.confirm(`Excluir a mensagem de ${item.nome}?`)) return;
    try { await api.delete(`/admin/mensagens/${item.id}`); await load(); }
    catch (error) { setMessage(apiError(error)); }
  }

  return <AdminLayout title="Mensagens">
    {message && <p className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{message}</p>}
    <div className="card overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-6 py-4">Remetente</th><th className="px-6 py-4">Assunto</th><th className="px-6 py-4">Data</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Ações</th></tr></thead><tbody>
      {items.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Nenhuma mensagem recebida.</td></tr>}
      {items.map(item => <tr className="border-b last:border-0" key={item.id}><td className="px-6 py-4"><strong className="block">{item.nome}</strong><small className="text-slate-400">{item.email}</small></td><td className="px-6 py-4">{item.assunto}</td><td className="px-6 py-4 text-slate-500">{new Date(item.created_at).toLocaleDateString('pt-BR')}</td><td className="px-6 py-4"><span className={`status ${item.lida ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-700'}`}>{item.lida ? 'Lida' : 'Nova'}</span></td><td className="px-6 py-4"><div className="flex justify-end gap-2"><button aria-label="Ler" onClick={() => read(item)} className="grid h-9 w-9 place-items-center rounded-lg border text-blue-600"><Icon name="eye" size={16} /></button><button aria-label="Excluir" onClick={() => remove(item)} className="grid h-9 w-9 place-items-center rounded-lg border text-rose-500"><Icon name="trash" size={16} /></button></div></td></tr>)}
    </tbody></table></div>
    {selected && <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/55 p-5" role="dialog" aria-modal="true" aria-labelledby="titulo-mensagem">
      <section className="my-8 w-full max-w-2xl rounded-2xl bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4"><div><span className="status bg-blue-50 text-blue-700">Mensagem recebida</span><h2 id="titulo-mensagem" className="mt-3 text-xl font-extrabold">{selected.assunto}</h2></div><button type="button" aria-label="Fechar" className="text-2xl text-slate-400" onClick={() => setSelected(null)}>×</button></div>
        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm"><strong>{selected.nome}</strong><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-slate-500"><a className="font-semibold text-blue-600" href={`mailto:${selected.email}`}>{selected.email}</a>{selected.telefone && <a className="font-semibold text-blue-600" href={`tel:${selected.telefone}`}>{selected.telefone}</a>}<span>{new Date(selected.created_at).toLocaleString('pt-BR')}</span></div></div>
        <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-700">{selected.mensagem}</p>
        <div className="mt-7 flex flex-wrap justify-end gap-3"><button className="btn-secondary" type="button" onClick={() => setSelected(null)}>Fechar</button><a className="btn-primary" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.assunto}`)}`}><Icon name="email" />Responder por e-mail</a></div>
      </section>
    </div>}
  </AdminLayout>;
}
