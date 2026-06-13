import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Logo from '../ui/Logo'
import { EVENT_DATE_LABEL } from '../../lib/constants'

interface Props {
  currentRound: number
  onScrollDown: () => void
}

// Drop a file at public/hero.mp4 to use a custom background video.
const VIDEO_SRC = '/hero.mp4'

export default function Hero({ currentRound, onScrollDown }: Props) {
  const [videoOk, setVideoOk] = useState(true)

  return (
    <section className="relative -mx-6 flex h-[80vh] min-h-[520px] items-center overflow-hidden md:-mx-12">
      {videoOk ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0D2B1D 0%, #2D6A4F 100%)' }}
        />
      )}

      {/* overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(13,43,29,0.6) 0%, rgba(13,43,29,0.85) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-page flex-col items-center gap-10 px-8 text-white md:flex-row md:items-center md:justify-between md:gap-6">
        {/* Left: title + date */}
        <div className="text-center md:max-w-[60%] md:text-left">
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Benvenuto alla Marathonazza
          </h1>
          <div className="mx-auto mt-4 h-[3px] w-3/5 max-w-xs bg-gold md:mx-0" />
          <p className="mt-5 text-lg font-medium text-green-100">
            Giro {currentRound} di 5 · {EVENT_DATE_LABEL}
          </p>
        </div>

        {/* Right: large logo */}
        <div className="shrink-0">
          <Logo height={180} light className="drop-shadow-lg" />
        </div>
      </div>

      <button
        onClick={onScrollDown}
        className="scroll-indicator absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/80 hover:text-white"
        aria-label="Scorri alla classifica"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  )
}
