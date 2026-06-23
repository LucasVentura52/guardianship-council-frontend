import { FormEvent, useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAdminFeedback } from '../../components/AdminFeedback';
import Icon from '../../components/Icon';
import { Skeleton } from '../../components/Skeleton';
import api, { apiError } from '../../lib/api';
import { DEFAULT_SITE_CONFIG } from '../../lib/site-config';

type Config = {
  nome_site?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade_uf?: string;
  horario_atendimento?: string;
  descricao?: string;
  disque_100_texto?: string;
  emergencia_texto?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
};

export default function Configuracoes() {
  const [config, setConfig] = useState<Config>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const feedback = useAdminFeedback();

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get('/admin/configuracoes')
      .then(({ data }) => {
        if (active) setConfig(data.data || {});
      })
      .catch((error) => {
        if (active) feedback.error(apiError(error, 'Não foi possível carregar as configurações.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [feedback]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      await api.put('/admin/configuracoes', Object.fromEntries(new FormData(event.currentTarget)));
      feedback.success('Configurações salvas com sucesso.');
    } catch (error) {
      feedback.error(apiError(error));
    }
    finally { setSaving(false); }
  }

  return <AdminLayout title="Configurações">
    <form onSubmit={save} className="card max-w-3xl p-7" key={JSON.stringify(config)}>
      <h2 className="text-lg font-extrabold">Informações institucionais</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {loading ? (
          <>
            <div>
              <Skeleton className="h-4 w-24 bg-slate-200" />
              <Skeleton className="form-input mt-2 h-12 bg-slate-200" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 bg-slate-200" />
              <Skeleton className="form-input mt-2 h-12 bg-slate-200" />
            </div>
            {Array.from({ length: 10 }).map((_, index) => (
              <div className="sm:col-span-2" key={index}>
                <Skeleton className="h-4 w-36 bg-slate-200" />
                <Skeleton className="form-input mt-2 h-12 bg-slate-200" />
              </div>
            ))}
          </>
        ) : (
          <>
            <label className="text-sm font-bold">Nome do site<input name="nome_site" required className="form-input mt-2" defaultValue={config.nome_site} /></label>
            <label className="text-sm font-bold">Telefone<input name="telefone" className="form-input mt-2" defaultValue={config.telefone} /></label>
            <label className="text-sm font-bold sm:col-span-2">E-mail<input name="email" type="email" className="form-input mt-2" defaultValue={config.email} /></label>
            <label className="text-sm font-bold sm:col-span-2">Endereço<input name="endereco" className="form-input mt-2" defaultValue={config.endereco || DEFAULT_SITE_CONFIG.endereco || ''} /></label>
            <label className="text-sm font-bold sm:col-span-2">Cidade / UF<input name="cidade_uf" className="form-input mt-2" defaultValue={config.cidade_uf || DEFAULT_SITE_CONFIG.cidade_uf || ''} /></label>
            <label className="text-sm font-bold sm:col-span-2">Horário de atendimento<input name="horario_atendimento" className="form-input mt-2" defaultValue={config.horario_atendimento} /></label>
            <label className="text-sm font-bold sm:col-span-2">Descrição<textarea name="descricao" className="form-input mt-2 min-h-28" defaultValue={config.descricao} /></label>
            <label className="text-sm font-bold sm:col-span-2">Texto do Disque 100<textarea name="disque_100_texto" className="form-input mt-2 min-h-24" defaultValue={config.disque_100_texto} /></label>
            <label className="text-sm font-bold sm:col-span-2">Texto para emergências<textarea name="emergencia_texto" className="form-input mt-2 min-h-24" defaultValue={config.emergencia_texto} /></label>
            <label className="text-sm font-bold sm:col-span-2">Facebook<input name="facebook_url" type="url" className="form-input mt-2" defaultValue={config.facebook_url} placeholder="https://facebook.com/..." /></label>
            <label className="text-sm font-bold sm:col-span-2">Instagram<input name="instagram_url" type="url" className="form-input mt-2" defaultValue={config.instagram_url} placeholder="https://instagram.com/..." /></label>
            <label className="text-sm font-bold sm:col-span-2">YouTube<input name="youtube_url" type="url" className="form-input mt-2" defaultValue={config.youtube_url} placeholder="https://youtube.com/..." /></label>
          </>
        )}
      </div>
      <button className="btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={saving || loading}>
        <span className="inline-flex h-4 w-4 items-center justify-center">{saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Icon name="check" size={16} />}</span>{saving ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </form>
  </AdminLayout>;
}
