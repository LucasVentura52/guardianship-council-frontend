import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Brand from './Brand';
import Icon from './Icon';

const links = [
  ['Início', '/'],
  ['Conselho Tutelar', '/conselho-tutelar'],
  ['ECA', '/eca'],
  ['Direitos', '/direitos'],
  ['Como Acionar', '/como-acionar'],
  ['Campanhas', '/campanhas'],
  ['Notícias', '/noticias'],
  ['Mural', '/mural'],
] as const;

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function active(href: string) {
    return href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[.03] backdrop-blur-xl">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-blue-700 focus:shadow-xl">
        Pular para o conteúdo
      </a>
      <div className="container-app flex h-[78px] items-center justify-between gap-5">
        <Link href="/" aria-label="Página inicial" className="min-w-0"><Brand /></Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? 'page' : undefined}
              className={`rounded-lg px-3 py-2 text-[12px] font-bold transition ${active(href) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/contato" className="btn-primary hidden lg:inline-flex">
          <Icon name="phone" size={17} /> Fale Conosco
        </Link>
        <button
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 xl:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          <Icon name="menu" />
        </button>
      </div>
      {open && (
        <nav className="container-app grid gap-1 border-t border-slate-100 bg-white py-4 shadow-xl xl:hidden" aria-label="Navegação móvel">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-4 py-3 text-sm font-bold ${active(href) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {label}
            </Link>
          ))}
          <Link href="/contato" onClick={() => setOpen(false)} className="btn-primary mt-2 justify-center">Fale Conosco</Link>
        </nav>
      )}
    </header>
  );
}
