import Link from 'next/link';
import Icon from './Icon';

export default function PageHero({ eyebrow, title, description, icon = 'shield' }: { eyebrow?: string; title: string; description: string; icon?: Parameters<typeof Icon>[0]['name'] }) {
  return (
    <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <span className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl" />
      <span className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-emerald-200/25 blur-3xl" />
      <div className="container-app relative flex items-center justify-between gap-8 py-14 lg:py-20">
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold text-slate-400">
            <Link href="/" className="transition hover:text-blue-600">Início</Link>
            <Icon name="chevron" size={13} />
            <span className="text-slate-600">{title}</span>
          </div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="page-title mt-3 max-w-3xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
        </div>
        <span className="hidden h-32 w-32 place-items-center rounded-[2rem] border border-white bg-white/80 text-blue-600 shadow-xl shadow-blue-900/10 backdrop-blur md:grid">
          <Icon name={icon} size={58} />
        </span>
      </div>
    </section>
  );
}
