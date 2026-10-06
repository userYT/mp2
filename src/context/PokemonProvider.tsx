import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchAllPokemon } from '../api/pokemon'
import type { Pokemon } from '../types/pokemon'
import { PokemonContext } from './PokemonContext'

export function PokemonProvider({ children }: { children: ReactNode }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [navIds, setNavIds] = useState<number[] | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchAllPokemon()
      .then((data) => {
        if (cancelled) return
        setPokemon(data)
        setError(null)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setAttempt((n) => n + 1)
  }, [])

  const value = useMemo(
    () => ({ pokemon, loading, error, reload, navIds, setNavIds }),
    [pokemon, loading, error, reload, navIds],
  )

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
}
