import { useState } from 'react';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import PublicLayout from '../components/PublicLayout';

const perguntas = [
  ['O atendimento do Conselho Tutelar é gratuito?', 'Sim. Todo atendimento e orientação prestados pelo Conselho Tutelar são gratuitos.'],
  ['Preciso me identificar para fazer uma denúncia?', 'O Disque 100 aceita denúncias anônimas. No atendimento local, seus dados são tratados com sigilo.'],
  ['O Conselho Tutelar pode retirar uma criança da família?', 'O acolhimento institucional é uma medida excepcional. O Conselho atua conforme o ECA e comunica as autoridades competentes.'],
  ['Qual a diferença entre Conselho Tutelar e Polícia?', 'O Conselho aplica medidas de proteção e requisita serviços. A polícia atua na segurança pública e investigação de crimes.'],
  ['Quando devo ligar para o 190?', 'Quando houver risco imediato, violência em andamento ou uma emergência que exija intervenção policial.'],
];
export default function Faq() {
  const [open, setOpen] = useState(0);
  return <PublicLayout title="Perguntas Frequentes"><PageHero eyebrow="Tire suas dúvidas" title="Perguntas Frequentes" description="Respostas objetivas sobre atendimento, denúncias e atuação do Conselho Tutelar." icon="info" /><section className="container-app max-w-4xl py-14"><div className="grid gap-3">{perguntas.map(([q, a], i) => <article className="card overflow-hidden" key={q}><button className="flex w-full items-center justify-between gap-5 p-6 text-left font-extrabold" onClick={() => setOpen(open === i ? -1 : i)}>{q}<Icon name="chevron" className={`shrink-0 transition ${open === i ? 'rotate-90 text-blue-600' : 'text-slate-400'}`} /></button>{open === i && <p className="border-t border-slate-100 px-6 py-5 text-sm leading-7 text-slate-600">{a}</p>}</article>)}</div></section></PublicLayout>;
}
