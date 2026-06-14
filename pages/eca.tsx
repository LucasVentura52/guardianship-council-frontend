import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import PublicLayout from '../components/PublicLayout';

export default function Eca() {
  return <PublicLayout title="Estatuto da Criança e do Adolescente">
    <PageHero eyebrow="Lei nº 8.069/1990" title="Estatuto da Criança e do Adolescente" description="O ECA reconhece crianças e adolescentes como sujeitos de direitos e estabelece a responsabilidade compartilhada por sua proteção integral." icon="book" />
    <section className="container-app py-14">
      <div className="grid gap-6 md:grid-cols-3">
        {[['Prioridade absoluta', 'Crianças e adolescentes devem receber proteção e atendimento prioritários.'], ['Proteção integral', 'Todos os direitos fundamentais devem ser garantidos sem discriminação.'], ['Responsabilidade compartilhada', 'Família, sociedade e Estado atuam juntos na garantia dos direitos.']].map(([t, p], i) => <article className="card p-7" key={t}><span className="text-4xl font-extrabold text-blue-100">0{i + 1}</span><h2 className="mt-4 text-lg font-extrabold">{t}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{p}</p></article>)}
      </div>
      <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-8"><div className="flex gap-4"><Icon name="info" className="shrink-0 text-amber-600" size={28} /><div><h2 className="text-lg font-extrabold">Quem o ECA protege?</h2><p className="mt-2 text-sm leading-7 text-slate-600">Considera-se criança a pessoa com até 12 anos incompletos e adolescente aquela entre 12 e 18 anos. Em situações previstas em lei, o Estatuto também se aplica a pessoas entre 18 e 21 anos.</p></div></div></div>
    </section>
  </PublicLayout>;
}
