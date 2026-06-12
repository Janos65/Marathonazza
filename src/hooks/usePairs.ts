import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { normalizeCode } from '../lib/constants'
import type { Pair } from '../lib/types'

export function usePairs() {
  const [pairs, setPairs] = useState<Pair[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    const { data, error } = await supabase
      .from('pairs')
      .select('*')
      .order('display_order', { ascending: true })
    if (error) setError(error.message)
    else setPairs((data as Pair[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { pairs, loading, error, refetch }
}

/** Derive the (up to 2) pairs that share an access code. */
export function pairsForCode(pairs: Pair[], code: string): Pair[] {
  const c = normalizeCode(code)
  return pairs.filter((p) => normalizeCode(p.access_code) === c)
}
