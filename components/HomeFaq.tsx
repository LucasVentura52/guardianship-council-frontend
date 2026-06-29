import { useMemo, useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import { Skeleton } from './Skeleton';

type Question = { question: string; answer: string };

const fallback: Question[] = [
  { question: 'O atendimento do Conselho Tutelar é gratuito?', answer: 'Sim. O atendimento e as orientações prestadas pelo Conselho Tutelar são gratuitos.' },
  { question: 'Preciso ter provas para comunicar uma suspeita?', answer: 'Não. Você pode pedir orientação ou comunicar uma suspeita com as informações disponíveis.' },
  { question: 'Posso fazer uma denúncia anônima?', answer: 'O Disque 100 aceita denúncias anônimas. No atendimento local, os dados são tratados com responsabilidade e sigilo.' },
  { question: 'Quando devo ligar para o 190?', answer: 'Quando houver risco imediato, violência em andamento ou uma emergência que exija intervenção policial.' },
];

function parseQuestions(content?: string | null) {
  if (!content) return fallback;

  const parsed = content
    .split(/\n(?=## )/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => {
      const lines = block.split('\n');
      const question = lines.shift()?.replace(/^##\s*/, '').trim() || '';
      const answer = lines.join('\n').trim();
      return { question, answer };
    })
    .filter(item => item.question && item.answer)
    .slice(0, 5);

  return parsed.length ? parsed : fallback;
}

export default function HomeFaq({ content, loading = false }: { content?: string | null; loading?: boolean }) {
  const questions = useMemo(() => parseQuestions(content), [content]);
  const [open, setOpen] = useState(0);

  return (
    <section className="container-app mt-20 grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
      <div className="lg:sticky lg:top-28 lg:h-fit">
        <p className="section-kicker">Dúvidas frequentes</p>
        <h2 className="section-title mt-2">Respostas para começar</h2>
        <p className="mt-4 text-sm leading-7 text-slate-600">Reunimos explicações diretas sobre atendimento, denúncias e atuação do Conselho Tutelar.</p>
        <Link href="/faq" className="btn-secondary mt-6">Ver todas as perguntas <Icon name="arrow" size={16} /></Link>
      </div>
      <div className="grid gap-3">
        {loading && Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="card overflow-hidden p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-5 flex-1" />
            </div>
            <Skeleton className="mt-5 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-[88%]" />
          </article>
        ))}
        {!loading && questions.map((item, index) => (
          <article key={item.question} className="card overflow-hidden">
            <button type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index} className="flex w-full items-center justify-between gap-5 p-6 text-left">
              <span className="flex items-center gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-xs font-extrabold text-blue-600">{String(index + 1).padStart(2, '0')}</span><strong className="text-sm sm:text-base">{item.question}</strong></span>
              <Icon name="chevron" className={`shrink-0 transition ${open === index ? 'rotate-90 text-blue-600' : 'text-slate-400'}`} />
            </button>
            {open === index && <div className="border-t border-slate-100 px-6 py-5 text-sm leading-7 text-slate-600">{item.answer}</div>}
          </article>
        ))}
      </div>
    </section>
  );
}
