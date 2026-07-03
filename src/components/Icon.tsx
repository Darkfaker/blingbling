import type { CSSProperties, ReactNode } from 'react'

export type IconName =
  | 'icon-todos' | 'icon-pomodoro' | 'icon-qrcode' | 'icon-reading'
  | 'icon-feather' | 'icon-tomato' | 'icon-link' | 'icon-book' | 'icon-moon' | 'icon-leaf'

interface IconProps {
  name: IconName
  size?: number
  style?: CSSProperties
  className?: string
}

/**
 * 工具图标 (88x88 设计稿，可任意缩放)
 */
export function Icon({ name, size = 56, style, className }: IconProps) {
  const common = { width: size, height: size, style, className } as const
  switch (name) {
    case 'icon-todos':
      return <TodosIcon {...common} />
    case 'icon-pomodoro':
      return <PomodoroIcon {...common} />
    case 'icon-qrcode':
      return <QrcodeIcon {...common} />
    case 'icon-reading':
      return <ReadingIcon {...common} />
    case 'icon-feather':
      return <FeatherIcon {...common} />
    case 'icon-tomato':
      return <TomatoIcon {...common} />
    case 'icon-link':
      return <LinkIcon {...common} />
    case 'icon-book':
      return <BookIcon {...common} />
    case 'icon-leaf':
      return <LeafIcon {...common} />
    case 'icon-moon':
      return <MoonIcon {...common} />
  }
}

function svgWrap(props: { width: number; height: number; style?: CSSProperties; className?: string; children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 88 88"
      width={props.width}
      height={props.height}
      style={props.style}
      className={props.className}
    >
      {props.children}
    </svg>
  )
}

function TodosIcon(props: { width: number; height: number; style?: CSSProperties; className?: string }) {
  return svgWrap({
    ...props,
    children: <>
      <defs>
        <linearGradient id="todos-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FFD8A8" />
          <stop offset="1" stop-color="#FF8E72" />
        </linearGradient>
        <linearGradient id="todos-page" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#FFFCF7" />
          <stop offset="1" stop-color="#FFE9D6" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="80" height="80" rx="22" fill="url(#todos-bg)" />
      <rect x="4" y="4" width="80" height="80" rx="22" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <rect x="18" y="16" width="46" height="58" rx="6" fill="url(#todos-page)" stroke="#FF6B45" strokeWidth="2" strokeLinejoin="round" />
      <line x1="26" y1="28" x2="50" y2="28" stroke="#FF8E72" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="26" y1="38" x2="56" y2="38" stroke="#FFB592" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="26" y1="48" x2="46" y2="48" stroke="#FFB592" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="26" cy="60" r="3" fill="#FF8E72" />
      <line x1="33" y1="60" x2="52" y2="60" stroke="#FFB592" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M62 12 L70 20 L62 20 Z" fill="#FFFCF7" stroke="#FF6B45" strokeWidth="2" strokeLinejoin="round" />
    </>,
  })
}

function PomodoroIcon(props: { width: number; height: number; style?: CSSProperties; className?: string }) {
  return svgWrap({
    ...props,
    children: <>
      <defs>
        <linearGradient id="p-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FFB5C8" />
          <stop offset="1" stop-color="#E85D75" />
        </linearGradient>
        <radialGradient id="p-tomato" cx="0.35" cy="0.32" r="0.7">
          <stop offset="0" stop-color="#FF8E9F" />
          <stop offset="1" stop-color="#D84565" />
        </radialGradient>
      </defs>
      <rect x="4" y="4" width="80" height="80" rx="22" fill="url(#p-bg)" />
      <rect x="4" y="4" width="80" height="80" rx="22" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <circle cx="44" cy="50" r="22" fill="url(#p-tomato)" stroke="#B8334F" strokeWidth="2" />
      <path d="M32 32 Q44 18 56 32" stroke="#7BC8A4" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M44 22 L40 16 M44 22 L48 16 M44 22 L44 14" stroke="#5BB87A" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="36" cy="44" r="3" fill="#FFC8D2" opacity="0.8" />
      <line x1="44" y1="50" x2="44" y2="38" stroke="#FFFCF7" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="50" x2="52" y2="54" stroke="#FFFCF7" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="44" cy="50" r="2" fill="#FFFCF7" />
    </>,
  })
}

