import Link from 'next/link';
import Icon from './Icon';

export default function EmergencyBar() {
  return (
    <div className="bg-[#071f46] text-white">
      <div className="container-app flex min-h-10 items-center justify-center gap-2 py-2 text-[11px] font-semibold sm:text-xs md:justify-between md:gap-4">
        <p className="hidden items-center gap-2 text-blue-100 md:flex">
          <Icon name="shield" size={15} className="text-emerald-400" />
          Informação segura para proteger crianças e adolescentes
        </p>
        <div className="flex min-w-0 items-center justify-center gap-2 md:ml-auto sm:gap-4">
          <a href="tel:100" className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 transition hover:bg-white/20">
            <Icon name="phone" size={14} className="text-emerald-400" />
            <span>Disque 100</span>
          </a>
          <a href="tel:190" className="flex shrink-0 items-center gap-1.5 rounded-full bg-rose-500/15 px-3 py-1.5 text-rose-100 transition hover:bg-rose-500/25">
            <span className="hidden sm:inline">Risco imediato:</span> 190
          </a>
          <Link href="/como-acionar" className="hidden text-blue-100 underline-offset-4 hover:text-white hover:underline sm:inline">
            Saiba quando acionar
          </Link>
        </div>
      </div>
    </div>
  );
}
