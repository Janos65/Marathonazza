import { useCallback, useEffect, useState } from 'react'
import { Unlock } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { supabase } from '../../lib/supabase'
import type { Pair, Round } from '../../lib/types'

interface Props {
  pairs: Pair[]
}

export default function ScoreManager({ pairs }: Props) {
  const [rounds, setRounds] = useState<Round[]>([])
  const [loading, setLoading] = useState(true)
  const [target, setTarget] = useState<Round | null>(null)
  const pairName = (id: string) => pairs.find((p) => p.id === id)?.name ?? '—'

  const refetch = useCallback(async () => {
    const { data } = await supabase
      .from('rounds')
      .select('*')
      .eq('is_submitted', true)
      .order('round_number', { ascending: true })
    setRounds((data as Round[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  async function unlock() {
    if (!target) return
    await supabase
      .from('rounds')
      .update({ is_submitted: false, submitted_at: null })
      .eq('id', target.id)
    setTarget(null)
    await refetch()
  }

  if (loading) return <p className="text-sm text-gray-500">Caricamento giri...</p>
  if (rounds.length === 0)
    return <p className="text-sm text-gray-500">Nessun giro confermato finora.</p>

  return (
    <div className="overflow-hidden rounded-xl border border-green-100 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-green-50 text-left text-xs font-semibold text-green-800">
          <tr>
            <th className="px-3 py-2">Coppia</th>
            <th className="px-3 py-2">Giro</th>
            <th className="px-3 py-2 text-right">Lordo</th>
            <th className="px-3 py-2 text-right">Netto</th>
            <th className="px-3 py-2 text-right">Azione</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((r) => (
            <tr key={r.id} className="border-t border-green-50">
              <td className="px-3 py-2 font-medium text-green-800">{pairName(r.pair_id)}</td>
              <td className="px-3 py-2">G{r.round_number}</td>
              <td className="tnum px-3 py-2 text-right">{r.raw_strokes}</td>
              <td className="tnum px-3 py-2 text-right font-semibold">{r.net_strokes}</td>
              <td className="px-3 py-2 text-right">
                <button
                  onClick={() => setTarget(r)}
                  className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-800 hover:bg-green-100"
                >
                  <Unlock size={14} /> Sblocca
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={!!target} onClose={() => setTarget(null)} title="Sblocca giro">
        <p className="text-sm text-gray-700">
          Sbloccare il Giro {target?.round_number} di{' '}
          <span className="font-semibold">{target ? pairName(target.pair_id) : ''}</span>? La coppia
          potrà reinserire i colpi.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setTarget(null)}>
            Annulla
          </Button>
          <Button variant="danger" onClick={unlock}>
            Sblocca
          </Button>
        </div>
      </Modal>
    </div>
  )
}
