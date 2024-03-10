import { useState } from 'react'
import { useDebounce } from 'react-use'

export function useDebouncedMemo<T>(factory: () => T, deps: readonly unknown[], delayInMs: number): T {
  const [value, setValue] = useState(factory())

  useDebounce(() => setValue(factory()), delayInMs, deps)

  return value
}
