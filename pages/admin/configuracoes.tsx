import { FormEvent, useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Icon from '../../components/Icon';
import api, { apiError } from '../../lib/api';

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
  const [message, setMessage] = useState('');
  useEffect(() => { api.get('/admin/configuracoes').then(({ data }) => setConfig(data.data || {})).catch(error => setMessage(apiError(error))); }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await api.put('/admin/configuracoes', Object.fromEntries(new FormData(event.currentTarget)));
      setMessage('Configurações salvas com sucesso.');
    } catch (error) { setMessage(apiError(error)); }
  }

  return <AdminLayout title="Configurações">
    {message && <p className="mb-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">{message}</p>}
    <form onSubmit={save} className="card max-w-3xl p-7" key={JSON.stringify(config)}><h2 className="text-lg font-extrabold">Informações institucionais</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-bold">Nome do site<input name="nome_site" required className="form-input mt-2" defaultValue={config.nome_site} /></label>
      <label className="text-sm font-bold">Telefone<input name="telefone" className="form-input mt-2" defaultValue={config.telefone} /></label>
      <label className="text-sm font-bold sm:col-span-2">E-mail<input name="email" type="email" className="form-input mt-2" defaultValue={config.email} /></label>
      <label className="text-sm font-bold sm:col-span-2">Endereço<input name="endereco" className="form-input mt-2" defaultValue={config.endereco} /></label>
      <label className="text-sm font-bold sm:col-span-2">Cidade / UF<input name="cidade_uf" className="form-input mt-2" defaultValue={config.cidade_uf} /></label>
      <label className="text-sm font-bold sm:col-span-2">Horário de atendimento<input name="horario_atendimento" className="form-input mt-2" defaultValue={config.horario_atendimento} /></label>
      <label className="text-sm font-bold sm:col-span-2">Descrição<textarea name="descricao" className="form-input mt-2 min-h-28" defaultValue={config.descricao} /></label>
      <label className="text-sm font-bold sm:col-span-2">Texto do Disque 100<textarea name="disque_100_texto" className="form-input mt-2 min-h-24" defaultValue={config.disque_100_texto} /></label>
      <label className="text-sm font-bold sm:col-span-2">Texto para emergências<textarea name="emergencia_texto" className="form-input mt-2 min-h-24" defaultValue={config.emergencia_texto} /></label>
      <label className="text-sm font-bold sm:col-span-2">Facebook<input name="facebook_url" type="url" className="form-input mt-2" defaultValue={config.facebook_url} placeholder="https://facebook.com/..." /></label>
      <label className="text-sm font-bold sm:col-span-2">Instagram<input name="instagram_url" type="url" className="form-input mt-2" defaultValue={config.instagram_url} placeholder="https://instagram.com/..." /></label>
      <label className="text-sm font-bold sm:col-span-2">YouTube<input name="youtube_url" type="url" className="form-input mt-2" defaultValue={config.youtube_url} placeholder="https://youtube.com/..." /></label>
    </div><button className="btn-primary mt-6" type="submit"><Icon name="check" />Salvar alterações</button></form>
  </AdminLayout>;
}
