import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Brand from '../../components/Brand';
import { useAdminFeedback } from '../../components/AdminFeedback';
import Icon from '../../components/Icon';
import api, { apiError } from '../../lib/api';

export default function EsqueciSenha() {
  const [loading, setLoading] = useState(false);
  const feedback = useAdminFeedback();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post('/esqueci-senha', Object.fromEntries(new FormData(event.currentTarget)));
      feedback.success('Enviamos as instruções para redefinição de senha.');
    } catch (requestError) {
      feedback.error(apiError(requestError, 'Não foi possível solicitar a redefinição de senha.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-[#071e41] via-[#0b3c7c] to-blue-600 p-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex justify-center"><Brand /></div>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-extrabold">Recuperar senha</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Informe o e-mail administrativo. Enviaremos um link temporário para criar uma nova senha.</p>
        </div>
        <form className="mt-8 grid gap-4" onSubmit={submit}>
          <label className="text-sm font-bold">E-mail<input className="form-input mt-2" name="email" type="email" autoComplete="email" required /></label>
          <button className="btn-primary mt-2 justify-center disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={loading}><span className="inline-flex h-4 w-4 items-center justify-center">{loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Icon name="email" size={16} />}</span>{loading ? 'Enviando...' : 'Enviar instruções'}</button>
        </form>
        <Link href="/admin/login" className="mt-6 block text-center text-sm font-bold text-blue-600">Voltar ao login</Link>
      </div>
    </main>
  );
}
