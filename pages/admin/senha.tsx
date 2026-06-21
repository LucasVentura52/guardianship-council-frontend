import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import Icon from '../../components/Icon';
import api, { apiError } from '../../lib/api';

export default function Senha() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const { data } = await api.put('/admin/senha', Object.fromEntries(new FormData(event.currentTarget)));
      setMessage(data.message);
      localStorage.removeItem('admin_token');
      window.setTimeout(() => void router.push('/admin/login'), 1800);
    } catch (requestError) {
      setError(apiError(requestError, 'Não foi possível alterar a senha.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout title="Minha senha">
      <form onSubmit={submit} className="card max-w-2xl p-7">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon name="shield" size={25} /></span>
          <div><h2 className="text-lg font-extrabold">Alterar senha de acesso</h2><p className="mt-1 text-sm leading-6 text-slate-500">Por segurança, todas as sessões serão encerradas depois da alteração.</p></div>
        </div>
        <div className="mt-7 grid gap-4">
          <label className="text-sm font-bold">Senha atual<input className="form-input mt-2" name="current_password" type="password" autoComplete="current-password" required /></label>
          <label className="text-sm font-bold">Nova senha<input className="form-input mt-2" name="password" type="password" minLength={8} autoComplete="new-password" required /></label>
          <label className="text-sm font-bold">Confirmar nova senha<input className="form-input mt-2" name="password_confirmation" type="password" minLength={8} autoComplete="new-password" required /></label>
        </div>
        <p className="mt-4 text-xs text-slate-500">A nova senha deve ter ao menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.</p>
        {message && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <button className="btn-primary mt-6 disabled:opacity-60" type="submit" disabled={loading}><Icon name="check" />{loading ? 'Alterando...' : 'Alterar senha'}</button>
      </form>
    </AdminLayout>
  );
}
