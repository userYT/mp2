import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PokemonImage from '../components/PokemonImage'
import StatusMessage from '../components/StatusMessage'
import { usePokemon } from '../context/usePokemon'
import { displayName, formatId } from '../utils/format'
import styles from './GalleryView.module.css'

const ALL_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

type Mode = 'any' | 'all'

export default function GalleryView() {
  const { pokemon, loading, error, reload, setNavIds } = usePokemon()
  const [selected, setSelected] = useState<string[]>([])
  const [mode, setMode] = useState<Mode>('any')

  const visible = useMemo(() => {
    if (selected.length === 0) return pokemon
    return pokemon.filter((p) =>
      mode === 'all'
        ? selected.every((t) => p.types.includes(t))
        : selected.some((t) => p.types.includes(t)),
    )
  }, [pokemon, selected, mode])

  const ids = useMemo(() => visible.map((p) => p.id), [visible])

  useEffect(() => {
    setNavIds(ids)
  }, [ids, setNavIds])

  function toggleType(type: string) {
    setSelected((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  if (loading) return <StatusMessage kind="loading" message="Loading Pokemon..." />
  if (error) return <StatusMessage kind="error" message={error} onRetry={reload} />

  return (
    <section>
      <div className={styles.filters}>
        <button
          type="button"
          className={`btn ${styles.chip}`}
          aria-pressed={selected.length === 0}
          onClick={() => setSelected([])}
        >
          All
        </button>
        {ALL_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className={`btn ${styles.chip}`}
            aria-pressed={selected.includes(type)}
            onClick={() => toggleType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <button
          type="button"
          className="btn"
          onClick={() => setMode((m) => (m === 'any' ? 'all' : 'any'))}
        >
          Match: {mode === 'any' ? 'any selected type' : 'all selected types'}
        </button>
        <span className={styles.count}>
          {visible.length} of {pokemon.length}
        </span>
      </div>

      {visible.length === 0 ? (
        <StatusMessage kind="empty" message="No Pokemon match these types." />
      ) : (
        <ul className={styles.grid}>
          {visible.map((p) => (
            <li key={p.id}>
              <Link
                to={`/pokemon/${p.id}`}
                state={{ from: '/gallery' }}
                className={styles.card}
                title={`${displayName(p.name)} ${formatId(p.id)}`}
              >
                <div className={styles.media}>
                  <PokemonImage
                    src={p.sprites.artwork}
                    fallback={p.sprites.front}
                    alt={displayName(p.name)}
                  />
                </div>
                <div className={styles.meta}>
                  <span className={styles.name}>{displayName(p.name)}</span>
                  <span className={styles.id}>{formatId(p.id)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
