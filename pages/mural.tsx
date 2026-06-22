import { FormEvent, useEffect, useState } from 'react';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import PublicLayout from '../components/PublicLayout';
import api, { apiError } from '../lib/api';

type Publicacao = { id: number; nome: string; assunto: string; mensagem: string; created_at?: string };

export default function Mural() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);

  useEffect(() => {
    api.get('/sugestoes-aprovadas')
      .then(({ data }) => setPublicacoes(data.data || []))
      .catch(() => setPublicacoes([]));
  }, []);

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setError(false);
    setLoading(true);
    const form = event.currentTarget;

    try {
      await api.post('/sugestoes', Object.fromEntries(new FormData(form)));
      setStatus('Sugestão recebida! Ela será publicada somente após análise da equipe.');
      form.reset();
    } catch (requestError) {
      setError(true);
      setStatus(apiError(requestError, 'Não foi possível enviar a sugestão agora.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout title="Mural da Comunidade">
      <PageHero eyebrow="Sua voz importa" title="Mural da Comunidade" description="Compartilhe ideias e propostas para fortalecer a proteção e a participação comunitária." icon="message" />
      <section className="container-app grid gap-10 py-16 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <form onSubmit={enviar} className="card p-7 sm:p-8">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon name="message" size={24} /></span>
            <h2 className="mt-5 text-xl font-extrabold">Envie uma sugestão</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Os campos de contato são usados apenas pela equipe e não aparecem no mural público.</p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">Nome completo<input required name="nome" className="form-input mt-2" placeholder="Como podemos chamar você?" /></label>
              <label className="text-sm font-bold text-slate-700">E-mail<input required type="email" name="email" className="form-input mt-2" placeholder="voce@exemplo.com" /></label>
              <label className="text-sm font-bold text-slate-700">Telefone <span className="font-normal text-slate-400">(opcional)</span><input name="telefone" className="form-input mt-2" placeholder="(00) 00000-0000" /></label>
              <label className="text-sm font-bold text-slate-700">Assunto<input required name="assunto" className="form-input mt-2" placeholder="Resumo da sua ideia" /></label>
              <label className="text-sm font-bold text-slate-700 sm:col-span-2">Mensagem<textarea required name="mensagem" className="form-input mt-2 min-h-40 resize-y" placeholder="Conte sua sugestão com detalhes" /></label>
            </div>
            {status && <p role="status" className={`mt-5 rounded-xl p-4 text-sm ${error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>{status}</p>}
            <button className="btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={loading}><Icon name="message" />{loading ? 'Enviando...' : 'Enviar sugestão'}</button>
          </form>
          <aside className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-6">
            <h3 className="flex items-center gap-2 font-extrabold text-blue-900"><Icon name="shield" size={19} />Como funciona a moderação?</h3>
            <ol className="mt-4 grid gap-3 text-xs leading-5 text-blue-900/70">
              <li><strong className="text-blue-900">1. Recebimento:</strong> a equipe recebe sua contribuição como pendente.</li>
              <li><strong className="text-blue-900">2. Análise:</strong> o conteúdo é revisado para proteger dados pessoais e manter o propósito do mural.</li>
              <li><strong className="text-blue-900">3. Publicação:</strong> somente nome, assunto e mensagem aprovados ficam visíveis.</li>
            </ol>
          </aside>
        </div>
        <div>
          <div className="flex items-end justify-between gap-4">
            <div><p className="section-kicker">Ideias compartilhadas</p><h2 className="section-title mt-2">Vozes da comunidade</h2></div>
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">{publicacoes.length} publicadas</span>
          </div>
          <div className="mt-7 grid gap-4">
            {publicacoes.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Icon name="message" size={32} className="mx-auto text-slate-300" /><p className="mt-4 text-sm text-slate-500">Ainda não há sugestões aprovadas. Você pode enviar a primeira.</p></div>}
            {publicacoes.map(publicacao => (
              <article className="card p-6 transition hover:border-blue-200 hover:shadow-md" key={publicacao.id}>
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 font-extrabold text-blue-700">{publicacao.nome[0]?.toUpperCase()}</span>
                  <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-extrabold">{publicacao.nome}</h3>{publicacao.created_at && <time className="text-[11px] text-slate-400">{new Date(publicacao.created_at).toLocaleDateString('pt-BR')}</time>}</div><span className="mt-1 block text-xs font-bold text-blue-600">{publicacao.assunto}</span></div>
                </div>
                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">{publicacao.mensagem}</p>
                <span className="status mt-5 items-center gap-1 bg-emerald-50 text-emerald-700"><Icon name="check" size={13} /> Conteúdo aprovado</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
