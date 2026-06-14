import AdminResourcePage from '../../components/AdminResourcePage';

export default function AdminCampanhas() {
  return <AdminResourcePage title="Campanhas" endpoint="campanhas" descriptionField="descricao_curta" fields={[
    { name: 'titulo', label: 'Título', required: true },
    { name: 'slug', label: 'Slug (opcional)' },
    { name: 'descricao_curta', label: 'Descrição curta', required: true },
    { name: 'data_publicacao', label: 'Data de publicação', type: 'date' },
    { name: 'conteudo', label: 'Conteúdo', type: 'textarea', required: true },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'publicado', label: 'Publicado' },
      { value: 'rascunho', label: 'Rascunho' },
      { value: 'inativo', label: 'Inativo' },
    ] },
    { name: 'imagem', label: 'Imagem', type: 'file' },
    { name: 'destaque', label: 'Exibir em destaque', type: 'checkbox' },
  ]} />;
}
