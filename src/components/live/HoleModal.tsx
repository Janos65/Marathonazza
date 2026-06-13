import { useEffect, useState } from 'react'
import { ImageOff, Edit3 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { SPECIAL_HOLES } from '../../lib/constants'

interface Props {
  hole: number | null
  par: number | null
  mapUrl: string | null
  onClose: () => void
  onSavePar: (hole: number, par: number | null) => Promise<void>
}

export default function HoleModal({ hole, par, mapUrl, onClose, onSavePar }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const special = hole != null ? SPECIAL_HOLES[hole] : undefined

  useEffect(() => {
    setDraft(par != null ? String(par) : '')
    setEditing(false)
  }, [hole, par])

  if (hole == null) return null

  async function savePar() {
    await onSavePar(hole as number, draft.trim() ? Number(draft) : null)
    setEditing(false)
  }

  return (
    <Modal open={hole != null} onClose={onClose} title={`Buca ${hole}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={3}
                  max={6}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="tnum h-10 w-20 rounded-lg border border-green-100 text-center text-lg font-bold text-green-800 focus:border-green-600 focus:outline-none"
                  placeholder="Par"
                />
                <Button size="sm" onClick={savePar}>
                  Salva
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 text-lg font-semibold text-green-800"
              >
                {par != null ? `Par ${par}` : 'Par non impostato'}
                <Edit3 size={15} className="text-gray-400" />
              </button>
            )}
          </div>
          {special && (
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              {special.emoji} {special.label}
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-green-100 bg-green-50">
          {mapUrl ? (
            <img src={mapUrl} alt={`Mappa buca ${hole}`} className="w-full object-cover" />
          ) : (
            <div className="grid h-48 w-full place-items-center text-green-400">
              <div className="flex flex-col items-center gap-2">
                <ImageOff size={32} />
                <span className="text-sm">Mappa non ancora caricata</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
