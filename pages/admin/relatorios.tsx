import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Icon from '../../components/Icon';
import api, { apiError } from '../../lib/api';

type Resumo = Record<string, number>;

export default function Relatorios() {
  const [resumo, setResumo] = useState<Resumo>({});
  const [message, setMessage] = useState('');
  useEffect(() => { api.get('/admin/dashboard').then(({ data }) => setResumo(data.resumo || {})).catch(error => setMessage(apiError(error))); }, []);

  function exportCsv() {
    const rows = [['Indicador', 'Total'], ...Object.entries(resumo).map(([key, value]) => [key.split('_').join(' '), String(value)])];
    const csv = rows.map(row => row.map(value => `"${value.split('"').join('""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-conselho-tutelar-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <AdminLayout title="Relatórios" action={<button className="btn-primary" onClick={exportCsv}><Icon name="chart" />Exportar CSV</button>}>
    {message && <p className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{message}</p>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Object.entries(resumo).map(([key, value]) => <article className="card p-6" key={key}><span className="text-xs font-bold uppercase text-slate-400">{key.split('_').join(' ')}</span><strong className="mt-2 block text-3xl font-extrabold">{value}</strong></article>)}</div>
    <div className="card mt-5 p-6"><h2 className="font-extrabold">Resumo operacional</h2><p className="mt-3 text-sm leading-6 text-slate-600">Este relatório consolida os registros atuais da plataforma. Use a exportação CSV para análise acadêmica, prestação de contas ou acompanhamento periódico.</p></div>
  </AdminLayout>;
}
