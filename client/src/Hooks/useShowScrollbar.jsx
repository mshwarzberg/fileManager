import { useEffect } from 'react'
import { useState } from 'react'

export default function useShowScrollbar(element) {
  const [showScrollbar, setShowScrollbar] = useState(false)
  useEffect(() => {
    element?.addEventListener('scroll', () => {
      if (element) {
        setShowScrollbar(element.scrollTopMax !== 0)
      }
    })
    return () => {
      element?.removeEventListener('scroll', () => {})
    }
  })
  return { showScrollbar }
}
