import { FormEvent, useCallback, useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { useAdminFeedback } from './AdminFeedback';
import Icon from './Icon';
import { Skeleton } from './Skeleton';
import api, { apiError } from '../lib/api';

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'date' | 'checkbox' | 'file';
  required?: boolean;
  options?: { value: string; label: string }[];
};

type Item = Record<string, any> & { id: number };

function fieldValue(item: Item | null, field: Field) {
  const value = item?.[field.name] || '';
  return field.type === 'date' && value ? String(value).slice(0, 10) : value;
}

export default function AdminResourcePage({
  title,
  endpoint,
  fields,
  descriptionField,
}: {
  title: string;
  endpoint: string;
  fields: Field[];
  descriptionField: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const feedback = useAdminFeedback();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/${endpoint}`);
      setItems(data.data || []);
    } catch (error) {
      feedback.error(apiError(error, `Não foi possível carregar ${title.toLowerCase()}.`));
    } finally {
      setLoading(false);
    }
  }, [endpoint, feedback, title]);

  useEffect(() => { void load(); }, [load]);

  function showForm(item: Item | null = null) {
    setEditing(item);
    setOpen(true);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    form.set('destaque', form.get('destaque') ? '1' : '0');
    setSaving(true);

    try {
      if (editing) {
        form.set('_method', 'PUT');
        await api.post(`/admin/${endpoint}/${editing.id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post(`/admin/${endpoint}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setOpen(false);
      feedback.success('Alterações salvas com sucesso.');
      await load();
    } catch (error) {
      feedback.error(apiError(error));
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Item) {
    if (!window.confirm(`Excluir "${item.titulo}"?`)) return;
    try {
      await api.delete(`/admin/${endpoint}/${item.id}`);
      feedback.success('Registro excluído com sucesso.');
      await load();
    } catch (error) {
      feedback.error(apiError(error));
    }
  }

  return (
    <AdminLayout
      title={title}
      action={<button className="btn-primary" type="button" onClick={() => showForm()}><Icon name="plus" />Novo registro</button>}
    >
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-6 py-4">Conteúdo</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Atualização</th><th className="px-6 py-4 text-right">Ações</th></tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 5 }).map((_, index) => (
              <tr className="border-b border-slate-100 last:border-0" key={index}>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="mt-3 h-3 w-[85%]" />
                </td>
                <td className="px-6 py-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                <td className="px-6 py-4"><div className="flex justify-end gap-2"><Skeleton className="h-9 w-9 rounded-lg" /><Skeleton className="h-9 w-9 rounded-lg" /></div></td>
              </tr>
            ))}
            {!loading && items.length === 0 && <tr><td className="px-6 py-10 text-center text-slate-500" colSpan={4}>Nenhum registro encontrado.</td></tr>}
            {!loading && items.map((item) => (
              <tr className="border-b border-slate-100 last:border-0" key={item.id}>
                <td className="px-6 py-4"><strong className="block">{item.titulo}</strong><small className="mt-1 block max-w-xl truncate text-slate-500">{item[descriptionField] || 'Sem descrição'}</small></td>
                <td className="px-6 py-4"><span className={`status ${item.status === 'publicado' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{item.status}</span></td>
                <td className="px-6 py-4 text-slate-500">{new Date(item.updated_at || item.created_at || Date.now()).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4"><div className="flex justify-end gap-2"><button aria-label="Editar" type="button" className="grid h-9 w-9 place-items-center rounded-lg border text-slate-500" onClick={() => showForm(item)}><Icon name="edit" size={16} /></button><button aria-label="Excluir" type="button" className="grid h-9 w-9 place-items-center rounded-lg border text-rose-500" onClick={() => remove(item)}><Icon name="trash" size={16} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/55 p-5" role="dialog" aria-modal="true">
          <form className="my-8 w-full max-w-2xl rounded-2xl bg-white p-7 shadow-2xl" onSubmit={save}>
            <div className="flex items-center justify-between"><h2 className="text-xl font-extrabold">{editing ? 'Editar registro' : 'Novo registro'}</h2><button type="button" className="text-2xl text-slate-400" onClick={() => setOpen(false)}>×</button></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label className={`text-sm font-bold ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`} key={field.name}>
                  {field.type === 'checkbox' ? (
                    <span className="flex items-center gap-3"><input type="checkbox" name={field.name} defaultChecked={Boolean(editing?.[field.name])} />{field.label}</span>
                  ) : <>
                    {field.label}
                    {field.type === 'textarea' ? <textarea className="form-input mt-2 min-h-32" name={field.name} defaultValue={editing?.[field.name] || ''} required={field.required} /> :
                      field.type === 'select' ? <select className="form-input mt-2" name={field.name} defaultValue={editing?.[field.name] || field.options?.[0]?.value}>{field.options?.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}</select> :
                        <input className="form-input mt-2" type={field.type || 'text'} name={field.name} defaultValue={field.type === 'file' ? undefined : fieldValue(editing, field)} required={field.required && field.type !== 'file'} />}
                  </>}
                </label>
              ))}
            </div>
            <div className="mt-7 flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancelar</button><button className="btn-primary disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={saving}><span className="inline-flex h-4 w-4 items-center justify-center">{saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Icon name="check" size={16} />}</span>{saving ? 'Salvando...' : 'Salvar'}</button></div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
