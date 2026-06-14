import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import PublicLayout from '../components/PublicLayout';

export default function ConselhoTutelar() {
  return <PublicLayout title="Sobre o Conselho Tutelar">
    <PageHero eyebrow="Conheça nossa atuação" title="O que é o Conselho Tutelar?" description="Órgão permanente e autônomo encarregado de zelar pelo cumprimento dos direitos da criança e do adolescente." icon="users" />
    <section className="container-app grid gap-8 py-14 lg:grid-cols-3">
      {[
        ['shield', 'Proteção de direitos', 'Atua quando direitos previstos no ECA são ameaçados ou violados, aplicando medidas de proteção e orientação.'],
        ['users', 'Atendimento à comunidade', 'Acolhe crianças, adolescentes, famílias e qualquer pessoa que procure orientação ou queira comunicar uma situação.'],
        ['chart', 'Trabalho em rede', 'Articula serviços de saúde, educação, assistência social, segurança e Justiça para garantir proteção integral.'],
      ].map(([icon, title, text]) => <article className="card p-7" key={title}><span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon name={icon as any} /></span><h2 className="mt-5 text-lg font-extrabold">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}
    </section>
    <section className="container-app grid gap-8 lg:grid-cols-2">
      <div className="card p-8"><h2 className="section-title">O que o Conselho faz</h2><ul className="mt-6 grid gap-4">{['Atende e aconselha crianças, adolescentes, pais e responsáveis.', 'Aplica medidas de proteção previstas no ECA.', 'Requisita serviços públicos nas áreas de saúde, educação e assistência.', 'Encaminha situações ao Ministério Público e à Justiça quando necessário.'].map(x => <li className="flex gap-3 text-sm text-slate-600" key={x}><Icon name="check" className="shrink-0 text-emerald-500" />{x}</li>)}</ul></div>
      <div className="rounded-2xl bg-[#0b3269] p-8 text-white"><h2 className="text-2xl font-extrabold">Importante saber</h2><p className="mt-4 text-sm leading-7 text-blue-100">O Conselho Tutelar não substitui a família, a escola, a polícia ou o Judiciário. Seu papel é garantir que todos cumpram suas responsabilidades na proteção de crianças e adolescentes.</p></div>
    </section>
  </PublicLayout>;
}
