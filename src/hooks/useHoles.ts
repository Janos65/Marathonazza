import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Hole } from '../lib/types'

export function useHoles() {
  const [holes, setHoles] = useState<Hole[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    const { data } = await supabase
      .from('holes')
      .select('*')
      .order('hole_number', { ascending: true })
    setHoles((data as Hole[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const parByHole = useMemo(() => {
    const map: Record<number, number | null> = {}
    for (const h of holes) map[h.hole_number] = h.par
    return map
  }, [holes])

  const mapByHole = useMemo(() => {
    const map: Record<number, string | null> = {}
    for (const h of holes) map[h.hole_number] = h.map_image_url
    return map
  }, [holes])

  const updatePar = useCallback(
    async (holeNumber: number, par: number | null) => {
      await supabase
        .from('holes')
        .update({ par, updated_at: new Date().toISOString() })
        .eq('hole_number', holeNumber)
      await refetch()
    },
    [refetch],
  )

  const updateMap = useCallback(
    async (holeNumber: number, url: string) => {
      await supabase
        .from('holes')
        .update({ map_image_url: url, updated_at: new Date().toISOString() })
        .eq('hole_number', holeNumber)
      await refetch()
    },
    [refetch],
  )

  return { holes, parByHole, mapByHole, loading, updatePar, updateMap, refetch }
}
