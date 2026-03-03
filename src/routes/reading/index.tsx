import { Link } from "@tanstack/react-router"
import { createFileRoute } from "@tanstack/react-router"
import UserStatsDisplay from "~/components/UserStats"

// Static articles for demo
const defaultArticles = [
  { id: '1', title: 'The Little Prince - Chapter 1', category: 'Classic', difficulty: 2, reading_time_minutes: 5, excerpt: 'A classic tale about imagination.', author: 'Antoine de Saint-Exupéry' },
  { id: '2', title: 'The Magic Forest', category: 'Story', difficulty: 1, reading_time_minutes: 3, excerpt: 'A bedtime story about stars and friendship.', author: 'Emma Woods' },
  { id: '3', title: 'The Solar System', category: 'Science', difficulty: 2, reading_time_minutes: 4, excerpt: 'Learn about our planetary neighborhood.', author: 'Science Kids' },
  { id: '4', title: 'A Day in the Life', category: 'Life', difficulty: 1, reading_time_minutes: 3, excerpt: 'A simple day described beautifully.', author: 'Lily Green' },
  { id: '5', title: 'The Ocean Deep', category: 'Nature', difficulty: 2, reading_time_minutes: 4, excerpt: 'Explore the mysterious depths of the sea.', author: 'Ocean Explorer' },
  { id: '6', title: 'How Plants Grow', category: 'Science', difficulty: 2, reading_time_minutes: 4, excerpt: 'Understanding how plants come to life.', author: 'Garden Teacher' },
  { id: '7', title: 'The Clever Rabbit', category: 'Fable', difficulty: 1, reading_time_minutes:3, excerpt: 'A classic fable about wit over strength.', author: 'Classic Tales' },
  { id: '8', title: 'Weather Wonders', category: 'Science', difficulty: 2, reading_time_minutes: 4, excerpt: 'Discover the secrets of weather.', author: 'Weather Watch' },
  { id: '9', title: 'The Art of Cooking', category: 'Lifestyle', difficulty: 2, reading_time_minutes: 4, excerpt: 'Learn culinary fundamentals.', author: 'Chef Maria' },
  { id: '10', title: 'A Busy Day at the Office', category: 'Work', difficulty: 1, reading_time_minutes: 4, excerpt: 'A story about teamwork.', author: 'John Smith' },
]

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
  // Return static data for now - can connect to Supabase later
  return defaultArticles
}

export const Route = createFileRoute("/reading/")({
  loader: async () => {
    const articles = await getArticles()
    return { articles }
  },
})

export default function ReadingPage() {
  const { articles } = Route.useLoaderData()
  
  // Use static data directly
  const displayArticles = articles && articles.length > 0 ? articles : defaultArticles
  
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
          {displayArticles.map((article: any) => (
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
