import { useCallback, useEffect, useState } from 'react'
import Avatar from '../ui/Avatar'
import { supabase } from '../../lib/supabase'
import type { Pair, Round } from '../../lib/types'

interface Props {
  pairs: Pair[]
}

const LockIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 019.9-1" />
  </svg>
)

export default function ScoreManager({ pairs }: Props) {
  const [rounds, setRounds] = useState<Round[]>([])
  const [loading, setLoading] = useState(true)
  const [target, setTarget] = useState<Round | null>(null)
  const pairName = (id: string) => pairs.find((p) => p.id === id)?.name ?? '—'

  const refetch = useCallback(async () => {
    const { data } = await supabase.from('rounds').select('*').eq('is_submitted', true).order('round_number', { ascending: true })
    setRounds((data as Round[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  async function unlock() {
    if (!target) return
    await supabase.from('rounds').update({ is_submitted: false, submitted_at: null }).eq('id', target.id)
    setTarget(null)
    await refetch()
  }

  return (
    <div className="overflow-hidden rounded-[14px]" style={{ border: '1px solid #EFE9DA' }}>
      <div className="grid gap-2 px-4 py-[11px]" style={{ gridTemplateColumns: '1fr 56px 70px 70px 116px', background: '#FAF7EF', borderBottom: '1px solid #EFE9DA' }}>
        <div className="font-mono text-[10px] tracking-[1px] text-[#9a947f]">COPPIA</div>
        <div className="text-center font-mono text-[10px] text-[#9a947f]">GIRO</div>
        <div className="text-center font-mono text-[10px] text-[#9a947f]">LORDO</div>
        <div className="text-center font-mono text-[10px] text-[#9a947f]">NETTO</div>
        <div className="text-right font-mono text-[10px] text-[#9a947f]">AZIONE</div>
      </div>

      {loading ? (
        <div className="px-4 py-6 text-center text-[13px] text-[#9a947f]">Caricamento…</div>
      ) : rounds.length === 0 ? (
        <div className="px-4 py-6 text-center text-[13px] text-[#9a947f]">Nessun giro confermato finora.</div>
      ) : (
        <div className="max-h-[330px] overflow-y-auto">
          {rounds.map((r) => (
            <div key={r.id} className="grid items-center gap-2 px-4 py-[9px]" style={{ gridTemplateColumns: '1fr 56px 70px 70px 116px', borderBottom: '1px solid #F4F0E5' }}>
              <div className="flex min-w-0 items-center gap-[9px]">
                <Avatar name={pairName(r.pair_id)} size={28} ringColor="transparent" />
                <span className="truncate text-[13px] font-semibold text-[#14271B]">{pairName(r.pair_id)}</span>
              </div>
              <div className="text-center font-mono text-[13px] font-semibold text-[#6B7A66]">G{r.round_number}</div>
              <div className="text-center font-mono text-[13px] text-[#14271B]">{r.raw_strokes}</div>
              <div className="text-center font-mono text-[13px] font-bold text-[#1B4332]">{r.net_strokes}</div>
              <div className="flex justify-end">
                <button onClick={() => setTarget(r)} className="flex items-center gap-[5px] rounded-lg bg-white px-3 py-[6px] text-[11.5px] font-semibold text-[#C0503A] transition-all hover:bg-[#C0503A] hover:text-white" style={{ border: '1px solid rgba(192,80,58,.4)' }}>
                  {LockIcon}
                  Sblocca
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {target && (
        <div onClick={() => setTarget(null)} className="fixed inset-0 z-[90] flex items-center justify-center p-[22px]" style={{ background: 'rgba(20,40,25,.45)', backdropFilter: 'blur(4px)', animation: 'mzFadeIn .18s ease' }}>
          <div onClick={(e) => e.stopPropagation()} className="w-[min(420px,100%)] rounded-[20px] bg-white p-7 text-center" style={{ boxShadow: '0 40px 90px -30px rgba(20,40,25,.5)', animation: 'mzModalIn .26s cubic-bezier(.16,.84,.3,1)' }}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(192,80,58,.12)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C0503A" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 019.9-1" /></svg>
            </div>
            <h3 className="m-0 mb-2 font-serif text-[22px] font-bold text-[#14271B]">Sbloccare il Giro {target.round_number}?</h3>
            <p className="m-0 mb-[22px] text-[14px] leading-relaxed text-[#6B7A66]">
              <strong className="text-[#14271B]">{pairName(target.pair_id)}</strong> potrà reinserire i colpi di questo giro. L'azione è reversibile.
            </p>
            <div className="flex gap-2.5">
              <button onClick={() => setTarget(null)} className="flex-1 rounded-xl bg-white p-3.5 text-[15px] font-bold text-[#6B7A66]" style={{ border: '1.5px solid #E1DAC8' }}>Annulla</button>
              <button onClick={unlock} className="rounded-xl p-3.5 text-[15px] font-bold text-white transition-[filter] hover:brightness-110" style={{ flex: 1.4, background: '#C0503A' }}>Sblocca giro</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
