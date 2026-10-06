import { useState } from 'react'
import { swapOrasPath } from '../utils/sprites'
import styles from './PokemonImage.module.css'

interface Props {
  src: string | null
  fallback?: string | null
  alt: string
}

export default function PokemonImage({ src, fallback = null, alt }: Props) {
  const [state, setState] = useState<{ src: string | null; step: number }>({
    src,
    step: 0,
  })
  const step = state.src === src ? state.step : 0

  const swapped = src ? swapOrasPath(src) : null
  const candidates = [src, swapped, fallback].filter((u): u is string => Boolean(u))
  const current = candidates[step]

  if (!current) {
    return (
      <div className={styles.placeholder} role="img" aria-label={alt}>
        ?
      </div>
    )
  }

  return (
    <img
      className={styles.image}
      src={current}
      alt={alt}
      loading="lazy"
      onError={() => setState({ src, step: step + 1 })}
    />
  )
}
