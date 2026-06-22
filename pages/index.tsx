import { GetServerSideProps } from 'next';
import Link from 'next/link';
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

type HomeData = {
  campanhas: Campanha[];
  noticias: Noticia[];
  telefones: Telefone[];
  configuracoes: Record<string, string | null>;
  pagina_como_acionar?: { conteudo: string } | null;
};

const atalhos = [
  ['shield', 'Conheça seus direitos', 'Entenda os direitos garantidos pelo ECA.', '/direitos'],
  ['users', 'Conselho Tutelar', 'Saiba o que é e como funciona.', '/conselho-tutelar'],
  ['phone', 'Como acionar', 'Veja em quais situações buscar ajuda.', '/como-acionar'],
  ['message', 'Participe', 'Envie sugestões para a comunidade.', '/mural'],
] as const;

const coresCampanha = [
  'from-violet-950 to-purple-700',
  'from-blue-800 to-cyan-600',
  'from-emerald-800 to-green-600',
  'from-amber-500 to-orange-500',
];

function listItems(content?: string) {
  return (content || '').split('\n').filter(line => line.trim().startsWith('- ')).map(line => line.trim().slice(2));
}

export default function Home({ campanhas, noticias, telefones, configuracoes, pagina_como_acionar }: HomeData) {
  const disque100 = telefones.find(item => item.telefone.replace(/\D/g, '') === '100');
  const telefoneConselho = configuracoes.telefone || telefones.find(item => item.titulo.toLowerCase().includes('conselho'))?.telefone;
  const motivosAcionamento = listItems(pagina_como_acionar?.conteudo);

  return (
    <PublicLayout title="Início">
      <section className="hero-photo min-h-[500px]">
        <div className="container-app flex min-h-[500px] items-center py-16">
          <div className="max-w-xl">
            <p className="eyebrow">Proteção e cuidado</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.12] tracking-tight text-[#10213f] sm:text-5xl lg:text-[58px]">
              Protegendo hoje,<br /><span className="text-blue-600">garantindo o amanhã.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">{configuracoes.descricao || 'Informação, orientação e apoio para defender os direitos de crianças e adolescentes. Conheça o ECA, saiba como acionar o Conselho Tutelar e participe dessa causa.'}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/eca" className="btn-primary"><Icon name="book" size={18} /> Conheça o ECA</Link>
              <Link href="/como-acionar" className="btn-secondary"><Icon name="phone" size={18} /> Como Acionar</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app relative z-10 -mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {atalhos.map(([icon, titulo, texto, href]) => (
          <Link href={href} key={titulo} className="card flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:shadow-lg">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon name={icon} size={25} /></span>
            <span><strong className="block text-sm">{titulo}</strong><small className="mt-1 block text-xs leading-5 text-slate-500">{texto}</small></span>
          </Link>
        ))}
      </section>

      <section className="container-app mt-14">
        <div className="mb-5 flex items-end justify-between"><h2 className="section-title">Campanhas em destaque</h2><Link href="/campanhas" className="text-sm font-bold text-blue-600">Ver todas</Link></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {campanhas.length === 0 && <p className="col-span-full rounded-xl bg-white p-8 text-center text-sm text-slate-500">Nenhuma campanha em destaque no momento.</p>}
          {campanhas.map((item, index) => (
            <Link
              href={`/campanhas/${item.slug}`}
              key={item.id}
              className={`group min-h-44 overflow-hidden rounded-xl bg-gradient-to-br ${coresCampanha[index % coresCampanha.length]} p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}
              style={item.imagem ? { backgroundImage: `linear-gradient(0deg, rgba(5,25,60,.85), rgba(5,25,60,.15)), url(${item.imagem})`, backgroundPosition: 'center', backgroundSize: 'cover' } : undefined}
            >
              <span className="text-2xl font-extrabold uppercase leading-none">{item.titulo}</span>
              <p className="mt-4 max-w-[250px] text-xs font-semibold leading-5 text-white/85">{item.descricao_curta}</p>
              <Icon name="arrow" className="mt-5 transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <section className="container-app mt-8 grid gap-5 lg:grid-cols-[1.05fr_1fr_1fr]">
        <div className="card p-6">
          <div className="mb-4 flex justify-between"><h2 className="font-extrabold">Notícias recentes</h2><Link href="/noticias" className="text-xs font-bold text-blue-600">Ver todas</Link></div>
          <div className="grid gap-5">
            {noticias.length === 0 && <p className="text-sm text-slate-500">Nenhuma notícia publicada.</p>}
            {noticias.slice(0, 2).map((noticia, index) => (
              <Link href={`/noticias/${noticia.slug}`} key={noticia.id} className="flex gap-4">
                {noticia.imagem ? <img src={noticia.imagem} alt="" className="h-20 w-28 shrink-0 rounded-lg object-cover" /> : <span className={`h-20 w-28 shrink-0 rounded-lg bg-gradient-to-br ${index ? 'from-orange-200 to-blue-200' : 'from-emerald-200 to-blue-300'}`} />}
                <span><strong className="text-sm leading-5">{noticia.titulo}</strong><small className="mt-1 block text-xs leading-5 text-slate-500">{noticia.resumo}</small><small className="mt-1 block text-[10px] text-slate-400">{noticia.data_publicacao ? new Date(noticia.data_publicacao).toLocaleDateString('pt-BR') : ''}</small></span>
              </Link>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-extrabold">Como acionar o Conselho Tutelar</h2>
          <div className="mt-4 flex items-center gap-4 rounded-xl bg-emerald-50 p-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-emerald-200 text-emerald-600"><Icon name="phone" size={24} /></span>
            <span><strong className="block text-sm">{disque100?.titulo || 'Disque 100'}</strong><small className="text-xs text-slate-500">{disque100?.descricao || 'Ligação gratuita e confidencial, 24 horas.'}</small></span>
          </div>
          <h3 className="mb-3 mt-5 text-sm font-bold">Em quais situações acionar?</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {motivosAcionamento.slice(0, 6).map(item => <span key={item} className="flex gap-2 text-[11px] text-slate-600"><Icon name="check" size={14} className="shrink-0 text-emerald-500" />{item}</span>)}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-extrabold">Endereço do Conselho Tutelar</h2>
          <div className="mt-5 grid gap-3 text-xs text-slate-600">
            <span className="flex gap-3"><Icon name="location" size={18} className="shrink-0 text-blue-600" />{configuracoes.endereco || 'Endereço ainda não cadastrado'}</span>
            <span className="flex gap-3"><Icon name="phone" size={18} className="text-blue-600" />{telefoneConselho || 'Telefone ainda não cadastrado'}</span>
            <span className="flex gap-3"><Icon name="email" size={18} className="text-blue-600" />{configuracoes.email || 'E-mail ainda não cadastrado'}</span>
            <span className="flex gap-3"><Icon name="clock" size={18} className="text-blue-600" />{configuracoes.horario_atendimento || 'Horário ainda não cadastrado'}</span>
          </div>
          <div className="map-pattern relative mt-5 h-28 overflow-hidden rounded-xl"><Icon name="location" size={34} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500" /></div>
        </div>
      </section>
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps<HomeData> = async () => {
  const base = getApiBaseUrl();

  try {
    const response = await fetch(`${base}/home`);
    if (!response.ok) throw new Error('API indisponível');
    const data = await response.json();

    return {
      props: {
        campanhas: data.campanhas || [],
        noticias: data.noticias || [],
        telefones: data.telefones || [],
        configuracoes: data.configuracoes || {},
        pagina_como_acionar: data.pagina_como_acionar || null,
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
      },
    };
  }
};
