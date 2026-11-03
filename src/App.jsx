import Feed from './components/Feed'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Feed</h1>
        <Feed />
      </div>
    </div>
  )
}
