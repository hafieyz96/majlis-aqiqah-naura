type FloralVariant = 'full' | 'light' | 'medium'

interface FloralCornerProps {
  filterId: string
  className?: string
  variant?: FloralVariant
}

function Flower({
  x,
  y,
  rotate,
  size,
  outer,
  mid,
  center,
  opacity = 0.9,
}: {
  x: number
  y: number
  rotate: number
  size: number
  outer: string
  mid: string
  center: string
  opacity?: number
}) {
  const petalRy = size * 0.45
  const petalRx = size * 0.295
  const midRy = size * 0.25
  const midRx = size * 0.194
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
      <circle r={size * 0.6} fill={outer} opacity={0.22} />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={`o-${deg}`}
          cx={0}
          cy={-size * 0.27}
          rx={petalRx}
          ry={petalRy}
          fill={outer}
          opacity={0.85}
          transform={`rotate(${deg})`}
        />
      ))}
      {[36, 108, 180, 252, 324].map((deg) => (
        <ellipse
          key={`m-${deg}`}
          cx={0}
          cy={-size * 0.15}
          rx={midRx}
          ry={midRy}
          fill={mid}
          opacity={0.7}
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r={size * 0.115} fill={center} opacity={0.9} />
      <circle r={size * 0.05} fill="#FCEEF3" opacity={0.7} />
    </g>
  )
}

export function FloralCorner({
  filterId,
  className,
  variant = 'medium',
}: FloralCornerProps) {
  const full = variant === 'full'
  const light = variant === 'light'

  return (
    <svg
      className={className}
      viewBox="-14 -14 238 238"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`} opacity={0.5}>
        <ellipse cx="70" cy="60" rx="86" ry="70" fill="#F6D6E0" />
        <ellipse cx="150" cy="118" rx="62" ry="52" fill="#FCEEF3" />
        {full && (
          <ellipse cx="42" cy="150" rx="54" ry="62" fill="#F6D6E0" opacity={0.8} />
        )}
      </g>
      <g opacity={full ? 0.45 : 0.3}>
        <path
          d="M -6 -4 C 52 26, 96 74, 118 146"
          stroke="#C9A2B4"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M 2 8 C 36 56, 48 108, 42 174"
          stroke="#C89B7B"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        {full && (
          <path
            d="M -4 2 C 44 12, 84 30, 112 58"
            stroke="#C9A2B4"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        )}
      </g>
      <g>
        <ellipse
          cx="54"
          cy="36"
          rx="9.5"
          ry="15"
          fill="#C9A2B4"
          opacity={0.5}
          transform="rotate(38 54 36)"
        />
        <ellipse
          cx="86"
          cy="62"
          rx="9"
          ry="14"
          fill="#E3C9B8"
          opacity={0.55}
          transform="rotate(44 86 62)"
        />
        <ellipse
          cx="112"
          cy="96"
          rx="8.5"
          ry="13"
          fill="#C9A2B4"
          opacity={0.45}
          transform="rotate(52 112 96)"
        />
        <ellipse
          cx="128"
          cy="136"
          rx="8"
          ry="12"
          fill="#E3C9B8"
          opacity={0.5}
          transform="rotate(62 128 136)"
        />
        <ellipse
          cx="30"
          cy="72"
          rx="8.5"
          ry="13"
          fill="#E3C9B8"
          opacity={0.5}
          transform="rotate(-24 30 72)"
        />
        <ellipse
          cx="44"
          cy="112"
          rx="9"
          ry="14"
          fill="#C9A2B4"
          opacity={0.42}
          transform="rotate(-14 44 112)"
        />
        <ellipse
          cx="46"
          cy="158"
          rx="8"
          ry="12.5"
          fill="#E3C9B8"
          opacity={0.48}
          transform="rotate(-6 46 158)"
        />
        {full && (
          <>
            <ellipse
              cx="62"
              cy="14"
              rx="8.5"
              ry="13"
              fill="#E3C9B8"
              opacity={0.45}
              transform="rotate(68 62 14)"
            />
            <ellipse
              cx="92"
              cy="32"
              rx="8"
              ry="12"
              fill="#C9A2B4"
              opacity={0.4}
              transform="rotate(78 92 32)"
            />
            <ellipse
              cx="116"
              cy="58"
              rx="7.5"
              ry="11"
              fill="#E3C9B8"
              opacity={0.38}
              transform="rotate(88 116 58)"
            />
          </>
        )}
      </g>
      <Flower
        x={62}
        y={54}
        rotate={-12}
        size={68}
        outer="#F6D6E0"
        mid="#D98CA4"
        center="#C89B7B"
        opacity={light ? 0.6 : full ? 0.95 : 0.6}
      />
      {full && (
        <>
          <Flower
            x={124}
            y={112}
            rotate={26}
            size={50}
            outer="#FCEEF3"
            mid="#F6D6E0"
            center="#D98CA4"
            opacity={0.9}
          />
          <Flower
            x={24}
            y={124}
            rotate={8}
            size={38}
            outer="#D98CA4"
            mid="#F6D6E0"
            center="#FCEEF3"
            opacity={0.75}
          />
          <g transform="translate(104 40) rotate(38)">
            <ellipse rx="4.95" ry="9" fill="#D98CA4" opacity={0.8} />
            <path
              d="M -4.5 4.5 Q 0 0.9 4.5 4.5"
              stroke="#C89B7B"
              strokeWidth="1"
              fill="none"
              opacity={0.5}
            />
          </g>
          <g transform="translate(70 140) rotate(-18)">
            <ellipse rx="4.4" ry="8" fill="#F6D6E0" opacity={0.8} />
            <path
              d="M -4 4 Q 0 0.8 4 4"
              stroke="#C89B7B"
              strokeWidth="1"
              fill="none"
              opacity={0.5}
            />
          </g>
          <circle
            cx="22"
            cy="94"
            r="2.8"
            fill="#FCEEF3"
            stroke="#D98CA4"
            strokeWidth="0.9"
            opacity={0.7}
          />
        </>
      )}
      <circle
        cx="150"
        cy="70"
        r="3.4"
        fill="#FCEEF3"
        stroke="#C89B7B"
        strokeWidth="0.9"
        opacity={0.75}
      />
    </svg>
  )
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2 l2.4 7.6 L22 12 l-7.6 2.4 L12 22 l-2.4-7.6 L2 12 l7.6-2.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Cloud({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 80" fill="none" aria-hidden="true">
      <path
        d="M40 60 a20 20 0 0 1 8-38 a26 26 0 0 1 50-8 a22 22 0 0 1 36 14 a18 18 0 0 1 12 32Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Wave({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 60 C 240 110, 480 10, 720 55 C 960 100, 1200 20, 1440 65 L1440 120 L0 120Z"
        fill="#FFF8F3"
        opacity={0.55}
      />
      <path
        d="M0 80 C 260 120, 520 30, 780 70 C 1040 110, 1260 40, 1440 85 L1440 120 L0 120Z"
        fill="#FFF8F3"
      />
    </svg>
  )
}

export function Petal({
  className,
  fill = '#D98CA4',
  vein = '#FCEEF3',
}: {
  className?: string
  fill?: string
  vein?: string
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 22 C 4 14, 6 5, 12 2 C 18 5, 20 14, 12 22Z"
        fill={fill}
        opacity={0.85}
      />
      <path d="M12 20 L12 5" stroke={vein} strokeWidth="1" opacity={0.8} />
    </svg>
  )
}

export function Flourish({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 14"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M6 7 C 50 1, 90 13, 110 7 C 130 1, 170 13, 214 7"
        stroke="#C89B7B"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        opacity={0.75}
      />
      <circle cx="110" cy="7" r="2.2" fill="#D98CA4" />
    </svg>
  )
}

export function JawiTitle({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <span className={`jawi-title ${className ?? ''}`.trim()}>
      <Petal className="jawi-title__petal jawi-title__petal--left" />
      <Petal
        className="jawi-title__petal jawi-title__petal--right"
        fill="#C89B7B"
        vein="#FFF8F3"
      />
      <Sparkle className="jawi-title__sparkle jawi-title__sparkle--a" />
      <Sparkle className="jawi-title__sparkle jawi-title__sparkle--b" />
      <span className="jawi-title__word" lang="ar" dir="rtl">
        {text}
      </span>
      <Flourish className="jawi-title__flourish" />
    </span>
  )
}

export function LocationPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 4 C 15 4, 8 11, 8 20 C 8 32, 24 44, 24 44 C 24 44, 40 32, 40 20 C 40 11, 33 4, 24 4Z"
        fill="#F6D6E0"
        stroke="#8B4C70"
        strokeWidth="2"
      />
      <circle cx="24" cy="20" r="6" fill="#FFFFFF" stroke="#8B4C70" strokeWidth="2" />
    </svg>
  )
}

export function Ribbon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 40" fill="none" aria-hidden="true">
      <path
        d="M60 20 C 45 2, 18 6, 22 20 C 18 34, 45 38, 60 20 C 75 2, 102 6, 98 20 C 102 34, 75 38, 60 20Z"
        stroke="#C89B7B"
        strokeWidth="2"
        fill="#F6D6E0"
        fillOpacity={0.5}
      />
      <circle cx="60" cy="20" r="4" fill="#C89B7B" />
    </svg>
  )
}

export function SectionTitle({
  script,
  heading,
}: {
  script: string
  heading: string
}) {
  return (
    <div className="section-title">
      <p className="section-title__script">{script}</p>
      <h2 className="section-title__heading">{heading}</h2>
      <div className="section-title__divider" aria-hidden="true">
        <span />
        <Sparkle className="section-title__sparkle" />
        <span />
      </div>
    </div>
  )
}

export function ImagePlaceholder({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <div className={`img-placeholder ${className ?? ''}`.trim()} aria-hidden={!label}>
      <span>{label}</span>
    </div>
  )
}