function QrcodeIcon(props: { width: number; height: number; style?: CSSProperties; className?: string }) {
  return svgWrap({
    ...props,
    children: <>
      <defs>
        <linearGradient id="q-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#B5E8EE" />
          <stop offset="1" stop-color="#6FCFD5" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="80" height="80" rx="22" fill="url(#q-bg)" />
      <rect x="4" y="4" width="80" height="80" rx="22" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <rect x="18" y="18" width="22" height="22" rx="4" fill="#FFFCF7" stroke="#2D3D6B" strokeWidth="2.5" />
      <rect x="22" y="22" width="6" height="6" fill="#2D3D6B" />
      <rect x="28" y="28" width="6" height="6" fill="#2D3D6B" />
      <rect x="48" y="18" width="22" height="22" rx="4" fill="#FFFCF7" stroke="#2D3D6B" strokeWidth="2.5" />
      <rect x="52" y="22" width="6" height="6" fill="#2D3D6B" />
      <rect x="58" y="28" width="6" height="6" fill="#2D3D6B" />
      <rect x="18" y="48" width="22" height="22" rx="4" fill="#FFFCF7" stroke="#2D3D6B" strokeWidth="2.5" />
      <rect x="22" y="52" width="6" height="6" fill="#2D3D6B" />
      <rect x="28" y="58" width="6" height="6" fill="#2D3D6B" />
      <rect x="48" y="48" width="4" height="4" fill="#2D3D6B" />
      <rect x="54" y="48" width="4" height="4" fill="#2D3D6B" />
      <rect x="60" y="48" width="4" height="4" fill="#2D3D6B" />
      <rect x="48" y="54" width="4" height="4" fill="#2D3D6B" />
      <rect x="60" y="54" width="4" height="4" fill="#2D3D6B" />
      <rect x="48" y="60" width="4" height="4" fill="#2D3D6B" />
      <rect x="54" y="60" width="4" height="4" fill="#2D3D6B" />
      <rect x="60" y="60" width="4" height="4" fill="#2D3D6B" />
    </>,
  })
}

function ReadingIcon(props: { width: number; height: number; style?: CSSProperties; className?: string }) {
  return svgWrap({
    ...props,
    children: <>
      <defs>
        <linearGradient id="r-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#D4BFF0" />
          <stop offset="1" stop-color="#9F7BD3" />
        </linearGradient>
        <linearGradient id="r-page" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#FFFCF7" />
          <stop offset="1" stop-color="#F0E4FF" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="80" height="80" rx="22" fill="url(#r-bg)" />
      <rect x="4" y="4" width="80" height="80" rx="22" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <path d="M44 22 L18 30 L18 64 L44 58 L70 64 L70 30 Z" fill="url(#r-page)" stroke="#6B4FA8" strokeWidth="2" strokeLinejoin="round" />
      <line x1="44" y1="22" x2="44" y2="58" stroke="#6B4FA8" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="38" x2="38" y2="36" stroke="#9F7BD3" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="44" x2="38" y2="42" stroke="#C9A0DC" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="50" x2="36" y2="48" stroke="#C9A0DC" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="36" x2="64" y2="38" stroke="#9F7BD3" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="42" x2="64" y2="44" stroke="#C9A0DC" strokeWidth="2" strokeLinecap="round" />
      <line x1="52" y1="48" x2="64" y2="50" stroke="#C9A0DC" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 14 L50 14 L44 8 Z" fill="#FFFCF7" stroke="#6B4FA8" strokeWidth="2" strokeLinejoin="round" />
    </>,
  })
}

