import { Link, useLocation, useParams } from 'react-router-dom'
import NotFound from '../components/NotFound'
import PokemonImage from '../components/PokemonImage'
import StatusMessage from '../components/StatusMessage'
import TypeBadge from '../components/TypeBadge'
import { usePokemon } from '../context/usePokemon'
import type { Stats } from '../types/pokemon'
import { displayName, formatId, formatKg, formatMeters } from '../utils/format'
import styles from './DetailView.module.css'

const STAT_ROWS: { label: string; key: keyof Stats }[] = [
  { label: 'HP', key: 'hp' },
  { label: 'Attack', key: 'attack' },
  { label: 'Defense', key: 'defense' },
  { label: 'Sp. Atk', key: 'specialAttack' },
  { label: 'Sp. Def', key: 'specialDefense' },
  { label: 'Speed', key: 'speed' },
]

export default function DetailView() {
  const { id } = useParams()
  const location = useLocation()
  const { pokemon, loading, error, reload, navIds } = usePokemon()

  if (loading) return <StatusMessage kind="loading" message="Loading Pokemon..." />
  if (error) return <StatusMessage kind="error" message={error} onRetry={reload} />

  const numericId = Number(id)
  const current = pokemon.find((p) => p.id === numericId)
  if (!current) return <NotFound message="This Pokemon does not exist." />

  const from = (location.state as { from?: string } | null)?.from ?? '/list'
  const order =
    navIds && navIds.includes(numericId) ? navIds : pokemon.map((p) => p.id)
  const index = order.indexOf(numericId)
  const prevId = order[(index - 1 + order.length) % order.length]
  const nextId = order[(index + 1) % order.length]
  const name = displayName(current.name)

  return (
    <section className={styles.panel}>
      <div className={styles.nav}>
        <Link
          to={`/pokemon/${prevId}`}
          state={location.state}
          className={`btn ${styles.arrow}`}
          aria-label="Previous Pokemon"
        >
          &lt;
        </Link>
        <Link to={from} className="btn">
          Back
        </Link>
        <Link
          to={`/pokemon/${nextId}`}
          state={location.state}
          className={`btn ${styles.arrow}`}
          aria-label="Next Pokemon"
        >
          &gt;
        </Link>
      </div>

      <div className={styles.heading}>
        <h1 className={styles.name}>{name}</h1>
        <span className={styles.id}>{formatId(current.id)}</span>
      </div>

      <div className={styles.types}>
        {current.types.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>

      <div className={styles.layout}>
        <div className={styles.hero}>
          <PokemonImage
            src={current.sprites.artwork}
            fallback={current.sprites.front}
            alt={name}
          />
        </div>

        <div>
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt>Height</dt>
              <dd>{formatMeters(current.height)}</dd>
            </div>
            <div className={styles.fact}>
              <dt>Weight</dt>
              <dd>{formatKg(current.weight)}</dd>
            </div>
            <div className={styles.fact}>
              <dt>Base EXP</dt>
              <dd>{current.baseExperience}</dd>
            </div>
          </dl>

          <h2 className={styles.section}>Abilities</h2>
          <ul className={styles.abilities}>
            {current.abilities.map((a) => (
              <li key={a} className={styles.ability}>
                {displayName(a)}
              </li>
            ))}
          </ul>

          <h2 className={styles.section}>Base stats</h2>
          {STAT_ROWS.map(({ label, key }) => (
            <div key={key} className={styles.stat}>
              <span>{label}</span>
              <span>{current.stats[key]}</span>
              <progress
                className={styles.bar}
                max={255}
                value={current.stats[key]}
                aria-label={label}
              />
            </div>
          ))}

          <h2 className={styles.section}>Sprites</h2>
          <div className={styles.sprites}>
            <figure className={styles.sprite}>
              <div className={styles.spriteBox}>
                <PokemonImage src={current.sprites.front} alt={`${name} sprite`} />
              </div>
              <figcaption>Default</figcaption>
            </figure>
            {current.sprites.oras && (
              <figure className={styles.sprite}>
                <div className={styles.spriteBox}>
                  <PokemonImage
                    src={current.sprites.oras}
                    alt={`${name} Omega Ruby and Alpha Sapphire sprite`}
                  />
                </div>
                <figcaption>Omega Ruby / Alpha Sapphire</figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
