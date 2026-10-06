const OLD_KEY = 'omegaruby-alphasapphire'
const NEW_KEY = 'omega-ruby-alpha-sapphire'

interface RawSpriteEntry {
  front_default?: string | null
}

export type RawVersions = Record<
  string,
  Record<string, RawSpriteEntry | undefined> | undefined
>

export function pickOrasSprite(versions: RawVersions | undefined): string | null {
  const gen6 = versions?.['generation-vi']
  return gen6?.[OLD_KEY]?.front_default ?? gen6?.[NEW_KEY]?.front_default ?? null
}

export function swapOrasPath(url: string): string | null {
  if (url.includes(`/${OLD_KEY}/`)) {
    return url.replace(`/${OLD_KEY}/`, `/${NEW_KEY}/`)
  }
  if (url.includes(`/${NEW_KEY}/`)) {
    return url.replace(`/${NEW_KEY}/`, `/${OLD_KEY}/`)
  }
  return null
}
