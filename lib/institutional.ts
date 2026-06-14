import { GetServerSideProps } from 'next';
import type Icon from '../components/Icon';

export type InstitutionalPageData = {
  id: number;
  titulo: string;
  slug: string;
  chamada?: string | null;
  resumo: string;
  icone: Parameters<typeof Icon>[0]['name'];
  conteudo: string;
};

export function institutionalPageProps(slug: string): GetServerSideProps {
  return async () => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    try {
      const response = await fetch(`${base}/paginas/${slug}`);
      if (!response.ok) return { notFound: true };
      const body = await response.json();
      return { props: { pagina: body.data } };
    } catch {
      return { notFound: true };
    }
  };
}
