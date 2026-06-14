import AdminResourcePage from '../../components/AdminResourcePage';

export default function AdminNoticias() {
  return <AdminResourcePage title="Notícias" endpoint="noticias" descriptionField="resumo" fields={[
    { name: 'titulo', label: 'Título', required: true },
    { name: 'slug', label: 'Slug (opcional)' },
    { name: 'resumo', label: 'Resumo', required: true },
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
