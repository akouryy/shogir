import { zip } from 'lodash'

export { v4 as uuid } from 'uuid'

export const cast = <T>(t: T): T => t

export const times = (n: number): number[] => [...Array(n).keys()]

export const uptil = (f: number, t: number): number[] => (
  Array.from({ length: t - f }, (_, i) => f + i)
)

export const upto = (f: number, t: number): number[] => uptil(f, t + 1)

export const foldLeft = <T, U>(arr: readonly T[], init: U) => {
  return (fn: (acc: U, elem: T, idx: number) => U): U => arr.reduce(fn, init)
}

export const zipStrict = <T, U>(ts: readonly T[], us: readonly U[]): Array<[T, U]> => {
  if(ts.length !== us.length) {
    throw new TypeError('arguments of zipStrict have different length')
  }
  return zip(ts, us) as Array<[T, U]>
}

type Entries<T extends Record<string, unknown>> = Array<keyof T extends infer U extends keyof T ? [U, T[U]] : never>

export function typedEntries<T extends Record<string, unknown>>(obj: T): Entries<T> {
  return Object.entries(obj) as Entries<T>
}

type FromEntries<T> = T extends Array<[infer K extends PropertyKey, infer V]> ? Record<K, V> : never

export function typedFromEntries<T extends Array<[PropertyKey, unknown]>>(entries: T): FromEntries<T> {
  return Object.fromEntries(entries) as FromEntries<T>
}
