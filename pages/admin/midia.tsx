import { ChangeEvent, useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Icon from '../../components/Icon';
import { getStorageBaseUrl } from '../../lib/api-base';
import api, { apiError } from '../../lib/api';

type Midia = { id: number; nome_original: string; arquivo: string; mime_type: string; tamanho: number; alt_text?: string };

export default function MidiaPage() {
  const [items, setItems] = useState<Midia[]>([]);
  const [message, setMessage] = useState('');
  const input = useRef<HTMLInputElement>(null);

  async function load() {
    try { const { data } = await api.get('/admin/midias'); setItems(data.data || []); }
    catch (error) { setMessage(apiError(error)); }
  }
  useEffect(() => { void load(); }, []);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('arquivo', file);
    try {
      await api.post('/admin/midias', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Imagem enviada com sucesso.');
      await load();
    } catch (error) { setMessage(apiError(error)); }
    event.target.value = '';
  }

  async function remove(item: Midia) {
    if (!window.confirm(`Excluir ${item.nome_original}?`)) return;
    try { await api.delete(`/admin/midias/${item.id}`); await load(); }
    catch (error) { setMessage(apiError(error)); }
  }

  const storageBase = getStorageBaseUrl();
  return <AdminLayout title="Biblioteca de Mídia" action={<><input ref={input} className="hidden" type="file" accept="image/*" onChange={upload} /><button className="btn-primary" onClick={() => input.current?.click()}><Icon name="plus" />Enviar imagem</button></>}>
    {message && <p className="mb-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">{message}</p>}
    <div className="card p-6"><div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {items.length === 0 && <p className="col-span-full py-10 text-center text-sm text-slate-500">Nenhuma imagem enviada.</p>}
      {items.map(item => <article key={item.id} className="overflow-hidden rounded-xl border"><img src={`${storageBase}${item.arquivo}`} alt={item.alt_text || item.nome_original} className="h-36 w-full object-cover" /><div className="flex items-center gap-2 p-3"><div className="min-w-0"><strong className="block truncate text-xs">{item.nome_original}</strong><p className="mt-1 text-[10px] text-slate-400">{Math.round(item.tamanho / 1024)} KB</p></div><button aria-label="Excluir" onClick={() => remove(item)} className="ml-auto text-rose-500"><Icon name="trash" size={16} /></button></div></article>)}
    </div></div>
  </AdminLayout>;
}
