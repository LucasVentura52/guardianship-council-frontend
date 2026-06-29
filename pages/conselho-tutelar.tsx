import { useEffect, useState } from 'react';
import InstitutionalPage from '../components/InstitutionalPage';
import { fetchInstitutionalPage, InstitutionalPageData } from '../lib/institutional';

export default function ConselhoTutelar() {
  const [pagina, setPagina] = useState<InstitutionalPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchInstitutionalPage('conselho-tutelar')
      .then((data) => {
        if (!active) return;
        setPagina(data);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError('Não foi possível carregar o conteúdo institucional.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return <InstitutionalPage pagina={pagina} loading={loading} error={error} fallbackTitle="Conselho Tutelar" fallbackDescription="Entenda o papel do Conselho Tutelar, seus limites de atuação e como ele se integra à rede de proteção." fallbackIcon="users" />;
}
