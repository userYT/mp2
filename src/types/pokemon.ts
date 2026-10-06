export interface Stats {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}

export interface PokemonSprites {
  artwork: string | null
  front: string | null
  oras: string | null
}

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  baseExperience: number
  types: string[]
  abilities: string[]
  stats: Stats
  sprites: PokemonSprites
}
