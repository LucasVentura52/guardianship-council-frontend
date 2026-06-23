import { ChangeEvent, useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAdminFeedback } from '../../components/AdminFeedback';
import Icon from '../../components/Icon';
import { Skeleton } from '../../components/Skeleton';
import { resolvePublicImageUrl } from '../../lib/image-url';
import api, { apiError } from '../../lib/api';

type Midia = { id: number; nome_original: string; arquivo: string; mime_type: string; tamanho: number; alt_text?: string };

export default function MidiaPage() {
  const [items, setItems] = useState<Midia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const input = useRef<HTMLInputElement>(null);
  const feedback = useAdminFeedback();

  async function load() {
    setLoading(true);
    try { const { data } = await api.get('/admin/midias'); setItems(data.data || []); }
    catch (error) { feedback.error(apiError(error)); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('arquivo', file);
    setUploading(true);
    try {
      await api.post('/admin/midias', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      feedback.success('Imagem enviada com sucesso.');
      await load();
    } catch (error) { feedback.error(apiError(error)); }
    finally { setUploading(false); }
    event.target.value = '';
  }

  async function remove(item: Midia) {
    if (!window.confirm(`Excluir ${item.nome_original}?`)) return;
    try { await api.delete(`/admin/midias/${item.id}`); feedback.success('Imagem excluída com sucesso.'); await load(); }
    catch (error) { feedback.error(apiError(error)); }
  }

  return <AdminLayout title="Biblioteca de Mídia" action={<><input ref={input} className="hidden" type="file" accept="image/*" onChange={upload} /><button className="btn-primary disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => input.current?.click()} disabled={uploading}><span className="inline-flex h-4 w-4 items-center justify-center">{uploading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Icon name="plus" size={16} />}</span>{uploading ? 'Enviando...' : 'Enviar imagem'}</button></>}>
    <div className="card p-6"><div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {loading && Array.from({ length: 8 }).map((_, index) => <article key={index} className="overflow-hidden rounded-xl border bg-white"><Skeleton className="h-36 w-full rounded-none bg-slate-200" /><div className="flex items-center gap-2 p-3"><div className="min-w-0 flex-1"><Skeleton className="h-3 w-4/5 bg-slate-200" /><Skeleton className="mt-2 h-2.5 w-1/3 bg-slate-200" /></div><Skeleton className="h-4 w-4 rounded bg-slate-200" /></div></article>)}
      {!loading && items.length === 0 && <p className="col-span-full py-10 text-center text-sm text-slate-500">Nenhuma imagem enviada.</p>}
      {!loading && items.map(item => <article key={item.id} className="overflow-hidden rounded-xl border"><img src={resolvePublicImageUrl(`/storage/${item.arquivo}`)} alt={item.alt_text || item.nome_original} className="h-36 w-full object-cover" /><div className="flex items-center gap-2 p-3"><div className="min-w-0"><strong className="block truncate text-xs">{item.nome_original}</strong><p className="mt-1 text-[10px] text-slate-400">{Math.round(item.tamanho / 1024)} KB</p></div><button aria-label="Excluir" type="button" onClick={() => remove(item)} className="ml-auto text-rose-500"><Icon name="trash" size={16} /></button></div></article>)}
    </div></div>
  </AdminLayout>;
}
