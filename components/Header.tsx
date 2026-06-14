import Link from 'next/link';
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
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
      <div className="container-app flex h-[76px] items-center justify-between">
        <Link href="/" aria-label="Página inicial"><Brand /></Link>
        <nav className="hidden items-center gap-5 xl:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-[13px] font-semibold text-slate-700 transition hover:text-blue-600">
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/contato" className="btn-primary hidden lg:inline-flex">
          <Icon name="phone" size={17} /> Fale Conosco
        </Link>
        <button className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 xl:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menu">
          <Icon name="menu" />
        </button>
      </div>
      {open && (
        <nav className="container-app grid gap-1 border-t border-slate-100 py-4 xl:hidden">
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium hover:bg-blue-50 hover:text-blue-700">{label}</Link>)}
          <Link href="/contato" className="btn-primary mt-2 justify-center">Fale Conosco</Link>
        </nav>
      )}
    </header>
  );
}
