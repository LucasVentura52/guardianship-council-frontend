import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Brand from '../../components/Brand';
import { useAdminFeedback } from '../../components/AdminFeedback';
import Icon from '../../components/Icon';
import api, { apiError } from '../../lib/api';

export default function RedefinirSenha() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const feedback = useAdminFeedback();
  const token = typeof router.query.token === 'string' ? router.query.token : '';
  const email = typeof router.query.email === 'string' ? router.query.email : '';
  const invalidLink = router.isReady && (!token || !email);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const form = Object.fromEntries(new FormData(event.currentTarget));
      await api.post('/redefinir-senha', { ...form, token, email });
      feedback.success('Senha redefinida com sucesso.');
      window.setTimeout(() => void router.push('/admin/login'), 1800);
    } catch (requestError) {
      feedback.error(apiError(requestError, 'Não foi possível redefinir a senha.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-[#071e41] via-[#0b3c7c] to-blue-600 p-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex justify-center"><Brand /></div>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-extrabold">Criar nova senha</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Use ao menos 8 caracteres, com letras maiúsculas, minúsculas e números.</p>
        </div>
        {invalidLink ? (
          <div className="mt-8">
            <p className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">Este link está incompleto ou inválido.</p>
            <Link href="/admin/esqueci-senha" className="mt-6 block text-center text-sm font-bold text-blue-600">Solicitar outro link</Link>
          </div>
        ) : (
          <form className="mt-8 grid gap-4" onSubmit={submit}>
            <label className="text-sm font-bold">E-mail<input className="form-input mt-2 bg-slate-50" value={email} readOnly /></label>
            <label className="text-sm font-bold">Nova senha<input className="form-input mt-2" name="password" type="password" minLength={8} autoComplete="new-password" required /></label>
            <label className="text-sm font-bold">Confirmar nova senha<input className="form-input mt-2" name="password_confirmation" type="password" minLength={8} autoComplete="new-password" required /></label>
            <button className="btn-primary mt-2 justify-center disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={loading || !router.isReady}><span className="inline-flex h-4 w-4 items-center justify-center">{loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Icon name="check" size={16} />}</span>{loading ? 'Salvando...' : 'Redefinir senha'}</button>
          </form>
        )}
      </div>
    </main>
  );
}
