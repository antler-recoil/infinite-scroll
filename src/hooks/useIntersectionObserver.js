import { useEffect, useRef } from 'react'

export default function useIntersectionObserver(callback, options = {}) {
    const targetRef = useRef(null)
    const callbackRef = useRef(callback)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    const { root = null, rootMargin = '0px', threshold = 0 } = options

    useEffect(() => { 
        const node = targetRef.current
        if (!node) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    callbackRef.current()
                }
            },
            { root, rootMargin, threshold }
        )
        observer.observe(node)

        return () => observer.disconnect()
    }, [root, rootMargin, threshold])

    return targetRef
}
