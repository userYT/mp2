import axios from 'axios'
import type { Pokemon } from '../types/pokemon'
import { pickOrasSprite } from '../utils/sprites'
import type { RawVersions } from '../utils/sprites'

const http = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 15000,
})

const CACHE_KEY = 'pokedex-cache-v2'
const LIMIT = 151
const BATCH_SIZE = 20

interface RawStat {
  base_stat: number
  stat: { name: string }
}

interface RawPokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  types: { slot: number; type: { name: string } }[]
  abilities: { ability: { name: string } }[]
  stats: RawStat[]
  sprites: {
    front_default: string | null
    other?: { 'official-artwork'?: { front_default: string | null } }
    versions?: RawVersions
  }
}

function statValue(stats: RawStat[], name: string): number {
  return stats.find((s) => s.stat.name === name)?.base_stat ?? 0
}

function toPokemon(raw: RawPokemon): Pokemon {
  return {
    id: raw.id,
    name: raw.name,
    height: raw.height,
    weight: raw.weight,
    baseExperience: raw.base_experience ?? 0,
    types: [...raw.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    abilities: raw.abilities.map((a) => a.ability.name),
    stats: {
      hp: statValue(raw.stats, 'hp'),
      attack: statValue(raw.stats, 'attack'),
      defense: statValue(raw.stats, 'defense'),
      specialAttack: statValue(raw.stats, 'special-attack'),
      specialDefense: statValue(raw.stats, 'special-defense'),
      speed: statValue(raw.stats, 'speed'),
    },
    sprites: {
      artwork: raw.sprites.other?.['official-artwork']?.front_default ?? null,
      front: raw.sprites.front_default,
      oras: pickOrasSprite(raw.sprites.versions),
    },
  }
}

function readCache(): Pokemon[] | null {
  try {
    const text = localStorage.getItem(CACHE_KEY)
    if (!text) return null
    const data: unknown = JSON.parse(text)
    return Array.isArray(data) && data.length > 0 ? (data as Pokemon[]) : null
  } catch {
    return null
  }
}

function writeCache(data: Pokemon[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    return
  }
}

export async function fetchAllPokemon(): Promise<Pokemon[]> {
  const cached = readCache()
  if (cached) return cached

  const list = await http.get<{ results: { name: string }[] }>('/pokemon', {
    params: { limit: LIMIT },
  })
  const names = list.data.results.map((r) => r.name)

  const result: Pokemon[] = []
  let failed = 0

  for (let i = 0; i < names.length; i += BATCH_SIZE) {
    const batch = names.slice(i, i + BATCH_SIZE)
    const settled = await Promise.allSettled(
      batch.map((name) => http.get<RawPokemon>(`/pokemon/${name}`)),
    )
    for (const item of settled) {
      if (item.status === 'fulfilled') {
        result.push(toPokemon(item.value.data))
      } else {
        failed += 1
      }
    }
  }

  if (result.length === 0) {
    throw new Error('Could not load Pokemon data. Check your connection and retry.')
  }

  result.sort((a, b) => a.id - b.id)
  if (failed === 0) writeCache(result)
  return result
}
