import InstitutionalPage from '../components/InstitutionalPage';
import { institutionalPageProps, InstitutionalPageData } from '../lib/institutional';

export default function Direitos({ pagina }: { pagina: InstitutionalPageData }) {
  return <InstitutionalPage pagina={pagina} />;
}

export const getServerSideProps = institutionalPageProps('direitos');
