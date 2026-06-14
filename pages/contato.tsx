import { FormEvent, useState } from 'react';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import PublicLayout from '../components/PublicLayout';
import api from '../lib/api';

export default function Contato() {
  const [status, setStatus] = useState('');
  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus('Enviando...');
    const form = new FormData(e.currentTarget);
    try { await api.post('/contato', Object.fromEntries(form)); setStatus('Mensagem enviada com sucesso.'); e.currentTarget.reset(); }
    catch { setStatus('Não foi possível acessar a API agora. Verifique se o Laravel está em execução.'); }
  }
  return <PublicLayout title="Contato"><PageHero eyebrow="Estamos aqui para orientar" title="Fale Conosco" description="Envie sua mensagem ou utilize um dos canais de atendimento. Em emergências, procure os serviços de segurança." icon="email" /><section className="container-app grid gap-8 py-14 lg:grid-cols-[1.1fr_.9fr]"><form onSubmit={enviar} className="card p-7"><h2 className="text-xl font-extrabold">Envie uma mensagem</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><input required name="nome" className="form-input" placeholder="Nome completo" /><input required name="email" type="email" className="form-input" placeholder="E-mail" /><input name="telefone" className="form-input" placeholder="Telefone" /><input required name="assunto" className="form-input" placeholder="Assunto" /><textarea required name="mensagem" className="form-input min-h-40 sm:col-span-2" placeholder="Como podemos ajudar?" /></div><button className="btn-primary mt-5"><Icon name="email" /> Enviar mensagem</button>{status && <p className="mt-4 text-sm text-blue-700">{status}</p>}</form><aside className="grid gap-4"><div className="card p-6"><h2 className="font-extrabold">Conselho Tutelar</h2><div className="mt-5 grid gap-4 text-sm text-slate-600"><span className="flex gap-3"><Icon name="location" className="text-blue-600" />Rua das Crianças, 123 - Centro</span><span className="flex gap-3"><Icon name="phone" className="text-blue-600" />(00) 1234-5678</span><span className="flex gap-3"><Icon name="email" className="text-blue-600" />conselho@suacidade.gov.br</span></div></div><div className="rounded-2xl bg-emerald-50 p-6"><h2 className="font-extrabold text-emerald-900">Denúncia nacional</h2><p className="mt-2 text-sm leading-6 text-emerald-800">Disque 100. Atendimento gratuito, confidencial e disponível 24 horas.</p></div><div className="rounded-2xl bg-rose-50 p-6"><h2 className="font-extrabold text-rose-900">Risco imediato</h2><p className="mt-2 text-sm leading-6 text-rose-800">Em uma emergência ou situação de perigo imediato, ligue para a Polícia Militar pelo 190.</p></div></aside></section></PublicLayout>;
}
