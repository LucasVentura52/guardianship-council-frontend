import type Icon from '../components/Icon';
import { getApiBaseUrl } from './api-base';

export type InstitutionalPageData = {
  id: number;
  titulo: string;
  slug: string;
  chamada?: string | null;
  resumo: string;
  icone: Parameters<typeof Icon>[0]['name'];
  conteudo: string;
};

export async function fetchInstitutionalPage(slug: string) {
  const base = getApiBaseUrl();
  const response = await fetch(`${base}/paginas/${slug}`);

  if (!response.ok) {
    throw new Error('Conteudo indisponivel.');
  }

  const body = await response.json();
  return body.data as InstitutionalPageData;
}
