import { useEffect, useState } from 'react';
import InstitutionalPage from '../components/InstitutionalPage';
import { fetchInstitutionalPage, InstitutionalPageData } from '../lib/institutional';

export default function ComoAcionar() {
  const [pagina, setPagina] = useState<InstitutionalPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchInstitutionalPage('como-acionar')
      .then((data) => {
        if (!active) return;
        setPagina(data);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError('Não foi possível carregar as orientações agora.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return <InstitutionalPage pagina={pagina} loading={loading} error={error} fallbackTitle="Como Acionar" fallbackDescription="Veja quando procurar orientação, quais canais usar e como agir em situações de urgência ou suspeita de violação." fallbackIcon="phone" />;
}
