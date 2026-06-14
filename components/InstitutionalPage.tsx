import { useState } from 'react';
import { InstitutionalPageData } from '../lib/institutional';
import { useSiteConfig } from '../lib/site-config';
import Icon from './Icon';
import PageHero from './PageHero';
import PublicLayout from './PublicLayout';

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

export default function InstitutionalPage({ pagina }: { pagina: InstitutionalPageData }) {
  const sections = parseSections(pagina.conteudo);
  const isFaq = pagina.slug === 'faq';
  const isContact = pagina.slug === 'como-acionar';

  return <PublicLayout title={pagina.titulo}>
    <PageHero eyebrow={pagina.chamada || undefined} title={pagina.titulo} description={pagina.resumo} icon={pagina.icone || 'document'} />
    <section className={`container-app py-14 ${isContact ? 'grid gap-8 lg:grid-cols-[1.2fr_.8fr]' : 'max-w-5xl'}`}>
      <div>
        {isFaq ? <FaqSections sections={sections} /> : <div className={`grid gap-5 ${pagina.slug === 'eca' ? 'md:grid-cols-3' : ''}`}>
          {sections.map((section, index) => <article className={`card p-7 ${section.items.length ? 'md:col-span-full' : ''}`} key={section.title}>
            <span className="text-sm font-extrabold text-blue-500">{String(index + 1).padStart(2, '0')}</span>
            <h2 className="mt-3 text-xl font-extrabold">{section.title}</h2>
            {section.paragraphs.map(text => <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600" key={text}>{text}</p>)}
            {section.items.length > 0 && <ul className="mt-5 grid gap-3 sm:grid-cols-2">{section.items.map(item => <li className="flex gap-3 text-sm text-slate-600" key={item}><Icon name="check" className="shrink-0 text-emerald-500" />{item}</li>)}</ul>}
          </article>)}
        </div>}
      </div>
      {isContact && <ContactCard />}
    </section>
  </PublicLayout>;
}
