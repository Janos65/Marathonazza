import { useRef, useState } from 'react'
import { uploadImage } from '../../lib/storage'

const MAX = 5 * 1024 * 1024 // 5MB

interface Props {
  holeNumber: number
  mapUrl: string | null
  onUpload: (holeNumber: number, url: string) => Promise<void>
}

const UploadIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
)

export default function MapUpload({ holeNumber, mapUrl, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localUrl, setLocalUrl] = useState<string | null>(mapUrl)

  async function handleFile(file: File) {
    setError(null)
    setBusy(true)
    const res = await uploadImage('hole-maps', String(holeNumber), file, MAX)
    if (res.error) {
      setError(res.error)
      setBusy(false)
      return
    }
    await onUpload(holeNumber, res.url as string)
    setLocalUrl(res.url ?? null)
    setBusy(false)
  }

  return (
    <div className="overflow-hidden rounded-[14px]" style={{ border: '1px solid #EFE9DA', background: '#FAF7EF' }}>
      <div className="relative flex h-[84px] items-center justify-center" style={localUrl ? undefined : { background: 'repeating-linear-gradient(135deg,#EAE3D2 0 10px,#E4DCC8 10px 20px)' }}>
        {localUrl ? (
          <img src={localUrl} alt={`Mappa buca ${holeNumber}`} className="h-full w-full object-cover" />
        ) : (
          <span className="font-mono text-[13px] font-bold text-[#9a947f]">BUCA {holeNumber}</span>
        )}
      </div>
      <div className="flex items-center justify-between gap-1 p-2.5">
        {error ? <span className="text-[10px] text-[#C0392B]">{error}</span> : <span />}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex items-center gap-[5px] rounded-[9px] bg-white px-3 py-[7px] text-[11.5px] font-semibold text-[#2D6A4F] transition-all hover:bg-[#1B4332] hover:text-white"
          style={{ border: '1px solid #DCD5C4' }}
        >
          {UploadIcon}
          {busy ? '…' : 'Carica mappa'}
        </button>
      </div>
    </div>
  )
}
