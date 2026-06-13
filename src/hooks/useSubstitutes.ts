import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Substitute } from '../lib/types'

export function useSubstitutes() {
  const [substitutes, setSubstitutes] = useState<Substitute[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    const { data } = await supabase
      .from('substitutes')
      .select('*')
      .order('display_order', { ascending: true })
    setSubstitutes((data as Substitute[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { substitutes, loading, refetch }
}
