import AdminResourcePage from '../../components/AdminResourcePage';

export default function AdminPaginas() {
  return <AdminResourcePage title="Páginas" endpoint="paginas" descriptionField="conteudo" fields={[
    { name: 'titulo', label: 'Título', required: true },
    { name: 'slug', label: 'Slug (opcional)' },
    { name: 'conteudo', label: 'Conteúdo', type: 'textarea', required: true },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'publicado', label: 'Publicado' },
      { value: 'rascunho', label: 'Rascunho' },
      { value: 'inativo', label: 'Inativo' },
    ] },
  ]} />;
}
