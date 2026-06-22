import Link from 'next/link';
import Brand from './Brand';
import Icon from './Icon';
import { useSiteConfig } from '../lib/site-config';

export default function Footer() {
  const config = useSiteConfig();
  const socials = [
    ['f', config.facebook_url, 'Facebook'],
    ['in', config.instagram_url, 'Instagram'],
    ['▶', config.youtube_url, 'YouTube'],
  ].filter((item): item is [string, string, string] => Boolean(item[1]));

  return (
    <footer className="mt-24 bg-[#071f46] text-blue-100">
      <div className="border-b border-white/10 bg-white/[.04]">
        <div className="container-app grid gap-4 py-6 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300"><Icon name="phone" /></span>
            <div><span className="text-xs font-bold uppercase tracking-wider text-blue-200/60">Denúncias e orientação</span><a href="tel:100" className="mt-1 block text-lg font-extrabold text-white">Disque 100</a></div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-rose-500/10 p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-rose-400/15 text-rose-200"><Icon name="shield" /></span>
            <div><span className="text-xs font-bold uppercase tracking-wider text-rose-100/60">Perigo imediato</span><a href="tel:190" className="mt-1 block text-lg font-extrabold text-white">Polícia Militar · 190</a></div>
          </div>
        </div>
      </div>
      <div className="container-app grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Brand light />
          <p className="mt-5 max-w-sm text-sm leading-7 text-blue-100/70">{config.descricao || 'Promovendo e defendendo os direitos de crianças e adolescentes com informação, acolhimento e participação social.'}</p>
          {socials.length > 0 && <div className="mt-5 flex gap-2">{socials.map(([label, url, name]) => <a href={url} target="_blank" rel="noreferrer" aria-label={name} key={name} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-xs font-bold transition hover:-translate-y-0.5 hover:bg-white/20">{label}</a>)}</div>}
        </div>
        <div>
          <h3 className="mb-5 text-sm font-extrabold text-white">Navegação</h3>
          <div className="grid gap-3 text-sm text-blue-100/70">
            <Link className="transition hover:text-white" href="/">Início</Link><Link className="transition hover:text-white" href="/conselho-tutelar">Conselho Tutelar</Link><Link className="transition hover:text-white" href="/eca">ECA</Link><Link className="transition hover:text-white" href="/direitos">Direitos</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-sm font-extrabold text-white">Conteúdos</h3>
          <div className="grid gap-3 text-sm text-blue-100/70">
            <Link className="transition hover:text-white" href="/como-acionar">Como acionar</Link><Link className="transition hover:text-white" href="/campanhas">Campanhas</Link><Link className="transition hover:text-white" href="/noticias">Notícias</Link><Link className="transition hover:text-white" href="/mural">Mural da comunidade</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-sm font-extrabold text-white">Atendimento</h3>
          <div className="grid gap-3 text-sm text-blue-100/70">
            <Link className="transition hover:text-white" href="/faq">Perguntas frequentes</Link>
            <Link className="transition hover:text-white" href="/contato">Fale conosco</Link>
            {config.telefone && <a className="flex items-center gap-2 transition hover:text-white" href={`tel:${config.telefone}`}><Icon name="phone" size={15} />{config.telefone}</a>}
            {config.email && <a className="break-all transition hover:text-white" href={`mailto:${config.email}`}>{config.email}</a>}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-app flex flex-col gap-3 py-5 text-xs text-blue-100/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {config.nome_site || 'Conselho Tutelar'}. Todos os direitos reservados.</span>
          <a href="#topo" className="flex items-center gap-2 font-bold text-blue-100/70 transition hover:text-white">Voltar ao topo <span className="-rotate-90"><Icon name="arrow" size={14} /></span></a>
        </div>
      </div>
    </footer>
  );
}
