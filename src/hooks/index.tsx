import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { useState } from 'react'
import { useAsync } from 'react-async-hook'
import useConstant from 'use-constant'

// Pure imitation of https://stackoverflow.com/a/28046731/4636715
export const useDebouncedSearch = (searchFunction: any) => {
  const [inputText, setInputText] = useState('')

  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  )

  const searchResults = useAsync(async () => {
    if (inputText.length === 0) {
      return []
    } else {
      return debouncedSearchFunction(inputText)
    }
  }, [debouncedSearchFunction, inputText])

  return {
    inputText,
    setInputText,
    searchResults
  }
}
