import { GetServerSideProps } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import HomeFaq from '../components/HomeFaq';
import HomeOrientation from '../components/HomeOrientation';
import Icon from '../components/Icon';
import PublicLayout from '../components/PublicLayout';
import { getApiBaseUrl } from '../lib/api-base';

type Campanha = {
  id: number;
  slug: string;
  titulo: string;
  descricao_curta: string;
  imagem?: string | null;
};

type Noticia = {
  id: number;
  slug: string;
  titulo: string;
  resumo: string;
  imagem?: string | null;
  data_publicacao?: string | null;
};

type Telefone = {
  id: number;
  titulo: string;
  telefone: string;
  descricao?: string | null;
};

type Sugestao = {
  id: number;
  nome: string;
  assunto: string;
  mensagem: string;
  created_at?: string | null;
};

type HomeData = {
  campanhas: Campanha[];
  noticias: Noticia[];
  telefones: Telefone[];
  configuracoes: Record<string, string | null>;
  pagina_como_acionar?: { conteudo: string } | null;
  faq_conteudo?: string | null;
  sugestoes: Sugestao[];
};

const atalhos = [
  ['shield', 'Conheça seus direitos', 'Entenda as garantias previstas no ECA.', '/direitos', 'bg-blue-50 text-blue-600'],
  ['users', 'Conselho Tutelar', 'Saiba o que faz e como pode ajudar.', '/conselho-tutelar', 'bg-emerald-50 text-emerald-600'],
  ['phone', 'Como acionar', 'Veja quando e por quais canais buscar ajuda.', '/como-acionar', 'bg-amber-50 text-amber-600'],
  ['message', 'Participe', 'Compartilhe ideias no mural da comunidade.', '/mural', 'bg-violet-50 text-violet-600'],
] as const;

const passos = [
  ['message', 'Conte o que está acontecendo', 'Você não precisa conhecer termos jurídicos. Descreva a situação com as informações que tiver.'],
  ['users', 'A equipe avalia e orienta', 'O Conselho escuta, identifica os direitos envolvidos e indica os encaminhamentos adequados.'],
  ['shield', 'A rede de proteção é acionada', 'Quando necessário, saúde, educação, assistência, segurança e Justiça atuam de forma articulada.'],
] as const;

const rede = [
  ['book', 'Educação', 'Escolas e profissionais ajudam a identificar sinais e garantir acesso e permanência escolar.', 'border-blue-200 bg-blue-50/70 text-blue-700'],
  ['heart', 'Saúde', 'Serviços de saúde acolhem, cuidam e notificam situações de violência ou risco.', 'border-rose-200 bg-rose-50/70 text-rose-700'],
  ['users', 'Assistência social', 'A rede socioassistencial acompanha famílias e fortalece vínculos comunitários.', 'border-emerald-200 bg-emerald-50/70 text-emerald-700'],
  ['shield', 'Proteção e Justiça', 'Órgãos de segurança e Justiça atuam quando a situação exige medidas específicas.', 'border-amber-200 bg-amber-50/70 text-amber-700'],
] as const;

const direitos = [
  ['heart', 'Vida e saúde', 'Acesso a cuidado, alimentação, desenvolvimento saudável e atendimento prioritário.', 'bg-rose-50 text-rose-600'],
  ['book', 'Educação', 'Escola inclusiva e de qualidade, com respeito e condições para aprender.', 'bg-blue-50 text-blue-600'],
  ['users', 'Convivência familiar', 'Crescer em ambiente seguro, com vínculos familiares e comunitários protegidos.', 'bg-emerald-50 text-emerald-600'],
  ['shield', 'Respeito e dignidade', 'Proteção contra negligência, discriminação, exploração, crueldade e violência.', 'bg-violet-50 text-violet-600'],
  ['message', 'Liberdade e participação', 'Ser ouvido, expressar opiniões e participar da vida familiar e comunitária.', 'bg-amber-50 text-amber-600'],
] as const;

const faz = [
  'Atende crianças, adolescentes, famílias e pessoas da comunidade.',
  'Orienta pais e responsáveis sobre deveres e formas de proteção.',
  'Aplica medidas de proteção previstas no ECA.',
  'Requisita serviços públicos e articula a rede de atendimento.',
  'Encaminha situações às autoridades competentes quando necessário.',
];

