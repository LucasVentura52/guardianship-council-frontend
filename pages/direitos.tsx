import { useEffect, useState } from 'react';
import InstitutionalPage from '../components/InstitutionalPage';
import { fetchInstitutionalPage, InstitutionalPageData } from '../lib/institutional';

export default function Direitos() {
  const [pagina, setPagina] = useState<InstitutionalPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchInstitutionalPage('direitos')
      .then((data) => {
        if (!active) return;
        setPagina(data);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError('Não foi possível carregar os direitos neste momento.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return <InstitutionalPage pagina={pagina} loading={loading} error={error} fallbackTitle="Direitos" fallbackDescription="Conheça os direitos fundamentais de crianças e adolescentes e saiba identificar quando a proteção falha." fallbackIcon="shield" />;
}
