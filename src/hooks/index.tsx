import { useEffect, useState } from 'react'

// Pure imitation of https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
export const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [delay, value])

  return debouncedValue
}
