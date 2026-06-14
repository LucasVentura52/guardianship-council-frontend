import AdminResourcePage from '../../components/AdminResourcePage';

export default function Telefones() {
  return <AdminResourcePage title="Telefones Úteis" endpoint="telefones-uteis" descriptionField="telefone" fields={[
    { name: 'titulo', label: 'Nome do serviço', required: true },
    { name: 'telefone', label: 'Telefone', required: true },
    { name: 'descricao', label: 'Descrição', type: 'textarea' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'publicado', label: 'Publicado' },
      { value: 'inativo', label: 'Inativo' },
    ] },
  ]} />;
}
