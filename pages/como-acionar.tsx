import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import PublicLayout from '../components/PublicLayout';
import { motivosAcionamento } from '../data/content';

export default function ComoAcionar() {
  return <PublicLayout title="Como Acionar">
    <PageHero eyebrow="Busque orientação" title="Como Acionar o Conselho Tutelar" description="Você pode procurar o Conselho sempre que os direitos de uma criança ou adolescente estiverem ameaçados ou violados." icon="phone" />
    <section className="container-app grid gap-8 py-14 lg:grid-cols-[1.2fr_.8fr]">
      <div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7"><div className="flex items-center gap-5"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-emerald-600"><Icon name="phone" size={32} /></span><div><p className="text-sm font-bold text-emerald-700">Canal nacional de denúncias</p><h2 className="text-3xl font-extrabold">Disque 100</h2><p className="text-sm text-slate-600">Gratuito, confidencial e disponível 24 horas.</p></div></div></div>
        <div className="card mt-6 p-7"><h2 className="section-title">Em quais situações acionar?</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{motivosAcionamento.map(item => <span className="flex items-center gap-3 text-sm text-slate-600" key={item}><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Icon name="check" size={14} /></span>{item}</span>)}</div></div>
      </div>
      <aside className="card p-7"><h2 className="text-xl font-extrabold">Atendimento local</h2><div className="mt-6 grid gap-5 text-sm text-slate-600"><span className="flex gap-3"><Icon name="location" className="text-blue-600" />Rua das Crianças, 123<br />Centro - Sua Cidade/UF</span><span className="flex gap-3"><Icon name="phone" className="text-blue-600" />(00) 1234-5678</span><span className="flex gap-3"><Icon name="email" className="text-blue-600" />conselho@suacidade.gov.br</span><span className="flex gap-3"><Icon name="clock" className="text-blue-600" />Segunda a sexta, 8h às 17h</span></div><div className="map-pattern relative mt-6 h-52 rounded-xl"><Icon name="location" size={40} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500" /></div></aside>
    </section>
  </PublicLayout>;
}
