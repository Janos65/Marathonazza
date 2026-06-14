import { useState } from 'react'
import { createPortal } from 'react-dom'

type Ring = 'gold' | 'silver' | 'bronze' | 'none'

interface Props {
  name: string
  photoUrl?: string | null
  /** pixel diameter */
  size?: number
  ring?: Ring
  /** explicit ring color override (wins over `ring`) */
  ringColor?: string
  /** click the photo to open a full, uncropped lightbox (default true) */
  enlargeable?: boolean
  className?: string
}

const ringPreset: Record<Ring, string> = {
  gold: '#E8CE7E',
  silver: '#C9CFC4',
  bronze: '#D69A5C',
  none: 'rgba(201,168,76,.32)',
}

/** "Villanova / Donadini" -> "VD"; single word -> first 2 letters. */
export function initialsFromName(name: string): string {
  const parts = name
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function Avatar({
  name,
  photoUrl,
  size = 40,
  ring = 'none',
  ringColor,
  enlargeable = true,
  className = '',
}: Props) {
  const [errored, setErrored] = useState(false)
  const [open, setOpen] = useState(false)
  const showImg = photoUrl && !errored
  const canEnlarge = !!showImg && enlargeable
  const border = ringColor ?? ringPreset[ring]
  const borderWidth = ring === 'none' && !ringColor ? 1.5 : 2
  const fontSize = Math.round(size * 0.4)

  return (
    <>
      <div
        className={`shrink-0 overflow-hidden rounded-full ${canEnlarge ? 'cursor-zoom-in' : ''} ${className}`}
        style={{
          width: size,
          maxWidth: '100%',
          aspectRatio: '1 / 1',
          border: `${borderWidth}px solid ${border}`,
          boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
        }}
        onClick={
          canEnlarge
            ? (e) => {
                e.stopPropagation()
                setOpen(true)
              }
            : undefined
        }
        role={canEnlarge ? 'button' : undefined}
        aria-label={canEnlarge ? `Ingrandisci foto ${name}` : undefined}
      >
        {showImg ? (
          <img
            src={photoUrl as string}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center font-serif font-bold"
            style={{
              background: 'linear-gradient(145deg,#2D6A4F,#16331f)',
              color: '#EAF2E8',
              fontSize,
            }}
          >
            {initialsFromName(name)}
          </div>
        )}
      </div>

      {open && createPortal(
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: 'rgba(7,21,13,.86)', backdropFilter: 'blur(8px)', animation: 'mzFadeIn .2s ease' }}
        >
          <div
            className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'mzModalIn .28s cubic-bezier(.16,.84,.3,1)' }}
          >
            <img
              src={photoUrl as string}
              alt={name}
              className="block max-h-[82vh] max-w-[90vw] rounded-2xl object-contain"
              style={{ boxShadow: '0 40px 100px -30px rgba(0,0,0,.9)', border: '1px solid rgba(201,168,76,.3)' }}
            />
            <div className="mt-3 font-serif text-[18px] font-semibold text-[#F4EFE3]">{name}</div>
            <button
              onClick={() => setOpen(false)}
              className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full text-[#f4efe3] sm:right-2 sm:top-2"
              style={{ background: 'rgba(7,21,13,.7)', border: '1px solid rgba(255,255,255,.18)' }}
              aria-label="Chiudi"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
