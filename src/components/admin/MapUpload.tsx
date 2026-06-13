import { useRef, useState } from 'react'
import { Upload, MapPin } from 'lucide-react'
import { uploadImage } from '../../lib/storage'
import { SPECIAL_HOLES } from '../../lib/constants'

const MAX = 5 * 1024 * 1024 // 5MB

interface Props {
  holeNumber: number
  mapUrl: string | null
  onUpload: (holeNumber: number, url: string) => Promise<void>
}

export default function MapUpload({ holeNumber, mapUrl, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localUrl, setLocalUrl] = useState<string | null>(mapUrl)
  const special = SPECIAL_HOLES[holeNumber]

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
    <div className="overflow-hidden rounded-xl border border-green-100 bg-white">
      <div className="relative aspect-video bg-green-50">
        {localUrl ? (
          <img src={localUrl} alt={`Mappa buca ${holeNumber}`} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-green-400">
            <MapPin size={28} />
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-md bg-green-800 px-2 py-0.5 text-xs font-semibold text-white">
          Buca {holeNumber} {special?.emoji ?? ''}
        </span>
      </div>
      <div className="flex items-center justify-between p-2">
        {error ? <span className="text-xs text-error">{error}</span> : <span />}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
            e.target.value = ''
          }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 disabled:opacity-50"
        >
          <Upload size={15} />
          {busy ? '...' : 'Carica mappa'}
        </button>
      </div>
    </div>
  )
}
