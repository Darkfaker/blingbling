import type { CSSProperties } from 'react'

interface DecorProps {
  size?: number
  style?: CSSProperties
  className?: string
}

export function Avatar({ size = 160, style, className }: DecorProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size} style={style} className={className}>
      <defs>
        <linearGradient id="avatar-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD8A8" />
          <stop offset="0.5" stopColor="#FFB5A7" />
          <stop offset="1" stopColor="#C9A0DC" />
        </linearGradient>
        <linearGradient id="avatar-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3D2A5C" />
          <stop offset="1" stopColor="#1F2347" />
        </linearGradient>
        <linearGradient id="avatar-cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFCF7" />
          <stop offset="1" stopColor="#FFE9D6" />
        </linearGradient>
        <radialGradient id="avatar-cheek" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FF8E9F" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FF8E9F" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="100" fill="url(#avatar-sky)" />
      <path d="M0 140 L30 120 L60 135 L100 110 L140 130 L170 115 L200 138 L200 200 L0 200 Z" fill="#9F7BD3" opacity="0.4" />
      <path d="M0 155 L25 140 L55 152 L90 130 L130 148 L165 135 L200 152 L200 200 L0 200 Z" fill="#6B4FA8" opacity="0.35" />
      <path d="M50 110 Q40 70 70 50 Q100 35 130 50 Q160 70 150 110 L150 145 Q140 130 130 130 L70 130 Q60 130 50 145 Z" fill="url(#avatar-hair)" />
      <rect x="88" y="130" width="24" height="20" fill="#FFE0CC" />
      <ellipse cx="100" cy="100" rx="38" ry="42" fill="#FFE9D6" />
      <path d="M62 90 Q60 65 100 60 Q140 65 138 90 Q138 75 120 70 Q110 80 100 78 Q90 80 80 70 Q62 75 62 90 Z" fill="url(#avatar-hair)" />
      <path d="M68 78 Q80 72 100 75 Q120 72 132 78 Q130 85 120 82 Q110 90 100 88 Q90 90 80 82 Q70 85 68 78 Z" fill="#1F2347" />
      <ellipse cx="85" cy="100" rx="3" ry="4" fill="#1F2347" />
      <ellipse cx="115" cy="100" rx="3" ry="4" fill="#1F2347" />
      <circle cx="86" cy="99" r="1" fill="#FFFCF7" />
      <circle cx="116" cy="99" r="1" fill="#FFFCF7" />
      <circle cx="78" cy="112" r="6" fill="url(#avatar-cheek)" />
      <circle cx="122" cy="112" r="6" fill="url(#avatar-cheek)" />
      <path d="M95 120 Q100 124 105 120" stroke="#D84565" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M75 150 Q100 160 125 150 L130 180 Q100 175 70 180 Z" fill="url(#avatar-cloth)" stroke="#FF8E72" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M85 155 L95 160 L95 170 L80 168 Z" fill="#FF7BA9" stroke="#B8334F" strokeWidth="1" />
      <path d="M115 155 L105 160 L105 170 L120 168 Z" fill="#FF7BA9" stroke="#B8334F" strokeWidth="1" />
      <circle cx="100" cy="162" r="3" fill="#E85D75" />
      <g transform="translate(140 70)">
        <circle cx="0" cy="0" r="2" fill="#FFB5C8" />
        <circle cx="3" cy="-1" r="2" fill="#FFB5C8" />
        <circle cx="2" cy="3" r="2" fill="#FFB5C8" />
        <circle cx="-2" cy="3" r="2" fill="#FFB5C8" />
        <circle cx="-3" cy="-1" r="2" fill="#FFB5C8" />
        <circle cx="0" cy="0" r="1" fill="#FFE0A8" />
      </g>
    </svg>
  )
}

export function SakuraPetal({ size = 32, style, className }: DecorProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} style={style} className={className}>
      <defs>
        <linearGradient id={`sakura-g-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE0EC" />
          <stop offset="1" stopColor="#FFB5C8" />
        </linearGradient>
      </defs>
      <path d="M32 4 Q42 22 32 32 Q22 22 32 4 Z" fill={`url(#sakura-g-${size})`} stroke="#FF7BA9" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M60 32 Q42 42 32 32 Q42 22 60 32 Z" fill={`url(#sakura-g-${size})`} stroke="#FF7BA9" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M32 60 Q22 42 32 32 Q42 42 32 60 Z" fill={`url(#sakura-g-${size})`} stroke="#FF7BA9" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M4 32 Q22 22 32 32 Q22 42 4 32 Z" fill={`url(#sakura-g-${size})`} stroke="#FF7BA9" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="3" fill="#FFE0A8" />
    </svg>
  )
}

export function PaperPlane({ size = 56, style, className }: DecorProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} style={style} className={className}>
      <defs>
        <linearGradient id="plane-pp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFCF7" />
          <stop offset="1" stopColor="#FFD8A8" />
        </linearGradient>
      </defs>
      <path d="M4 32 L60 8 L48 56 L30 38 L4 32 Z" fill="url(#plane-pp)" stroke="#2D3D6B" strokeWidth="2" strokeLinejoin="round" />
      <path d="M30 38 L60 8" stroke="#2D3D6B" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 38 L36 48" stroke="#FF7BA9" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M14 36 L24 32" stroke="#6FCFD5" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M48 18 L42 24" stroke="#7BC8A4" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export function DistantMountains({ style, className }: DecorProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 160" preserveAspectRatio="none" style={{ width: '100%', height: 160, ...style }} className={className}>
      <defs>
        <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9F7BD3" stopOpacity="0.4" />
          <stop offset="1" stopColor="#6B4FA8" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB5A7" stopOpacity="0.5" />
          <stop offset="1" stopColor="#C9A0DC" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path d="M0 100 L60 70 L120 90 L200 50 L280 80 L360 60 L440 85 L520 55 L600 80 L680 65 L750 85 L750 160 L0 160 Z" fill="url(#m1)" />
      <path d="M0 130 L50 110 L100 125 L180 95 L260 115 L340 100 L420 120 L500 100 L580 120 L660 105 L750 120 L750 160 L0 160 Z" fill="url(#m2)" />
    </svg>
  )
}

export function Cloud({ size = 80, style, className }: DecorProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" width={size} height={(size * 60) / 120} style={style} className={className}>
      <defs>
        <linearGradient id={`cloud-c-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFCF7" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFD8E8" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path d="M20 45 Q10 45 10 35 Q10 25 22 24 Q22 12 38 12 Q52 12 56 22 Q70 20 78 30 Q92 30 92 40 Q92 50 80 50 L20 50 Z" fill={`url(#cloud-c-${size})`} stroke="#FFB5C8" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function Horizon({ style, className }: DecorProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 80" preserveAspectRatio="none" style={{ width: '100%', height: 80, ...style }} className={className}>
      <defs>
        <linearGradient id="h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFB5A7" stopOpacity="0" />
          <stop offset="0.3" stopColor="#FF8E72" stopOpacity="0.6" />
          <stop offset="0.7" stopColor="#9F7BD3" stopOpacity="0.6" />
          <stop offset="1" stopColor="#6B8DD6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 30 Q120 20 240 30 T480 28 T750 30" stroke="url(#h)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M0 50 Q150 42 300 48 T600 50 T750 48" stroke="url(#h)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
