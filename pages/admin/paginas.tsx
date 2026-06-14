import AdminResourcePage from '../../components/AdminResourcePage';

export default function AdminPaginas() {
  return <AdminResourcePage title="Páginas" endpoint="paginas" descriptionField="conteudo" fields={[
    { name: 'titulo', label: 'Título', required: true },
    { name: 'slug', label: 'Slug (opcional)' },
    { name: 'chamada', label: 'Chamada acima do título' },
    { name: 'resumo', label: 'Resumo do cabeçalho', type: 'textarea', required: true },
    { name: 'icone', label: 'Ícone', type: 'select', options: [
      { value: 'document', label: 'Documento' },
      { value: 'users', label: 'Pessoas' },
      { value: 'book', label: 'Livro' },
      { value: 'heart', label: 'Coração' },
      { value: 'phone', label: 'Telefone' },
      { value: 'info', label: 'Informação' },
      { value: 'email', label: 'E-mail' },
      { value: 'shield', label: 'Proteção' },
    ] },
    { name: 'conteudo', label: 'Conteúdo (use ## para títulos e - para itens)', type: 'textarea', required: true },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'publicado', label: 'Publicado' },
      { value: 'rascunho', label: 'Rascunho' },
      { value: 'inativo', label: 'Inativo' },
    ] },
  ]} />;
}
