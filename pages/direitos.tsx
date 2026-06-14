import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import PublicLayout from '../components/PublicLayout';
import { direitos } from '../data/content';

export default function Direitos() {
  return <PublicLayout title="Direitos">
    <PageHero eyebrow="ECA na prática" title="Direitos da Criança e do Adolescente" description="Conheça os direitos fundamentais para um desenvolvimento digno, saudável e seguro." icon="heart" />
    <section className="container-app py-14">
      <div className="mx-auto grid max-w-5xl gap-4">
        {direitos.map(d => <article key={d.titulo} className="card flex items-center gap-5 p-6 transition hover:border-blue-200 hover:shadow-md"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon name={d.icon} size={27} /></span><div><h2 className="font-extrabold">{d.titulo}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{d.texto}</p></div><Icon name="chevron" className="ml-auto hidden text-slate-400 sm:block" /></article>)}
      </div>
    </section>
  </PublicLayout>;
}