const naoFaz = [
  'Não substitui a Polícia, o Ministério Público ou o Poder Judiciário.',
  'Não decide guarda, adoção ou perda do poder familiar.',
  'Não oferece diretamente serviços de saúde, educação ou assistência.',
  'Não funciona como órgão de punição de crianças, adolescentes ou famílias.',
];

const coresCampanha = [
  'from-violet-950 to-purple-700',
  'from-blue-800 to-cyan-600',
  'from-emerald-800 to-green-600',
  'from-amber-500 to-orange-500',
];

function listItems(content?: string) {
  return (content || '').split('\n').filter(line => line.trim().startsWith('- ')).map(line => line.trim().slice(2));
}

function SectionTitle({ kicker, title, text, action }: { kicker: string; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div className="max-w-2xl">
        <p className="section-kicker">{kicker}</p>
        <h2 className="section-title mt-2">{title}</h2>
        {text && <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export default function Home({ campanhas, noticias, telefones, configuracoes, pagina_como_acionar, faq_conteudo, sugestoes }: HomeData) {
  const disque100 = telefones.find(item => item.telefone.replace(/\D/g, '') === '100');
  const telefoneConselho = configuracoes.telefone || telefones.find(item => item.titulo.toLowerCase().includes('conselho'))?.telefone;
  const motivosAcionamento = listItems(pagina_como_acionar?.conteudo);
  const motivos = motivosAcionamento.length ? motivosAcionamento : ['Violência física ou psicológica', 'Abuso sexual', 'Negligência ou abandono', 'Trabalho infantil', 'Evasão escolar', 'Outras violações de direitos'];
  const telefonesExibidos = telefones.length ? telefones.slice(0, 6) : [
    { id: -1, titulo: 'Disque Direitos Humanos', telefone: '100', descricao: 'Canal nacional, gratuito e confidencial.' },
    { id: -2, titulo: 'Polícia Militar', telefone: '190', descricao: 'Emergências e situações de perigo imediato.' },
  ];

  return (
    <PublicLayout title="Início">
      <section className="hero-photo relative min-h-[590px] overflow-hidden">
        <div className="container-app flex min-h-[590px] items-center py-16">
          <div className="min-w-0 max-w-2xl">
            <p className="eyebrow inline-flex rounded-full bg-emerald-50 px-3 py-2 shadow-sm">Proteção, escuta e cuidado</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-[#10213f] sm:text-5xl lg:text-[64px]">
              Proteger é um<br /><span className="text-blue-600">compromisso</span><br className="sm:hidden" /><span className="text-blue-600"> de todos.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              {configuracoes.descricao || 'Informação, orientação e apoio para defender os direitos de crianças e adolescentes. Conheça o ECA, saiba como acionar o Conselho Tutelar e participe dessa rede de cuidado.'}
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link href="/como-acionar" className="btn-primary justify-center"><Icon name="phone" size={18} /> Preciso de orientação</Link>
              <Link href="/eca" className="btn-secondary justify-center"><Icon name="book" size={18} /> Conheça o ECA</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-2"><Icon name="check" size={16} className="text-emerald-500" />Atendimento gratuito</span>
              <span className="flex items-center gap-2"><Icon name="check" size={16} className="text-emerald-500" />Orientação responsável</span>
              <span className="flex items-center gap-2"><Icon name="check" size={16} className="text-emerald-500" />Proteção integral</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app relative z-10 -mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {atalhos.map(([icon, titulo, texto, href, color]) => (
          <Link href={href} key={titulo} className="card group flex items-center gap-4 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
            <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl p-3 ${color}`}><Icon name={icon} size={26} /></span>
            <span className="min-w-0 flex-1"><strong className="block text-sm">{titulo}</strong><small className="mt-1 block text-xs leading-5 text-slate-500">{texto}</small></span>
            <Icon name="chevron" size={17} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
          </Link>
        ))}
      </section>

      <section className="container-app mt-16">
        <div className="overflow-hidden rounded-3xl bg-[#0b326d] text-white shadow-xl shadow-blue-950/10">
          <div className="grid lg:grid-cols-[1.05fr_.95fr]">
            <div className="p-7 sm:p-10">
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-300">Você não está sozinho</p>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">Há canais certos para cada situação.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/80">Em caso de suspeita ou violação de direitos, procure orientação. Se houver perigo imediato ou violência em andamento, acione a emergência.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="tel:100" className="inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-800 transition hover:-translate-y-0.5"><Icon name="phone" /> Disque 100</a>
                <a href="tel:190" className="inline-flex items-center gap-3 rounded-xl bg-rose-500 px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5"><Icon name="shield" /> Emergência 190</a>
              </div>
            </div>
            <div className="grid content-center gap-3 bg-white/5 p-7 sm:grid-cols-2 sm:p-10">
              {motivos.slice(0, 6).map(item => <span key={item} className="flex gap-3 rounded-xl bg-white/10 p-3 text-xs leading-5 text-blue-50"><Icon name="check" size={16} className="shrink-0 text-emerald-300" />{item}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="container-app mt-20">
        <SectionTitle
          kicker="Mobilização social"
          title="Campanhas em destaque"
          text="Informação também protege. Conheça iniciativas de conscientização e compartilhe com sua comunidade."
          action={<Link href="/campanhas" className="btn-secondary">Ver todas <Icon name="arrow" size={17} /></Link>}
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {campanhas.length === 0 && <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">Nenhuma campanha em destaque no momento.</p>}
          {campanhas.map((item, index) => (
            <Link
              href={`/campanhas/${item.slug}`}
              key={item.id}
              className={`group flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${coresCampanha[index % coresCampanha.length]} p-6 text-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl`}
              style={item.imagem ? { backgroundImage: `linear-gradient(0deg, rgba(5,25,60,.92), rgba(5,25,60,.12)), url(${item.imagem})`, backgroundPosition: 'center', backgroundSize: 'cover' } : undefined}
            >
              <span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-white/65">Campanha</span>
              <h3 className="mt-2 text-xl font-extrabold uppercase leading-tight">{item.titulo}</h3>
              <p className="mt-3 text-xs font-semibold leading-5 text-white/80">{item.descricao_curta}</p>
              <span className="mt-5 flex items-center gap-2 text-xs font-extrabold">Conhecer campanha <Icon name="arrow" size={16} className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20 bg-white py-20">
        <div className="container-app">
          <SectionTitle kicker="Acolhimento e encaminhamento" title="Como funciona o atendimento" text="Cada situação é única. O trabalho começa pela escuta e segue com orientação e articulação da rede de proteção." />
          <div className="grid gap-5 lg:grid-cols-3">
            {passos.map(([icon, titulo, texto], index) => (
              <article key={titulo} className="relative rounded-2xl border border-slate-200 bg-slate-50/70 p-7">
                <span className="absolute right-6 top-5 text-5xl font-extrabold text-slate-200">{String(index + 1).padStart(2, '0')}</span>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><Icon name={icon} size={24} /></span>
                <h3 className="mt-6 text-lg font-extrabold">{titulo}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HomeOrientation />

      <section className="container-app mt-20">
        <SectionTitle
          kicker="ECA na prática"
          title="Direitos que precisam ser garantidos todos os dias"
          text="Crianças e adolescentes são sujeitos de direitos. Conhecer essas garantias ajuda a identificar quando alguma proteção está falhando."
          action={<Link href="/direitos" className="btn-secondary">Conheça todos os direitos <Icon name="arrow" size={17} /></Link>}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {direitos.map(([icon, titulo, texto, color]) => (
            <Link href="/direitos" key={titulo} className="card group p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${color}`}><Icon name={icon} size={23} /></span>
              <h3 className="mt-5 font-extrabold">{titulo}</h3>
              <p className="mt-3 text-xs leading-6 text-slate-600">{texto}</p>
              <span className="mt-5 flex items-center gap-2 text-xs font-bold text-blue-600 opacity-0 transition group-hover:opacity-100">Saiba mais <Icon name="arrow" size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-app mt-20">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
          <article className="p-7 sm:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><Icon name="check" size={24} /></span>
            <p className="mt-6 section-kicker text-emerald-600">O que o Conselho faz</p>
            <h2 className="mt-2 text-2xl font-extrabold">Protege direitos e articula soluções</h2>
            <ul className="mt-6 grid gap-4">
              {faz.map(item => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><Icon name="check" size={18} className="mt-0.5 shrink-0 text-emerald-500" />{item}</li>)}
            </ul>
          </article>
          <article className="border-t border-slate-200 bg-slate-50 p-7 sm:p-10 lg:border-l lg:border-t-0">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600"><Icon name="info" size={24} /></span>
            <p className="mt-6 section-kicker text-amber-600">O que o Conselho não faz</p>
            <h2 className="mt-2 text-2xl font-extrabold">Entenda os limites da atuação</h2>
            <ul className="mt-6 grid gap-4">
              {naoFaz.map(item => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-amber-100 text-[10px] font-extrabold text-amber-700">!</span>{item}</li>)}
            </ul>
            <Link href="/conselho-tutelar" className="btn-secondary mt-7">Entenda a atuação <Icon name="arrow" size={16} /></Link>
          </article>
        </div>
      </section>

      <section className="container-app mt-20">
        <SectionTitle
          kicker="Informação atualizada"
          title="Notícias e ações recentes"
          text="Acompanhe atividades educativas, mobilizações e iniciativas da rede de proteção."
          action={<Link href="/noticias" className="btn-secondary">Todas as notícias <Icon name="arrow" size={17} /></Link>}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {noticias.length === 0 && <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">Nenhuma notícia publicada.</p>}
          {noticias.slice(0, 3).map((noticia, index) => (
            <Link href={`/noticias/${noticia.slug}`} key={noticia.id} className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              {noticia.imagem ? <img src={noticia.imagem} alt="" className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className={`h-52 bg-gradient-to-br ${['from-blue-100 to-emerald-100', 'from-amber-100 to-orange-100', 'from-violet-100 to-blue-100'][index % 3]}`} />}
              <div className="p-6">
                <div className="flex items-center justify-between"><span className="status bg-blue-50 text-blue-700">Notícia</span><span className="text-[11px] text-slate-400">{noticia.data_publicacao ? new Date(noticia.data_publicacao).toLocaleDateString('pt-BR') : ''}</span></div>
                <h3 className="mt-4 text-lg font-extrabold leading-7 transition group-hover:text-blue-700">{noticia.titulo}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{noticia.resumo}</p>
                <span className="mt-5 flex items-center gap-2 text-xs font-extrabold text-blue-600">Ler notícia <Icon name="arrow" size={16} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-app mt-20">
        <SectionTitle kicker="Responsabilidade compartilhada" title="Uma rede inteira cuida" text="Proteger crianças e adolescentes exige atuação conjunta da família, da comunidade e dos serviços públicos." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {rede.map(([icon, titulo, texto, color]) => <article key={titulo} className={`rounded-2xl border p-6 ${color}`}><Icon name={icon} size={27} /><h3 className="mt-5 font-extrabold">{titulo}</h3><p className="mt-3 text-xs leading-6 text-slate-600">{texto}</p></article>)}
        </div>
      </section>

      <section className="container-app mt-20 grid gap-8 xl:grid-cols-[1.1fr_.9fr]">
        <div>
          <SectionTitle kicker="Serviços essenciais" title="Telefones úteis" text="Canais para orientação, proteção e atendimento em diferentes situações." />
          <div className="grid gap-3 sm:grid-cols-2">
            {telefonesExibidos.map(item => (
              <a href={`tel:${item.telefone}`} key={item.id} className="card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon name="phone" size={20} /></span>
                <span className="min-w-0 flex-1"><strong className="block text-sm">{item.titulo}</strong><span className="mt-1 block text-lg font-extrabold text-blue-700">{item.telefone}</span>{item.descricao && <small className="mt-1 block line-clamp-2 text-[11px] leading-5 text-slate-500">{item.descricao}</small>}</span>
                <Icon name="arrow" size={16} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
              </a>
            ))}
          </div>
          <Link href="/como-acionar" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-blue-600">Ver orientações completas <Icon name="arrow" size={16} /></Link>
        </div>
        <aside className="rounded-3xl bg-gradient-to-br from-violet-700 to-blue-800 p-7 text-white shadow-xl sm:p-9">
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-violet-200">Mural da comunidade</p>
          <h2 className="mt-3 text-2xl font-extrabold">Ideias que ajudam a transformar</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">Contribuições aprovadas mostram o que a comunidade gostaria de construir junto.</p>
          <div className="mt-7 grid gap-3">
            {sugestoes.length === 0 && <p className="rounded-2xl bg-white/10 p-5 text-sm text-white/70">Ainda não há sugestões publicadas. Você pode enviar a primeira.</p>}
            {sugestoes.slice(0, 3).map(item => (
              <article key={item.id} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <div className="flex items-center justify-between gap-3"><strong className="text-sm">{item.assunto}</strong>{item.created_at && <time className="text-[10px] text-white/45">{new Date(item.created_at).toLocaleDateString('pt-BR')}</time>}</div>
                <p className="mt-2 line-clamp-2 text-xs leading-6 text-white/70">{item.mensagem}</p>
                <span className="mt-3 block text-[11px] font-bold text-violet-200">Enviada por {item.nome}</span>
              </article>
            ))}
          </div>
          <Link href="/mural" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-violet-700">Conhecer o mural <Icon name="arrow" size={16} /></Link>
        </aside>
      </section>

      <HomeFaq content={faq_conteudo} />

      <section className="container-app mt-20 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <article className="card p-7 sm:p-9">
          <p className="section-kicker">Atendimento local</p>
          <h2 className="section-title mt-2">Encontre o Conselho Tutelar</h2>
          <div className="mt-7 grid gap-5 text-sm text-slate-600 sm:grid-cols-2">
            <span className="flex gap-3"><Icon name="location" className="shrink-0 text-blue-600" /><span>{configuracoes.endereco || 'Endereço ainda não cadastrado'}{configuracoes.cidade_uf && <><br />{configuracoes.cidade_uf}</>}</span></span>
            <span className="flex gap-3"><Icon name="clock" className="shrink-0 text-blue-600" />{configuracoes.horario_atendimento || 'Horário ainda não cadastrado'}</span>
            <a href={telefoneConselho ? `tel:${telefoneConselho}` : undefined} className="flex gap-3 font-semibold text-blue-700"><Icon name="phone" className="shrink-0" />{telefoneConselho || 'Telefone ainda não cadastrado'}</a>
            <a href={configuracoes.email ? `mailto:${configuracoes.email}` : undefined} className="flex gap-3 font-semibold text-blue-700"><Icon name="email" className="shrink-0" />{configuracoes.email || 'E-mail ainda não cadastrado'}</a>
          </div>
          <div className="mt-7 flex flex-wrap gap-3"><Link href="/contato" className="btn-primary"><Icon name="email" />Fale conosco</Link><Link href="/como-acionar" className="btn-secondary">Como acionar</Link></div>
        </article>
        <aside className="map-pattern relative min-h-80 overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
          <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-500"><Icon name="location" /></span><div><strong className="block text-sm">{configuracoes.nome_site || 'Conselho Tutelar'}</strong><span className="text-xs text-slate-500">{configuracoes.cidade_uf || 'Atendimento à comunidade'}</span></div></div>
          </div>
        </aside>
      </section>

      <section className="container-app mt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-blue-700 p-8 text-white shadow-xl sm:p-12">
          <span className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[40px] border-white/5" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-100">Participação comunitária</p>
            <h2 className="mt-3 text-3xl font-extrabold">Sua voz também ajuda a construir proteção.</h2>
            <p className="mt-4 text-sm leading-7 text-white/80">Envie propostas, dúvidas ou ideias para fortalecer as ações de informação e cuidado na comunidade.</p>
            <Link href="/mural" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-700 transition hover:-translate-y-0.5"><Icon name="message" />Participar do mural</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps<HomeData> = async () => {
  const base = getApiBaseUrl();

  try {
    const [response, faqResponse, sugestoesResponse] = await Promise.all([
      fetch(`${base}/home`),
      fetch(`${base}/paginas/faq`).catch(() => null),
      fetch(`${base}/sugestoes-aprovadas`).catch(() => null),
    ]);
    if (!response.ok) throw new Error('API indisponível');
    const data = await response.json();
    const faq = faqResponse?.ok ? await faqResponse.json() : null;
    const sugestoesData = sugestoesResponse?.ok ? await sugestoesResponse.json() : null;

    return {
      props: {
        campanhas: data.campanhas || [],
        noticias: data.noticias || [],
        telefones: data.telefones || [],
        configuracoes: data.configuracoes || {},
        pagina_como_acionar: data.pagina_como_acionar || null,
        faq_conteudo: faq?.data?.conteudo || null,
        sugestoes: sugestoesData?.data?.slice(0, 3) || [],
      },
    };
  } catch {
    return {
      props: {
        campanhas: [],
        noticias: [],
        telefones: [],
        configuracoes: {},
        pagina_como_acionar: null,
        faq_conteudo: null,
        sugestoes: [],
      },
    };
  }
};
