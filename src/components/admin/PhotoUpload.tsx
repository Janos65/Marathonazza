import { useRef, useState } from 'react'
import Avatar from '../ui/Avatar'
import { uploadImage } from '../../lib/storage'
import { supabase } from '../../lib/supabase'
import type { Pair } from '../../lib/types'

const MAX = 2 * 1024 * 1024 // 2MB

interface Props {
  pair: Pair
  onUpdated: () => void
}

const UploadIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
)

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
    <div className="flex flex-col items-center gap-[9px] rounded-[14px] p-4 text-center" style={{ background: '#FAF7EF', border: '1px solid #EFE9DA' }}>
      <Avatar name={pair.name} photoUrl={localUrl} size={54} ringColor="transparent" />
      <div className="min-h-[30px] text-[12px] font-semibold leading-tight text-[#14271B]">{pair.name}</div>
      {error && <div className="text-[10px] text-[#C0392B]">{error}</div>}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex items-center gap-[5px] rounded-[9px] bg-white px-3 py-[7px] text-[11.5px] font-semibold text-[#2D6A4F] transition-all hover:bg-[#1B4332] hover:text-white"
        style={{ border: '1px solid #DCD5C4' }}
      >
        {UploadIcon}
        {busy ? '…' : 'Carica foto'}
      </button>
    </div>
  )
}
