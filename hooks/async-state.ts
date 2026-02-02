import { useRef, useEffect, useState } from 'react'

export function useAsyncValue<T>(callback: () => T): Awaited<T> | undefined
export function useAsyncValue<T, D>(callback: () => T, defaultValue: D): Awaited<T> | D
export function useAsyncValue<T, D>(callback: () => T, defaultValue?: D) {
  const [state, setState] = useState<Awaited<T> | D | undefined>(defaultValue)
  const countRef = useRef(0)
  const lastCountRef = useRef(0)

  useEffect(() => {
    const count = countRef.current++
    (async () => {
      const state = await callback()
      if (count < lastCountRef.current) return

      lastCountRef.current = count
      setState(state)
    })()
  }, [callback])

  return state
}
