import Icon from './Icon';

export default function PageHero({ eyebrow, title, description, icon = 'shield' }: { eyebrow?: string; title: string; description: string; icon?: Parameters<typeof Icon>[0]['name'] }) {
  return (
    <section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="container-app flex items-center justify-between gap-8 py-16 lg:py-20">
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="page-title mt-3">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
        </div>
        <span className="hidden h-28 w-28 place-items-center rounded-[2rem] bg-white text-blue-600 shadow-xl shadow-blue-900/10 md:grid"><Icon name={icon} size={54} /></span>
      </div>
    </section>
  );
}
