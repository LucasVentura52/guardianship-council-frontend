import { FormEvent, useState } from 'react';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import PublicLayout from '../components/PublicLayout';
import api, { apiError } from '../lib/api';
import { institutionalPageProps, InstitutionalPageData } from '../lib/institutional';
import { useSiteConfig } from '../lib/site-config';

export default function Contato({ pagina }: { pagina: InstitutionalPageData }) {
  const config = useSiteConfig();
  const [status, setStatus] = useState('');

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Enviando...');
    const form = event.currentTarget;
    try {
      await api.post('/contato', Object.fromEntries(new FormData(form)));
      setStatus('Mensagem enviada com sucesso.');
      form.reset();
    } catch (error) {
      setStatus(apiError(error, 'Não foi possível enviar a mensagem agora.'));
    }
  }

  return <PublicLayout title={pagina.titulo}>
    <PageHero eyebrow={pagina.chamada || undefined} title={pagina.titulo} description={pagina.resumo} icon={pagina.icone || 'email'} />
    <section className="container-app grid gap-8 py-14 lg:grid-cols-[1.1fr_.9fr]">
      <form onSubmit={enviar} className="card p-7"><h2 className="text-xl font-extrabold">Envie uma mensagem</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><input required name="nome" className="form-input" placeholder="Nome completo" /><input required name="email" type="email" className="form-input" placeholder="E-mail" /><input name="telefone" className="form-input" placeholder="Telefone" /><input required name="assunto" className="form-input" placeholder="Assunto" /><textarea required name="mensagem" className="form-input min-h-40 sm:col-span-2" placeholder="Como podemos ajudar?" /></div><button className="btn-primary mt-5"><Icon name="email" /> Enviar mensagem</button>{status && <p className="mt-4 text-sm text-blue-700">{status}</p>}</form>
      <aside className="grid gap-4">
        <div className="card p-6"><h2 className="font-extrabold">{config.nome_site || 'Conselho Tutelar'}</h2><div className="mt-5 grid gap-4 text-sm text-slate-600"><span className="flex gap-3"><Icon name="location" className="shrink-0 text-blue-600" /><span>{config.endereco || 'Endereço não cadastrado'}{config.cidade_uf && <><br />{config.cidade_uf}</>}</span></span><span className="flex gap-3"><Icon name="phone" className="text-blue-600" />{config.telefone || 'Telefone não cadastrado'}</span><span className="flex gap-3"><Icon name="email" className="text-blue-600" />{config.email || 'E-mail não cadastrado'}</span><span className="flex gap-3"><Icon name="clock" className="text-blue-600" />{config.horario_atendimento || 'Horário não cadastrado'}</span></div></div>
        <div className="rounded-2xl bg-emerald-50 p-6"><h2 className="font-extrabold text-emerald-900">Denúncia nacional</h2><p className="mt-2 text-sm leading-6 text-emerald-800">{config.disque_100_texto || 'Disque 100. Atendimento gratuito, confidencial e disponível 24 horas.'}</p></div>
        <div className="rounded-2xl bg-rose-50 p-6"><h2 className="font-extrabold text-rose-900">Risco imediato</h2><p className="mt-2 text-sm leading-6 text-rose-800">{config.emergencia_texto || 'Em uma emergência ou situação de perigo imediato, ligue para a Polícia Militar pelo 190.'}</p></div>
      </aside>
    </section>
  </PublicLayout>;
}

export const getServerSideProps = institutionalPageProps('contato');
