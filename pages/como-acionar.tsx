import InstitutionalPage from '../components/InstitutionalPage';
import { institutionalPageProps, InstitutionalPageData } from '../lib/institutional';

export default function ComoAcionar({ pagina }: { pagina: InstitutionalPageData }) {
  return <InstitutionalPage pagina={pagina} />;
}

export const getServerSideProps = institutionalPageProps('como-acionar');
