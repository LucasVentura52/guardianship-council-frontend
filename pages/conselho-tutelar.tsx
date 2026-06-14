import InstitutionalPage from '../components/InstitutionalPage';
import { institutionalPageProps, InstitutionalPageData } from '../lib/institutional';

export default function ConselhoTutelar({ pagina }: { pagina: InstitutionalPageData }) {
  return <InstitutionalPage pagina={pagina} />;
}

export const getServerSideProps = institutionalPageProps('conselho-tutelar');
