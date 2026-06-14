import { createContext, ReactNode, useContext } from 'react';

export type SiteConfig = {
  nome_site?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  cidade_uf?: string | null;
  horario_atendimento?: string | null;
  descricao?: string | null;
  disque_100_texto?: string | null;
  emergencia_texto?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  youtube_url?: string | null;
};

const SiteConfigContext = createContext<SiteConfig>({});

export function SiteConfigProvider({ config, children }: { config: SiteConfig; children: ReactNode }) {
  return <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
