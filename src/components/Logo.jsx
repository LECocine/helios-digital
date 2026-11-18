export function LogoMark({ size = 40, sol = '#E8A33D', terrazas = '#B8492A', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path d="M20 34 A12 12 0 0 1 44 34 Z" fill={sol} />
      <g stroke={sol} strokeWidth="3" strokeLinecap="round">
        <line x1="32" y1="8" x2="32" y2="15" />
        <line x1="14" y1="16" x2="18.5" y2="20.5" />
        <line x1="50" y1="16" x2="45.5" y2="20.5" />
        <line x1="6" y1="32" x2="12" y2="32" />
        <line x1="58" y1="32" x2="52" y2="32" />
      </g>
      <g stroke={terrazas} strokeWidth="3.5" strokeLinecap="round">
        <line x1="6" y1="40" x2="58" y2="40" />
        <line x1="14" y1="47" x2="50" y2="47" />
        <line x1="22" y1="54" x2="42" y2="54" />
      </g>
    </svg>
  )
}

export function Logo({ className = '' }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={40} />
      <span className="font-display text-[22px] font-bold tracking-[0.18em]">HELIOS</span>
    </span>
  )
}
