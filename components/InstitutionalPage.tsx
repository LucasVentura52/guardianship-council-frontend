import { useState } from 'react';
import Link from 'next/link';
import { InstitutionalPageData } from '../lib/institutional';
import { useSiteConfig } from '../lib/site-config';
import Icon from './Icon';
import PageHero from './PageHero';
import PublicLayout from './PublicLayout';
import { Skeleton } from './Skeleton';

type Section = { title: string; paragraphs: string[]; items: string[] };

function parseSections(content: string): Section[] {
  return content
    .split(/\n(?=## )/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => {
      const lines = block.split('\n');
      const title = lines.shift()?.replace(/^##\s*/, '') || '';
      const items = lines.filter(line => line.trim().startsWith('- ')).map(line => line.trim().slice(2));
      const paragraphs = lines
        .filter(line => line.trim() && !line.trim().startsWith('- '))
        .join('\n')
        .split(/\n{2,}/)
        .filter(Boolean);
      return { title, paragraphs, items };
    });
}

function ContactCard() {
  const config = useSiteConfig();
  return <aside className="card p-7"><h2 className="text-xl font-extrabold">Atendimento local</h2><div className="mt-6 grid gap-5 text-sm text-slate-600">
    <span className="flex gap-3"><Icon name="location" className="shrink-0 text-blue-600" /><span>{config.endereco || 'Endereço não cadastrado'}{config.cidade_uf && <><br />{config.cidade_uf}</>}</span></span>
    <span className="flex gap-3"><Icon name="phone" className="text-blue-600" />{config.telefone || 'Telefone não cadastrado'}</span>
    <span className="flex gap-3"><Icon name="email" className="text-blue-600" />{config.email || 'E-mail não cadastrado'}</span>
    <span className="flex gap-3"><Icon name="clock" className="text-blue-600" />{config.horario_atendimento || 'Horário não cadastrado'}</span>
  </div><div className="map-pattern relative mt-6 h-52 rounded-xl"><Icon name="location" size={40} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500" /></div></aside>;
}

function FaqSections({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState(0);
  return <div className="grid gap-3">{sections.map((section, index) => <article className="card overflow-hidden" key={section.title}><button className="flex w-full items-center justify-between gap-5 p-6 text-left font-extrabold" onClick={() => setOpen(open === index ? -1 : index)}>{section.title}<Icon name="chevron" className={`shrink-0 transition ${open === index ? 'rotate-90 text-blue-600' : 'text-slate-400'}`} /></button>{open === index && <div className="border-t border-slate-100 px-6 py-5 text-sm leading-7 text-slate-600">{section.paragraphs.map(text => <p key={text}>{text}</p>)}</div>}</article>)}</div>;
}

export default function InstitutionalPage({
  pagina,
  loading = false,
  error,
  fallbackTitle,
  fallbackDescription,
  fallbackIcon = 'document',
}: {
  pagina?: InstitutionalPageData | null;
  loading?: boolean;
  error?: string | null;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackIcon?: Parameters<typeof Icon>[0]['name'];
}) {
  const sections = parseSections(pagina?.conteudo || '');
  const slug = pagina?.slug || '';
  const isFaq = slug === 'faq';
  const isContact = slug === 'como-acionar';
  const title = pagina?.titulo || fallbackTitle;
  const description = pagina?.resumo || fallbackDescription;
  const eyebrow = pagina?.chamada || undefined;
  const icon = pagina?.icone || fallbackIcon;

  return <PublicLayout title={title}>
    <PageHero eyebrow={eyebrow} title={title} description={description} icon={icon} />
    <section className={`container-app py-16 ${isContact ? 'grid gap-8 lg:grid-cols-[1.2fr_.8fr]' : 'max-w-5xl'}`}>
      <div>
        {error && !loading && <p className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        {loading ? (
          <div className="grid gap-5">
            {Array.from({ length: isFaq ? 4 : 3 }).map((_, index) => (
              <article className="card p-7" key={index}>
                <Skeleton className="h-4 w-12" />
                <Skeleton className="mt-4 h-7 w-2/3" />
                <Skeleton className="mt-5 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-[92%]" />
                <Skeleton className="mt-2 h-4 w-[80%]" />
              </article>
            ))}
          </div>
        ) : isFaq ? <FaqSections sections={sections} /> : <div className={`grid gap-5 ${slug === 'eca' ? 'md:grid-cols-3' : ''}`}>
          {sections.map((section, index) => <article className={`card p-7 transition hover:border-blue-200 hover:shadow-md ${section.items.length ? 'md:col-span-full' : ''}`} key={section.title}>
            <span className="text-sm font-extrabold text-blue-500">{String(index + 1).padStart(2, '0')}</span>
            <h2 className="mt-3 text-xl font-extrabold">{section.title}</h2>
            {section.paragraphs.map(text => <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600" key={text}>{text}</p>)}
            {section.items.length > 0 && <ul className="mt-5 grid gap-3 sm:grid-cols-2">{section.items.map(item => <li className="flex gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600" key={item}><Icon name="check" className="shrink-0 text-emerald-500" />{item}</li>)}</ul>}
          </article>)}
          {!loading && !error && sections.length === 0 && <article className="card p-7 text-sm text-slate-500">Conteúdo indisponível no momento.</article>}
        </div>}
      </div>
      {isContact && <ContactCard />}
    </section>
    <section className="container-app max-w-5xl">
      <div className="flex flex-col gap-5 rounded-3xl bg-gradient-to-r from-blue-700 to-blue-900 p-7 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-300">Precisa de orientação?</p><h2 className="mt-2 text-2xl font-extrabold">A informação é o primeiro passo para proteger.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/75">Converse com a equipe ou veja os canais indicados para cada situação.</p></div>
        <div className="flex shrink-0 flex-wrap gap-3"><Link href="/contato" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-700"><Icon name="email" size={17} />Fale conosco</Link>{!isContact && <Link href="/como-acionar" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-extrabold text-white"><Icon name="phone" size={17} />Como acionar</Link>}</div>
      </div>
    </section>
  </PublicLayout>;
}
