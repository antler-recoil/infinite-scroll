import { authors, topics } from './postData.json'

const POSTS_PER_PAGE = 10

// Small seeded PRNG (mulberry32) so each post id always yields the same post
function createRng(seed) {
  let t = seed + 0x6d2b79f5
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)]

function pickMany(rng, arr, count) {
  const copy = [...arr]
  const result = []
  for (let i = 0; i < count && copy.length; i++) {
    result.push(copy.splice(Math.floor(rng() * copy.length), 1)[0])
  }
  return result
}

function timeAgo(hours) {
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? '1 day ago' : `${days} days ago`
}

function generatePost(id) {
  const rng = createRng(id)
  const topic = pick(rng, topics)
  const author = pick(rng, authors)

  return {
    id,
    title: pick(rng, topic.titles),
    author: author.name,
    role: author.role,
    body: pickMany(rng, topic.sentences, 3).join(' '),
    postedAt: timeAgo(id * 3 + Math.floor(rng() * 3)),
    likes: Math.floor(rng() * 480) + 12,
    comments: Math.floor(rng() * 60),
  }
}

export function fetchPosts(page) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * POSTS_PER_PAGE
      const posts = Array.from({ length: POSTS_PER_PAGE }, (_, i) =>
        generatePost(start + i + 1)
      )
      resolve(posts)
    }, 500)
  })
}
