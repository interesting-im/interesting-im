import { createAsync } from "@tanstack/react-router"
import { routeTree } from "../routeTree.gen"
import { Link } from "@tanstack/react-router"
import { createFileRoute } from "@tanstack/react-router"
import { supabaseConfig } from "~/lib/supabase"
import UserStatsDisplay from "~/components/UserStats"

// Default user stats (for demo)
const defaultStats = {
  total_coins: 0,
  total_experience: 0,
  level: 1,
  articles_completed: 0,
  words_learned: 0,
  streak_days: 0
}

// Fetch articles from Supabase
async function getArticles() {
  const { url, anonKey } = supabaseConfig
  
  const res = await fetch(`${url}/rest/v1/reading_articles?select=*&order=created_at.desc`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    }
  })
  
  if (!res.ok) {
    console.error("Failed to fetch articles:", await res.text())
    return []
  }
  
  return res.json()
}

export const Route = createFileRoute("/reading/")({
  loader: async () => {
    const articles = await getArticles()
    return { articles }
  },
})

export default function ReadingPage() {
  const { articles } = Route.useLoaderData()
  
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
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article: any) => (
            <Link
              key={article.id}
              to={`/reading/$articleId`}
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
                  {article.excerpt || article.content?.substring(0, 100)}...
                </p>
                
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{article.author || "Unknown"}</span>
                  <span>{article.word_count || 0} words</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {articles.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-slate-400">No articles yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
