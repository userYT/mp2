import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PokemonImage from '../components/PokemonImage'
import StatusMessage from '../components/StatusMessage'
import TypeBadge from '../components/TypeBadge'
import { usePokemon } from '../context/usePokemon'
import type { Pokemon } from '../types/pokemon'
import { displayName, formatId, formatKg, formatMeters } from '../utils/format'
import styles from './ListView.module.css'

type SortKey =
  | 'id'
  | 'name'
  | 'height'
  | 'weight'
  | 'baseExperience'
  | 'hp'
  | 'attack'
  | 'speed'

type Order = 'asc' | 'desc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'height', label: 'Height' },
  { key: 'weight', label: 'Weight' },
  { key: 'baseExperience', label: 'Base EXP' },
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Attack' },
  { key: 'speed', label: 'Speed' },
]

function sortValue(p: Pokemon, key: SortKey): number | string {
  switch (key) {
    case 'name':
      return p.name
    case 'hp':
      return p.stats.hp
    case 'attack':
      return p.stats.attack
    case 'speed':
      return p.stats.speed
    default:
      return p[key]
  }
}

export default function ListView() {
  const { pokemon, loading, error, reload, setNavIds } = usePokemon()
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [order, setOrder] = useState<Order>('asc')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^#/, '')
    const filtered =
      q === ''
        ? pokemon
        : pokemon.filter((p) => p.name.includes(q) || String(p.id).startsWith(q))
    const dir = order === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const va = sortValue(a, sortKey)
      const vb = sortValue(b, sortKey)
      const cmp =
        typeof va === 'string' && typeof vb === 'string'
          ? va.localeCompare(vb)
          : Number(va) - Number(vb)
      return cmp === 0 ? a.id - b.id : cmp * dir
    })
  }, [pokemon, query, sortKey, order])

  const ids = useMemo(() => visible.map((p) => p.id), [visible])

  useEffect(() => {
    setNavIds(ids)
  }, [ids, setNavIds])

  if (loading) return <StatusMessage kind="loading" message="Loading Pokemon..." />
  if (error) return <StatusMessage kind="error" message={error} onRetry={reload} />

  const searching = query.trim() !== ''

  return (
    <section className={searching ? styles.page : `${styles.page} ${styles.idle}`}>
      <div className={styles.panel}>
        <input
          type="search"
          className={`field ${styles.search}`}
          placeholder="Search for Pokemon"
          aria-label="Search Pokemon"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className={styles.sortLabel} htmlFor="sort-key">
          Sort by:
        </label>
        <select
          id="sort-key"
          className={`field ${styles.select}`}
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
        <div className={styles.order} role="radiogroup" aria-label="Sort order">
          <label className={styles.radio}>
            <input
              type="radio"
              name="order"
              value="asc"
              checked={order === 'asc'}
              onChange={() => setOrder('asc')}
            />
            ascending
          </label>
          <label className={styles.radio}>
            <input
              type="radio"
              name="order"
              value="desc"
              checked={order === 'desc'}
              onChange={() => setOrder('desc')}
            />
            descending
          </label>
        </div>
      </div>

      {searching && (
        <p className={styles.count}>
          {visible.length} of {pokemon.length}
        </p>
      )}

      {searching && visible.length === 0 ? (
        <StatusMessage kind="empty" message="No Pokemon match your search." />
      ) : searching ? (
        <ul className={styles.list}>
          {visible.map((p) => (
            <li key={p.id}>
              <Link
                to={`/pokemon/${p.id}`}
                state={{ from: '/list' }}
                className={styles.row}
              >
                <div className={styles.thumb}>
                  <PokemonImage src={p.sprites.front} alt={displayName(p.name)} />
                </div>
                <div className={styles.info}>
                  <span className={styles.name}>{displayName(p.name)}</span>
                  <span className={styles.facts}>
                    <span>{formatId(p.id)}</span>
                    <span>{formatMeters(p.height)}</span>
                    <span>{formatKg(p.weight)}</span>
                    <span>HP {p.stats.hp}</span>
                  </span>
                  <span className={styles.types}>
                    {p.types.map((t) => (
                      <TypeBadge key={t} type={t} />
                    ))}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
