import { getApiBaseUrl } from './api-base';

export type Campanha = {
  id: number;
  slug: string;
  titulo: string;
  descricao_curta: string;
  imagem?: string | null;
  data_publicacao?: string | null;
  conteudo?: string;
};

export type Noticia = {
  id: number;
  slug: string;
  titulo: string;
  resumo: string;
  imagem?: string | null;
  data_publicacao?: string | null;
  conteudo?: string;
};

export type Telefone = {
  id: number;
  titulo: string;
  telefone: string;
  descricao?: string | null;
};

export type Sugestao = {
  id: number;
  nome: string;
  assunto: string;
  mensagem: string;
  created_at?: string | null;
};

export type HomeData = {
  campanhas: Campanha[];
  noticias: Noticia[];
  telefones: Telefone[];
  configuracoes: Record<string, string | null>;
  pagina_como_acionar?: { conteudo: string } | null;
  faq_conteudo?: string | null;
  sugestoes: Sugestao[];
};

async function fetchJson(path: string) {
  const response = await fetch(`${getApiBaseUrl()}${path}`);

  if (!response.ok) {
    throw new Error('API indisponivel.');
  }

  return response.json();
}

export async function fetchHomeData(): Promise<HomeData> {
  const [home, faq, sugestoes] = await Promise.all([
    fetchJson('/home'),
    fetchJson('/paginas/faq').catch(() => null),
    fetchJson('/sugestoes-aprovadas').catch(() => null),
  ]);

  return {
    campanhas: home.campanhas || [],
    noticias: home.noticias || [],
    telefones: home.telefones || [],
    configuracoes: home.configuracoes || {},
    pagina_como_acionar: home.pagina_como_acionar || null,
    faq_conteudo: faq?.data?.conteudo || null,
    sugestoes: sugestoes?.data?.slice(0, 3) || [],
  };
}

export async function fetchCampanhas() {
  const body = await fetchJson('/campanhas');
  return (body.data || []) as Campanha[];
}

export async function fetchCampanha(slug: string) {
  const body = await fetchJson(`/campanhas/${slug}`);
  return body.data as Campanha;
}

export async function fetchNoticias() {
  const body = await fetchJson('/noticias');
  return (body.data || []) as Noticia[];
}

export async function fetchNoticia(slug: string) {
  const body = await fetchJson(`/noticias/${slug}`);
  return body.data as Noticia;
}
