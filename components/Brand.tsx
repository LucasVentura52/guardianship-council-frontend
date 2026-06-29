import { useSiteConfig } from '../lib/site-config';

export default function Brand({
  compact = false,
  light = false,
  className = '',
}: {
  compact?: boolean;
  light?: boolean;
  className?: string;
}) {
  const config = useSiteConfig();
  const name = config.nome_site || 'Conselho Tutelar';

  return (
    <span className={`inline-flex shrink-0 items-center ${className}`}>
      {compact ? (
        <span className={`relative block h-12 w-12 overflow-hidden rounded-xl bg-white shadow-sm ${light ? 'ring-1 ring-white/20' : 'ring-1 ring-slate-200'}`}>
          <img
            src="/images/logo-conselho.jpeg"
            alt={name}
            className="absolute inset-0 h-full w-full scale-[1.38] object-contain"
          />
        </span>
      ) : (
        <span className={`relative block h-[58px] w-40 overflow-hidden rounded-xl bg-[#f4f4f4] sm:w-52 ${light ? 'shadow-lg shadow-slate-950/20 ring-1 ring-white/15' : ''}`}>
          <img
            src="/images/logo-conselho-texto.jpeg"
            alt={name}
            className="absolute left-1/2 top-1/2 h-auto w-[90%] max-w-none -translate-x-1/2 -translate-y-1/2"
          />
        </span>
      )}
    </span>
  );
}
