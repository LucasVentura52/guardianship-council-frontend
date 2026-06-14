import Link from 'next/link';
import Brand from './Brand';
import Icon from './Icon';

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#082754] text-blue-100">
      <div className="container-app grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Brand light />
          <p className="mt-5 max-w-sm text-sm leading-6 text-blue-100/75">Promovendo e defendendo os direitos de crianças e adolescentes com informação, acolhimento e participação social.</p>
          <div className="mt-5 flex gap-2">
            {['f', 'in', '▶'].map((item) => <span key={item} className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-xs font-bold">{item}</span>)}
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Navegação</h3>
          <div className="grid gap-2 text-sm text-blue-100/75">
            <Link href="/">Início</Link><Link href="/conselho-tutelar">Conselho Tutelar</Link><Link href="/eca">ECA</Link><Link href="/direitos">Direitos</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Informações</h3>
          <div className="grid gap-2 text-sm text-blue-100/75">
            <Link href="/como-acionar">Como acionar</Link><Link href="/campanhas">Campanhas</Link><Link href="/noticias">Notícias</Link><Link href="/mural">Mural da comunidade</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">Ajuda</h3>
          <div className="grid gap-2 text-sm text-blue-100/75">
            <Link href="/faq">Perguntas frequentes</Link><Link href="/contato">Fale conosco</Link><span>Disque 100</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-app flex flex-col gap-2 py-5 text-xs text-blue-100/60 sm:flex-row sm:justify-between">
          <span>© 2026 Conselho Tutelar. Todos os direitos reservados.</span>
          <span className="flex items-center gap-1"><Icon name="shield" size={14} /> Proteção e cuidado</span>
        </div>
      </div>
    </footer>
  );
}
