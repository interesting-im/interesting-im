import { Link } from "@tanstack/react-router"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { supabaseConfig } from "~/lib/supabase"

// Article type definition
interface Article {
  id: string
  title: string
  excerpt: string | null
  author: string | null
  category: string | null
  difficulty: number | null
  reading_time_minutes: number | null
  word_count: number | null
}

// Default user stats (for demo)
const defaultStats = {
  total_coins: 0,
  total_experience: 0,
  level: 1,
  articles_completed: 0,
  words_learned: 0,
  streak_days: 0
}

export const Route = createFileRoute("/reading/")({
  component: ReadingPage,
})

function ReadingPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticles() {
      const { url, anonKey } = supabaseConfig

      try {
        const res = await fetch(
          `${url}/rest/v1/reading_articles?is_published=eq.true&select=id,title,excerpt,author,category,difficulty,reading_time_minutes,word_count&order=created_at.desc`,
          {
            headers: {
              apikey: anonKey,
              Authorization: `Bearer ${anonKey}`
            }
          }
        )

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }

        const data = await res.json()
        setArticles(data)
      } catch (err) {
        console.error("Error fetching articles:", err)
        setError(err instanceof Error ? err.message : "Failed to load articles")
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Generate a deterministic color based on article id for variety
  const getBookColor = (id: string) => {
    const colors = [
      "from-amber-600 to-amber-800",
      "from-stone-600 to-stone-800",
      "from-emerald-700 to-emerald-900",
      "from-blue-700 to-blue-900",
      "from-rose-700 to-rose-900",
      "from-violet-700 to-violet-900",
    ]
    const index = id.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-amber-100/80 dark:bg-zinc-800/80 backdrop-blur-sm border-b border-amber-200 dark:border-zinc-700">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                📚 Bookshelf
              </h1>
              <p className="text-amber-700 dark:text-amber-300 mt-1 text-sm">
                Pick a story to start reading
              </p>
            </div>
            <Link 
              to="/" 
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex gap-4 text-sm">
          <div className="bg-amber-100 dark:bg-zinc-800 px-4 py-2 rounded-lg border border-amber-200 dark:border-zinc-700">
            <span className="text-amber-600 dark:text-amber-400">🪙</span>
            <span className="ml-1 text-amber-900 dark:text-amber-100 font-medium">{defaultStats.total_coins}</span>
          </div>
          <div className="bg-amber-100 dark:bg-zinc-800 px-4 py-2 rounded-lg border border-amber-200 dark:border-zinc-700">
            <span className="text-amber-600 dark:text-amber-400">⭐</span>
            <span className="ml-1 text-amber-900 dark:text-amber-100 font-medium">Level {defaultStats.level}</span>
          </div>
          <div className="bg-amber-100 dark:bg-zinc-800 px-4 py-2 rounded-lg border border-amber-200 dark:border-zinc-700">
            <span className="text-amber-600 dark:text-amber-400">📖</span>
            <span className="ml-1 text-amber-900 dark:text-amber-100 font-medium">{defaultStats.articles_completed} read</span>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-amber-700 dark:text-amber-300">Loading books...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Link
                key={article.id}
                to="/reading/$articleId"
                params={{ articleId: article.id }}
                className="group flex flex-col bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 dark:border-zinc-700 hover:border-amber-300 dark:hover:border-zinc-600"
              >
                {/* Book Cover */}
                <div 
                  className={`h-48 bg-gradient-to-br ${getBookColor(article.id)} flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Book spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/10" />
                  
                  {/* Book content preview */}
                  <div className="text-center px-6 relative z-10">
                    <div className="text-4xl mb-2 opacity-80">
                      {article.category === 'Classic' ? '👑' : 
                       article.category === 'Science' ? '🔬' :
                       article.category === 'Story' ? '✨' :
                       article.category === 'Work' ? '💼' :
                       article.category === 'Lifestyle' ? '🍳' :
                       article.category === 'Nature' ? '🌿' : '📖'}
                    </div>
                    <div 
                      className="text-white text-lg font-semibold leading-tight line-clamp-2"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {article.title}
                    </div>
                  </div>

                  {/* Page edges effect */}
                  <div className="absolute right-2 top-4 bottom-4 w-1 bg-white/20 rounded" />
                  <div className="absolute right-4 top-4 bottom-4 w-0.5 bg-white/10 rounded" />
                </div>

                {/* Book Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-zinc-700 text-amber-700 dark:text-amber-300 rounded-full">
                      {article.category || "General"}
                    </span>
                    <span className="text-amber-500 dark:text-amber-400">
                      ⭐ {article.difficulty || 1}
                    </span>
                    <span className="text-amber-500 dark:text-amber-400">
                      ⏱ {article.reading_time_minutes || 5} min
                    </span>
                  </div>

                  <p className="text-amber-700 dark:text-zinc-300 text-sm line-clamp-2 flex-1 mb-3">
                    {article.excerpt || "No description available."}
                  </p>

                  <div className="flex items-center justify-between text-xs text-amber-500 dark:text-zinc-500 pt-3 border-t border-amber-100 dark:border-zinc-700">
                    <span className="font-medium">{article.author || "Unknown"}</span>
                    <span>{article.word_count || 0} words</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-amber-700 dark:text-amber-300 text-lg">No books on the shelf yet</p>
            <p className="text-amber-500 dark:text-zinc-500 text-sm mt-2">
              Check back soon for new stories!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-6 py-8 text-center">
        <p className="text-amber-500 dark:text-zinc-500 text-sm">
          {articles.length} books available
        </p>
      </div>
    </div>
  )
}
