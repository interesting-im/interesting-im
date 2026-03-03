import { Link } from "@tanstack/react-router"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import UserStatsDisplay from "~/components/UserStats"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">📖 Reading</h1>
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              ← Back
            </Link>
          </div>
        </div>
      </div>
      
      {/* User Stats */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <UserStatsDisplay stats={defaultStats} />
      </div>
      
      {/* Articles Grid */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-slate-400">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-400">{error}</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={article.id}
                to="/reading/$articleId"
                params={{ articleId: article.id }}
                className="group bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-500 transition-all hover:shadow-xl hover:shadow-slate-900/50"
              >
                {/* Cover Image or Placeholder */}
                <div className="h-40 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full">
                      {article.category || "General"}
                    </span>
                    <span className="text-slate-500 text-xs">
                      ⭐ {article.difficulty || 1}
                    </span>
                    <span className="text-slate-500 text-xs">
                      ⏱️ {article.reading_time_minutes || 5} min
                    </span>
                  </div>
                  
                  <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {article.title}
                  </h2>
                  
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {article.excerpt || "No description available."}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>{article.author || "Unknown"}</span>
                    <span>{article.word_count || 0} words</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-slate-400">No articles yet</p>
            <p className="text-slate-500 text-sm mt-2">
              Make sure you have published articles in Supabase with is_published = true
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
