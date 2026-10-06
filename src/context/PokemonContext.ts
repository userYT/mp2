import { createContext } from 'react'
import type { Pokemon } from '../types/pokemon'

export interface PokemonContextValue {
  pokemon: Pokemon[]
  loading: boolean
  error: string | null
  reload: () => void
  navIds: number[] | null
  setNavIds: (ids: number[] | null) => void
}

export const PokemonContext = createContext<PokemonContextValue | null>(null)