function FeatherIcon(props: { width: number; height: number; style?: CSSProperties; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={props.width} height={props.height} style={props.style} className={props.className} fill="none">
      <defs>
        <linearGradient id="feather-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC78A" />
          <stop offset="1" stopColor="#FF8E72" />
        </linearGradient>
      </defs>
      <path d="M48 12 Q42 18 38 28 Q34 40 22 50 L16 50 L22 42 Q30 30 40 20 Q44 14 50 12 Z" fill="url(#feather-g)" stroke="#B8612B" strokeWidth="2" strokeLinejoin="round" />
      <path d="M48 12 L42 18 M40 20 L34 26 M30 32 L24 38 M22 42 L18 46" stroke="#FFFCF7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="16" y1="50" x2="22" y2="56" stroke="#5C3A1A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function TomatoIcon(props: { width: number; height: number; style?: CSSProperties; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={props.width} height={props.height} style={props.style} className={props.className} fill="none">
      <defs>
        <radialGradient id="tomato-t" cx="0.35" cy="0.32" r="0.7">
          <stop offset="0" stopColor="#FF8E9F" />
          <stop offset="1" stopColor="#D84565" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="36" r="18" fill="url(#tomato-t)" stroke="#B8334F" strokeWidth="2" />
      <path d="M22 22 Q32 12 42 22" stroke="#7BC8A4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M32 16 L28 10 M32 16 L36 10 M32 16 L32 8" stroke="#5BB87A" strokeWidth="2" strokeLinecap="round" />
      <circle cx="26" cy="32" r="2" fill="#FFC8D2" opacity="0.8" />
    </svg>
  )
}

function LinkIcon(props: { width: number; height: number; style?: CSSProperties; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={props.width} height={props.height} style={props.style} className={props.className} fill="none">
      <defs>
        <linearGradient id="link-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B5E8EE" />
          <stop offset="1" stopColor="#7BC8A4" />
        </linearGradient>
      </defs>
      <path d="M26 38 L26 26 Q26 16 36 16 L40 16" stroke="url(#link-bg)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M38 26 L26 38" stroke="#2D3D6B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="42" cy="18" r="4" fill="#6FCFD5" stroke="#2D3D6B" strokeWidth="2" />
      <circle cx="22" cy="42" r="4" fill="#7BC8A4" stroke="#2D3D6B" strokeWidth="2" />
      <circle cx="48" cy="48" r="3" fill="#FF8E72" stroke="#2D3D6B" strokeWidth="2" />
    </svg>
  )
}

function BookIcon(props: { width: number; height: number; style?: CSSProperties; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={props.width} height={props.height} style={props.style} className={props.className} fill="none">
      <defs>
        <linearGradient id="book-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D4BFF0" />
          <stop offset="1" stopColor="#9F7BD3" />
        </linearGradient>
        <linearGradient id="book-p" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFCF7" />
          <stop offset="1" stopColor="#F0E4FF" />
        </linearGradient>
      </defs>
      <path d="M32 16 L10 22 L10 50 L32 46 L54 50 L54 22 Z" fill="url(#book-p)" stroke="#6B4FA8" strokeWidth="2" strokeLinejoin="round" />
      <line x1="32" y1="16" x2="32" y2="46" stroke="#6B4FA8" strokeWidth="2" />
      <line x1="16" y1="30" x2="28" y2="28" stroke="#9F7BD3" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="36" x2="28" y2="34" stroke="#C9A0DC" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="36" y1="28" x2="48" y2="30" stroke="#9F7BD3" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="36" y1="34" x2="48" y2="36" stroke="#C9A0DC" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon(props: { width: number; height: number; style?: CSSProperties; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={props.width} height={props.height} style={props.style} className={props.className} fill="none">
      <defs>
        <linearGradient id="moon-m" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD8A8" />
          <stop offset="1" stopColor="#FF8E72" />
        </linearGradient>
      </defs>
      <path d="M44 12 A24 24 0 1 0 52 44 A18 18 0 0 1 44 12 Z" fill="url(#moon-m)" stroke="#B8612B" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="18" cy="20" r="1.5" fill="#FFD8A8" />
      <circle cx="14" cy="38" r="1.2" fill="#FFD8A8" />
      <circle cx="22" cy="50" r="1.5" fill="#FFD8A8" />
    </svg>
  )
}

function LeafIcon(props: { width: number; height: number; style?: CSSProperties; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={props.width} height={props.height} style={props.style} className={props.className} fill="none">
      <defs>
        <linearGradient id="leaf-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7BC8A4" />
          <stop offset="1" stopColor="#5BB87A" />
        </linearGradient>
      </defs>
      <path d="M12 52 Q12 24 36 14 Q56 8 56 8 Q56 28 42 46 Q28 58 12 52 Z" fill="url(#leaf-g)" stroke="#3A8E5C" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 50 L42 22 M22 50 L48 24 M30 50 L52 28" stroke="#FFFCF7" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M12 52 L4 60" stroke="#3A8E5C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
