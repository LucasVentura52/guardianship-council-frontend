import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Icon from '../../components/Icon';
import api, { apiError } from '../../lib/api';

type Mensagem = { id: number; nome: string; email: string; telefone?: string; assunto: string; mensagem: string; lida: boolean; created_at: string };

export default function Mensagens() {
  const [items, setItems] = useState<Mensagem[]>([]);
  const [message, setMessage] = useState('');

  async function load() {
    try { const { data } = await api.get('/admin/mensagens'); setItems(data.data || []); }
    catch (error) { setMessage(apiError(error)); }
  }
  useEffect(() => { void load(); }, []);

  async function read(item: Mensagem) {
    if (!item.lida) await api.put(`/admin/mensagens/${item.id}/marcar-como-lida`);
    window.alert(`${item.nome} (${item.email})\n\n${item.mensagem}`);
    await load();
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
  </AdminLayout>;
}
