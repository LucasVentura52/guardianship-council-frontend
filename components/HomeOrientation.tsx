import { useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';

type IconName = Parameters<typeof Icon>[0]['name'];

type Guidance = {
  id: string;
  icon: IconName;
  title: string;
  summary: string;
  resultTitle: string;
  result: string;
  action: string;
  href: string;
  tone: string;
};

const guidance: Guidance[] = [
  {
    id: 'emergencia',
    icon: 'shield',
    title: 'Há perigo imediato',
    summary: 'Violência acontecendo agora, ameaça grave ou necessidade de intervenção urgente.',
    resultTitle: 'Ligue para o 190',
    result: 'Em situações de perigo imediato, priorize sua segurança e acione a Polícia Militar. Depois, a rede de proteção poderá realizar os encaminhamentos necessários.',
    action: 'Ligar 190',
    href: 'tel:190',
    tone: 'border-rose-200 bg-rose-50 text-rose-700',
  },
  {
    id: 'violacao',
    icon: 'phone',
    title: 'Suspeita de violação de direitos',
    summary: 'Negligência, abuso, exploração, trabalho infantil ou outra situação preocupante.',
    resultTitle: 'Procure o Conselho ou Disque 100',
    result: 'Você não precisa ter provas para pedir orientação ou comunicar uma suspeita. Relate o que sabe com clareza e preserve a criança ou adolescente.',
    action: 'Disque 100',
    href: 'tel:100',
    tone: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  {
    id: 'orientacao',
    icon: 'message',
    title: 'Tenho dúvidas e preciso de orientação',
    summary: 'Não sei qual serviço procurar ou quero entender melhor uma situação.',
    resultTitle: 'Fale com o atendimento local',
    result: 'O Conselho Tutelar pode orientar sobre direitos, serviços disponíveis e encaminhamentos. Use o contato local para explicar a situação.',
    action: 'Fale conosco',
    href: '/contato',
    tone: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  {
    id: 'participacao',
    icon: 'users',
    title: 'Quero contribuir com a comunidade',
    summary: 'Tenho uma ideia, proposta educativa ou sugestão de ação.',
    resultTitle: 'Participe do mural',
    result: 'Envie sua proposta para análise. Sugestões aprovadas podem ser compartilhadas publicamente e inspirar novas ações comunitárias.',
    action: 'Enviar sugestão',
    href: '/mural',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
];

export default function HomeOrientation() {
  const [selected, setSelected] = useState<Guidance>(guidance[0]);

  return (
    <section className="mt-20 bg-[#eef5ff] py-20">
      <div className="container-app">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Orientação rápida</p>
          <h2 className="section-title mt-2">Qual situação mais se aproxima do que você precisa?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Escolha uma opção para encontrar um ponto de partida. Esta orientação não substitui o atendimento da equipe.</p>
        </div>
        <div className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {guidance.map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelected(item)}
                aria-pressed={selected.id === item.id}
                className={`rounded-2xl border p-5 text-left transition ${selected.id === item.id ? `${item.tone} shadow-md` : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:shadow-sm'}`}
              >
                <span className="flex items-start gap-4">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${selected.id === item.id ? 'bg-white/70' : 'bg-slate-50 text-blue-600'}`}><Icon name={item.icon} size={21} /></span>
                  <span><strong className="block text-sm">{item.title}</strong><small className="mt-2 block text-xs leading-5 opacity-75">{item.summary}</small></span>
                </span>
              </button>
            ))}
          </div>
          <article className={`flex min-h-80 flex-col justify-between rounded-3xl border p-7 sm:p-9 ${selected.tone}`}>
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/70 shadow-sm"><Icon name={selected.icon} size={28} /></span>
              <p className="mt-7 text-xs font-extrabold uppercase tracking-[.16em] opacity-60">Orientação indicada</p>
              <h3 className="mt-2 text-2xl font-extrabold">{selected.resultTitle}</h3>
              <p className="mt-4 text-sm leading-7 opacity-80">{selected.result}</p>
            </div>
            {selected.href.startsWith('tel:') ? (
              <a href={selected.href} className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5"><Icon name="phone" size={17} />{selected.action}</a>
            ) : (
              <Link href={selected.href} className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5">{selected.action}<Icon name="arrow" size={17} /></Link>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
