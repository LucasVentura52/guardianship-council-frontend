import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Brand from '../../components/Brand';
import Icon from '../../components/Icon';
import api, { apiError } from '../../lib/api';

export default function Login() {
  const router = useRouter();
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro('');
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const { data } = await api.post('/login', Object.fromEntries(form));
      localStorage.setItem('admin_token', data.token);
      await router.push('/admin');
    } catch (error) {
      setErro(apiError(error, 'Credenciais inválidas ou API indisponível.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-[#071e41] via-[#0b3c7c] to-blue-600 p-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex justify-center"><Brand /></div>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-extrabold">Painel Administrativo</h1>
          <p className="mt-2 text-sm text-slate-500">Entre com suas credenciais para continuar.</p>
        </div>
        <form className="mt-8 grid gap-4" onSubmit={entrar}>
          <label className="text-sm font-bold">E-mail<input className="form-input mt-2" name="email" type="email" defaultValue="admin@conselhotutelar.local" required /></label>
          <label className="text-sm font-bold">Senha<input className="form-input mt-2" name="password" type="password" defaultValue="Admin1234" required /></label>
          {erro && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{erro}</p>}
          <button className="btn-primary mt-2 justify-center disabled:opacity-60" type="submit" disabled={loading}><Icon name="logout" /> {loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">Acesso restrito a administradores autorizados.</p>
      </div>
    </main>
  );
}
