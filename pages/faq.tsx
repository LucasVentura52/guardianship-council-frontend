import InstitutionalPage from '../components/InstitutionalPage';
import { institutionalPageProps, InstitutionalPageData } from '../lib/institutional';

export default function Faq({ pagina }: { pagina: InstitutionalPageData }) {
  return <InstitutionalPage pagina={pagina} />;
}

export const getServerSideProps = institutionalPageProps('faq');
