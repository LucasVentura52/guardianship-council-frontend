import { useEffect, useState } from 'react';
import InstitutionalPage from '../components/InstitutionalPage';
import { fetchInstitutionalPage, InstitutionalPageData } from '../lib/institutional';

export default function Eca() {
  const [pagina, setPagina] = useState<InstitutionalPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchInstitutionalPage('eca')
      .then((data) => {
        if (!active) return;
        setPagina(data);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError('Não foi possível carregar o conteúdo do ECA.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return <InstitutionalPage pagina={pagina} loading={loading} error={error} fallbackTitle="ECA" fallbackDescription="Entenda os princípios centrais do Estatuto da Criança e do Adolescente em linguagem acessível." fallbackIcon="book" />;
}
