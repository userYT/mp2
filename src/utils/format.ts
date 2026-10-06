export const formatId = (id: number): string => `#${String(id).padStart(3, '0')}`

export const formatMeters = (decimeters: number): string =>
  `${(decimeters / 10).toFixed(1)} m`

export const formatKg = (hectograms: number): string =>
  `${(hectograms / 10).toFixed(1)} kg`

export const displayName = (name: string): string => name.replace(/-/g, ' ')
