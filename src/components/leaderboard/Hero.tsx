import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Logo from '../ui/Logo'

interface Props {
  currentRound: number
  onScrollDown: () => void
}

const VIDEO_SRC = 'https://www.pexels.com/video/download/3770234/'

export default function Hero({ currentRound, onScrollDown }: Props) {
  const [videoOk, setVideoOk] = useState(true)
  const today = new Date().toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section className="relative -mx-6 flex h-[80vh] min-h-[520px] items-center justify-center overflow-hidden md:-mx-12">
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

      <div className="relative z-10 px-6 text-center text-white">
        <div className="mb-8 flex justify-center">
          <Logo height={56} light />
        </div>
        <h1 className="font-serif text-4xl font-bold sm:text-5xl md:text-6xl">
          Benvenuto alla Marathonazza
        </h1>
        <div className="mx-auto mt-4 h-[3px] w-3/5 max-w-xs bg-gold" />
        <p className="mt-5 text-lg font-medium text-green-100">
          Giro {currentRound} di 5 · {today}
        </p>
      </div>

      <button
        onClick={onScrollDown}
        className="scroll-indicator absolute bottom-6 z-10 text-white/80 hover:text-white"
        aria-label="Scorri alla classifica"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  )
}
