import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  let orientationType = screen.orientation.type

  const onOrientationChange = () => {
    if (orientationType == screen.orientation.type) return
    orientationType = screen.orientation.type
    onChange()
  }

  screen.orientation.addEventListener('change', onOrientationChange)
  return () => screen.orientation.removeEventListener('change', onOrientationChange)
}

const getSnapshot = () => screen.orientation.type

export const useOrientationType = (defaultValue?: OrientationType) =>
  useSyncExternalStore(
    subscribe,
    getSnapshot,
    defaultValue && (() => defaultValue),
  )
