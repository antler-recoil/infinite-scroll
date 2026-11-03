import { useState, useEffect } from 'react'
import { fetchPosts } from '../api/mockPosts'
import useIntersectionObserver from '../hooks/useIntersectionObserver'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // Fetch page 1 on mount
  useEffect(() => {
    let ignore = false // guards against React StrictMode's double-invoke in dev
    setLoading(true)
    fetchPosts(1).then((data) => {
      if (!ignore) {
        setPosts(data)
        setLoading(false)
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  const loadMore = async () => {
    if (loading) return
    setLoading(true)
    const nextPage = page + 1
    const data = await fetchPosts(nextPage)
    setPosts((prev) => [...prev, ...data])
    setPage(nextPage)
    setLoading(false)
  }

  const sentinelRef = useIntersectionObserver(loadMore, { rootMargin: '200px' })

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article
        key={post.id}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
        <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
        <p className="mb-3 text-sm text-gray-500">
            {post.author} · {post.role} · {post.postedAt}
        </p>
        <p className="text-gray-700">{post.body}</p>
        <div className="mt-4 flex gap-4 text-sm text-gray-500">
            <span>♥ {post.likes}</span>
            <span>💬 {post.comments}</span>
        </div>
        </article>
      ))}

      <div ref={sentinelRef} className="h-4" aria-hidden="true" />

      {loading && <p className="py-4 text-center text-gray-500">Loading...</p>}
    </div>
  )
}
