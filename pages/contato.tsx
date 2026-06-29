import { FormEvent, useEffect, useState } from 'react';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import PublicLayout from '../components/PublicLayout';
import { Skeleton } from '../components/Skeleton';
import api, { apiError } from '../lib/api';
import { fetchInstitutionalPage, InstitutionalPageData } from '../lib/institutional';
import { useSiteConfig } from '../lib/site-config';

const fallbackPage: InstitutionalPageData = {
  id: 0,
  titulo: 'Contato',
  slug: 'contato',
  resumo: 'Use este canal para dúvidas, orientações e propostas de parceria. Em emergências, ligue 190.',
  icone: 'email',
  conteudo: '',
};

export default function Contato() {
  const config = useSiteConfig();
  const [pagina, setPagina] = useState<InstitutionalPageData>(fallbackPage);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setPageLoading(true);
    fetchInstitutionalPage('contato')
      .then((data) => {
        if (!active) return;
        setPagina(data);
        setPageError('');
      })
      .catch(() => {
        if (!active) return;
        setPageError('Não foi possível carregar os dados da página agora.');
      })
      .finally(() => {
        if (active) setPageLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setError(false);
    setLoading(true);
    const form = event.currentTarget;

    try {
      await api.post('/contato', Object.fromEntries(new FormData(form)));
      setStatus('Mensagem enviada com sucesso. A equipe retornará pelos canais informados.');
      form.reset();
    } catch (requestError) {
      setError(true);
      setStatus(apiError(requestError, 'Não foi possível enviar a mensagem agora.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout title={pagina.titulo}>
      <PageHero eyebrow={pagina.chamada || undefined} title={pagina.titulo} description={pagina.resumo} icon={pagina.icone || 'email'} />
      <section className="container-app grid gap-8 py-16 lg:grid-cols-[1.08fr_.92fr]">
        <form onSubmit={enviar} className="card p-7 sm:p-8">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon name="email" size={24} /></span>
          <h2 className="mt-5 text-xl font-extrabold">Envie uma mensagem</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{pagina.resumo}</p>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-bold text-slate-700">Nome completo<input required name="nome" className="form-input mt-2" placeholder="Seu nome" /></label>
            <label className="text-sm font-bold text-slate-700">E-mail<input required name="email" type="email" className="form-input mt-2" placeholder="voce@exemplo.com" /></label>
            <label className="text-sm font-bold text-slate-700">Telefone <span className="font-normal text-slate-400">(opcional)</span><input name="telefone" className="form-input mt-2" placeholder="(00) 00000-0000" /></label>
            <label className="text-sm font-bold text-slate-700">Assunto<input required name="assunto" className="form-input mt-2" placeholder="Sobre o que deseja falar?" /></label>
            <label className="text-sm font-bold text-slate-700 sm:col-span-2">Mensagem<textarea required name="mensagem" className="form-input mt-2 min-h-44 resize-y" placeholder="Descreva como podemos ajudar" /></label>
          </div>
          {pageError && <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{pageError}</p>}
          {status && <p role="status" className={`mt-5 rounded-xl p-4 text-sm ${error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>{status}</p>}
          <button className="btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={loading}><Icon name="email" />{loading ? 'Enviando...' : 'Enviar mensagem'}</button>
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-400"><Icon name="shield" size={14} />Seus dados são acessíveis somente à equipe administrativa.</p>
        </form>
        <aside className="grid content-start gap-5">
          <div className="card p-7">
            <p className="section-kicker">Atendimento local</p>
            <h2 className="mt-2 text-xl font-extrabold">{config.nome_site || 'Conselho Tutelar'}</h2>
            <div className="mt-6 grid gap-5 text-sm text-slate-600">
              {pageLoading ? (
                <>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-2/3" />
                </>
              ) : (
                <>
                  <span className="flex gap-3"><Icon name="location" className="shrink-0 text-blue-600" /><span>{config.endereco || 'Endereço não cadastrado'}{config.cidade_uf && <><br />{config.cidade_uf}</>}</span></span>
                  <a href={config.telefone ? `tel:${config.telefone}` : undefined} className="flex gap-3 font-semibold text-blue-700"><Icon name="phone" className="shrink-0" />{config.telefone || 'Telefone não cadastrado'}</a>
                  <a href={config.email ? `mailto:${config.email}` : undefined} className="flex gap-3 break-all font-semibold text-blue-700"><Icon name="email" className="shrink-0" />{config.email || 'E-mail não cadastrado'}</a>
                  <span className="flex gap-3"><Icon name="clock" className="shrink-0 text-blue-600" />{config.horario_atendimento || 'Horário não cadastrado'}</span>
                </>
              )}
            </div>
            <div className="map-pattern relative mt-7 h-44 overflow-hidden rounded-2xl"><Icon name="location" size={38} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-500" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <a href="tel:100" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 transition hover:-translate-y-0.5 hover:shadow-md"><Icon name="phone" className="text-emerald-600" /><h2 className="mt-4 font-extrabold text-emerald-900">Disque 100</h2><p className="mt-2 text-xs leading-6 text-emerald-800">{config.disque_100_texto || 'Atendimento gratuito, confidencial e disponível 24 horas.'}</p></a>
            <a href="tel:190" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 transition hover:-translate-y-0.5 hover:shadow-md"><Icon name="shield" className="text-rose-600" /><h2 className="mt-4 font-extrabold text-rose-900">Risco imediato</h2><p className="mt-2 text-xs leading-6 text-rose-800">{config.emergencia_texto || 'Em perigo imediato ou violência em andamento, ligue para a Polícia Militar pelo 190.'}</p></a>
          </div>
        </aside>
      </section>
    </PublicLayout>
  );
}
