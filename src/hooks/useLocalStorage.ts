import { useCallback, useEffect, useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage'

/** Persistance locale d'une valeur, avec synchronisation entre onglets. */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => readJSON(key, initialValue))

  const update = useCallback(
    (next: T) => {
      setValue(next)
      writeJSON(key, next)
    },
    [key],
  )

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return
      setValue(readJSON(key, initialValue))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key, initialValue])

  return [value, update]
}
