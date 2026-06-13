import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { uploadImage } from '../../lib/storage'
import { supabase } from '../../lib/supabase'
import type { Pair } from '../../lib/types'

const MAX = 2 * 1024 * 1024 // 2MB

interface Props {
  pair: Pair
  onUpdated: () => void
}

export default function PhotoUpload({ pair, onUpdated }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localUrl, setLocalUrl] = useState<string | null>(pair.photo_url)

  async function handleFile(file: File) {
    setError(null)
    setBusy(true)
    const res = await uploadImage('pair-photos', pair.id, file, MAX)
    if (res.error) {
      setError(res.error)
      setBusy(false)
      return
    }
    await supabase.from('pairs').update({ photo_url: res.url }).eq('id', pair.id)
    setLocalUrl(res.url ?? null)
    setBusy(false)
    onUpdated()
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-white p-3">
      <Avatar name={pair.name} photoUrl={localUrl} size={56} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-green-800">{pair.name}</p>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
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
        className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-100 disabled:opacity-50"
      >
        <Upload size={16} />
        {busy ? '...' : 'Carica foto'}
      </button>
    </div>
  )
}
