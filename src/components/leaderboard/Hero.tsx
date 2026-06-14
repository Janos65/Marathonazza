import { useState } from 'react'
import { EVENT_DATE_LABEL, TOTAL_ROUNDS, NUM_HOLES } from '../../lib/constants'

interface Props {
  currentRound: number
  pairsCount: number
  onScrollDown: () => void
}

const VIDEO_SRC = '/hero.mp4'

const dust = [
  { left: '24%', size: 4, dur: '9s', delay: '0s' },
  { left: '46%', size: 3, dur: '11s', delay: '2s' },
  { left: '62%', size: 5, dur: '8s', delay: '1s' },
  { left: '78%', size: 3, dur: '12s', delay: '3s' },
  { left: '34%', size: 3, dur: '10s', delay: '4s' },
]

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-[clamp(22px,3.4vw,32px)] font-bold text-[#F4EFE3]">{value}</div>
      <div className="mt-1 font-mono text-[10px] tracking-[2.5px] text-[#f4efe380]">{label}</div>
    </div>
  )
}

export default function Hero({ currentRound, pairsCount, onScrollDown }: Props) {
  const [videoOk, setVideoOk] = useState(true)

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: 'calc(100vh - 64px)', minHeight: 620 }}
    >
      {videoOk ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoOk(false)}
          className="absolute inset-0 z-0 h-full w-full object-cover"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'linear-gradient(135deg,#0D2B1D 0%,#2D6A4F 100%)' }}
        />
      )}

      {/* grade */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,21,13,.44) 0%, rgba(7,21,13,.34) 42%, rgba(7,21,13,.84) 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 30%, rgba(201,168,76,.14) 0%, rgba(201,168,76,0) 55%), radial-gradient(100% 100% at 50% 120%, rgba(7,21,13,.9), rgba(7,21,13,0) 60%)',
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          mixBlendMode: 'overlay',
          background:
            'linear-gradient(120deg, rgba(13,43,29,.5), rgba(0,0,0,0) 40%, rgba(201,168,76,.18))',
        }}
      />

      {/* light rays */}
      <div
        className="absolute z-[2]"
        style={{
          top: '-20%',
          left: '18%',
          width: 140,
          height: '130%',
          background:
            'linear-gradient(180deg, rgba(232,206,126,0), rgba(232,206,126,.35), rgba(232,206,126,0))',
          transform: 'rotate(14deg)',
          filter: 'blur(22px)',
          animation: 'mzRay 7s ease-in-out infinite',
        }}
      />
      <div
        className="absolute z-[2]"
        style={{
          top: '-20%',
          right: '22%',
          width: 90,
          height: '130%',
          background:
            'linear-gradient(180deg, rgba(232,206,126,0), rgba(232,206,126,.28), rgba(232,206,126,0))',
          transform: 'rotate(-10deg)',
          filter: 'blur(20px)',
          animation: 'mzRay 9s ease-in-out infinite 1.5s',
        }}
      />

      {/* gold dust */}
      {dust.map((d, i) => (
        <div
          key={i}
          className="absolute bottom-0 z-[3] rounded-full"
          style={{
            left: d.left,
            width: d.size,
            height: d.size,
            background: '#E8CE7E',
            boxShadow: '0 0 8px 2px rgba(232,206,126,.7)',
            animation: `mzDust ${d.dur} linear infinite ${d.delay}`,
          }}
        />
      ))}

      {/* content */}
      <div className="relative z-[5] max-w-[1000px] px-6 text-center">
        <img
          src="/logo-gold.png"
          alt=""
          className="mx-auto mb-6 h-[74px] w-[74px] object-contain"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.5))', animation: 'mzScaleIn 1s cubic-bezier(.16,.84,.3,1) both' }}
        />
        <div
          className="mb-[18px] font-mono text-[clamp(10px,1.5vw,13px)] tracking-[6px] text-[#E8CE7E]"
          style={{ animation: 'mzFadeUp .9s cubic-bezier(.16,.84,.3,1) .25s both' }}
        >
          BENVENUTO ALLA
        </div>
        <h1
          className="m-0 font-serif font-extrabold text-[#FBF7EC]"
          style={{
            fontSize: 'clamp(50px,11vw,140px)',
            lineHeight: 0.92,
            letterSpacing: '-1px',
            textShadow: '0 20px 60px rgba(0,0,0,.55)',
            animation: 'mzFadeUp 1s cubic-bezier(.16,.84,.3,1) .42s both',
          }}
        >
          Marathonazza
        </h1>
        <div
          className="mx-auto mt-[26px] h-[3px] w-[min(58%,420px)]"
          style={{
            background: 'linear-gradient(90deg, rgba(201,168,76,0), #E8CE7E, rgba(201,168,76,0))',
            transformOrigin: 'center',
            animation: 'mzLineGrow 1.1s cubic-bezier(.7,0,.3,1) .85s both',
          }}
        />
        <p
          className="mx-0 mb-0 mt-6 text-[clamp(15px,2.2vw,20px)] font-medium text-[#f4efe3d1]"
          style={{ animation: 'mzFadeUp .9s cubic-bezier(.16,.84,.3,1) .98s both' }}
        >
          Giro <strong className="font-bold text-[#E8CE7E]">{currentRound} di {TOTAL_ROUNDS}</strong>{' '}
          · in corso &nbsp;·&nbsp; {EVENT_DATE_LABEL}
        </p>
        <div
          className="mt-[34px] flex items-center justify-center gap-[clamp(20px,4vw,52px)]"
          style={{ animation: 'mzFadeUp .9s cubic-bezier(.16,.84,.3,1) 1.1s both' }}
        >
          <Stat value={pairsCount || 14} label="COPPIE" />
          <div className="h-[34px] w-px" style={{ background: 'rgba(201,168,76,.3)' }} />
          <Stat value={TOTAL_ROUNDS} label="GIRI" />
          <div className="h-[34px] w-px" style={{ background: 'rgba(201,168,76,.3)' }} />
          <Stat value={NUM_HOLES} label="BUCHE" />
        </div>
      </div>

      {/* scroll indicator */}
      <button
        onClick={onScrollDown}
        className="absolute bottom-6 left-1/2 z-[5] flex -translate-x-1/2 flex-col items-center gap-[7px]"
        style={{ animation: 'mzFadeIn 1s ease 1.5s both' }}
        aria-label="Scorri alla classifica"
      >
        <span className="font-mono text-[9.5px] tracking-[3px] text-[#f4efe399]">CLASSIFICA</span>
        <span style={{ animation: 'mzBob 1.8s ease-in-out infinite' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8CE7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
    </section>
  )
}
