import Link from 'next/link';
import PublicLayout from '../components/PublicLayout';
export default function NotFound(){return <PublicLayout title="Página não encontrada"><section className="container-app grid min-h-[55vh] place-items-center text-center"><div><span className="text-8xl font-extrabold text-blue-100">404</span><h1 className="page-title mt-4">Página não encontrada</h1><p className="mt-4 text-slate-500">O endereço acessado não existe ou foi movido.</p><Link href="/" className="btn-primary mt-7">Voltar ao início</Link></div></section></PublicLayout>}
