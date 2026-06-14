import Icon from './Icon';

export default function Brand({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        <Icon name="shield" size={27} />
        <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-400 ring-2 ring-white" />
      </span>
      {!compact && (
        <span className={`text-[17px] font-extrabold uppercase leading-[1.05] ${light ? 'text-white' : 'text-[#0b2f70]'}`}>
          Conselho<br />Tutelar
        </span>
      )}
    </div>
  );
}
