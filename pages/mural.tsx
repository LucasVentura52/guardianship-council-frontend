import { FormEvent, useEffect, useState } from 'react';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import PublicLayout from '../components/PublicLayout';
import api, { apiError } from '../lib/api';

type Publicacao = { id: number; nome: string; assunto: string; mensagem: string };

export default function Mural() {
  const [status, setStatus] = useState('');
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);

  useEffect(() => {
    api.get('/sugestoes-aprovadas')
      .then(({ data }) => setPublicacoes(data.data || []))
      .catch(() => setPublicacoes([]));
  }, []);

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Enviando...');
    const form = event.currentTarget;
    try {
      await api.post('/sugestoes', Object.fromEntries(new FormData(form)));
      setStatus('Sugestão enviada! Ela será publicada após análise.');
      form.reset();
    } catch (error) {
      setStatus(apiError(error, 'Não foi possível enviar a sugestão agora.'));
    }
  }

  return <PublicLayout title="Mural da Comunidade"><PageHero eyebrow="Sua voz importa" title="Mural da Comunidade" description="Compartilhe ideias, dúvidas e propostas. Sugestões aprovadas ficam disponíveis para toda a comunidade." icon="message" /><section className="container-app grid gap-10 py-14 lg:grid-cols-[.9fr_1.1fr]"><form onSubmit={enviar} className="card p-7"><h2 className="text-xl font-extrabold">Envie uma sugestão</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><input required name="nome" className="form-input" placeholder="Nome" /><input required type="email" name="email" className="form-input" placeholder="E-mail" /><input name="telefone" className="form-input" placeholder="Telefone" /><input required name="assunto" className="form-input" placeholder="Assunto" /><textarea required name="mensagem" className="form-input min-h-36 sm:col-span-2" placeholder="Escreva sua mensagem" /></div><button className="btn-primary mt-5" type="submit"><Icon name="message" /> Enviar sugestão</button>{status && <p className="mt-4 text-sm text-blue-700">{status}</p>}</form><div><h2 className="section-title">Sugestões da comunidade</h2><div className="mt-6 grid gap-4">{publicacoes.length === 0 && <p className="rounded-xl bg-white p-6 text-sm text-slate-500">Ainda não há sugestões aprovadas.</p>}{publicacoes.map(p => <article className="card p-6" key={p.id}><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">{p.nome[0]}</span><div><h3 className="text-sm font-extrabold">{p.nome}</h3><span className="text-xs text-blue-600">{p.assunto}</span></div></div><p className="mt-4 text-sm leading-7 text-slate-600">{p.mensagem}</p><span className="status mt-4 bg-emerald-50 text-emerald-700"><Icon name="check" size={13} /> Aprovada</span></article>)}</div></div></section></PublicLayout>;
}
