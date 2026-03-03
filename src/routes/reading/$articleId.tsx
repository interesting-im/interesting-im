import { createFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { useEffect, useState, useMemo } from "react"
import { supabaseConfig } from "~/lib/supabase"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, BookOpen } from "lucide-react"

interface Article {
  id: string
  title: string
  content: string
  author: string | null
  category: string | null
  reading_time_minutes: number | null
}

interface Vocabulary {
  id: string
  word: string
  translation: string
  pronunciation: string | null
  part_of_speech: string | null
  example_sentence: string | null
}

export const Route = createFileRoute("/reading/$articleId")({
  component: ArticlePage,
})

function ArticlePage() {
  const { articleId } = Route.useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Page navigation state
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedWordIndex, setSelectedWordIndex] = useState(-1)

  useEffect(() => {
    async function fetchArticle() {
      const { url, anonKey } = supabaseConfig

      try {
        // Get article
        const articleRes = await fetch(
          `${url}/rest/v1/reading_articles?id=eq.${articleId}&select=*`,
          {
            headers: {
              apikey: anonKey,
              Authorization: `Bearer ${anonKey}`
            }
          }
        )

        if (!articleRes.ok) {
          throw new Error(`Failed to fetch article: ${articleRes.status}`)
        }

        const articles = await articleRes.json()
        if (!articles || articles.length === 0) {
          setArticle(null)
          return
        }

        setArticle(articles[0])

        // Get vocabulary for this article
        const vocabRes = await fetch(
          `${url}/rest/v1/reading_vocabulary?article_id=eq.${articleId}&select=*`,
          {
            headers: {
              apikey: anonKey,
              Authorization: `Bearer ${anonKey}`
            }
          }
        )

        if (vocabRes.ok) {
          setVocabulary(await vocabRes.json())
        }
      } catch (err) {
        console.error("Error fetching article:", err)
        setError(err instanceof Error ? err.message : "Failed to load article")
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [articleId])

  // Split content into pages (paragraphs)
  const pages = useMemo(() => {
    if (!article?.content) return []
    return article.content.split('\n\n').filter(p => p.trim())
  }, [article?.content])

  // Get vocabulary for current page
  const currentPageVocab = useMemo(() => {
    if (!vocabulary.length || !pages[currentPage]) return []
    const pageText = pages[currentPage].toLowerCase()
    return vocabulary.filter(v => pageText.includes(v.word.toLowerCase()))
  }, [vocabulary, pages, currentPage])

  // Navigation handlers
  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
      setSelectedWordIndex(-1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      setSelectedWordIndex(-1)
    }
  }

  // Highlight word in text
  const highlightText = (text: string, wordToHighlight: string) => {
    if (!wordToHighlight) return text
    
    const regex = new RegExp(`(\\b${wordToHighlight}\\b)`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, i) => {
      if (part.toLowerCase() === wordToHighlight.toLowerCase()) {
        return (
          <mark 
            key={i} 
            className="bg-amber-200 dark:bg-amber-700/50 text-amber-900 dark:text-amber-100 px-0.5 rounded"
          >
            {part}
          </mark>
        )
      }
      return part
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📖</div>
          <p className="text-amber-700 dark:text-amber-300">Loading story...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Link to="/reading" className="text-amber-600 dark:text-amber-400 hover:underline mt-4 block">
            ← Back to Bookshelf
          </Link>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-amber-700 dark:text-amber-300">Story not found</p>
          <Link to="/reading" className="text-amber-600 dark:text-amber-400 hover:underline mt-4 block">
            ← Back to Bookshelf
          </Link>
        </div>
      </div>
    )
  }

  const selectedWord = selectedWordIndex >= 0 ? currentPageVocab[selectedWordIndex] : null

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-zinc-900 flex flex-col">
      {/* Header */}
      <header className="bg-amber-100/80 dark:bg-zinc-800/80 backdrop-blur-sm border-b border-amber-200 dark:border-zinc-700 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link 
              to="/reading" 
              className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Bookshelf</span>
            </Link>
            
            <div className="flex items-center gap-3 text-sm">
              <span className="text-amber-600 dark:text-amber-400 bg-amber-200/50 dark:bg-zinc-700 px-2 py-0.5 rounded">
                {currentPage + 1} / {pages.length}
              </span>
              <span className="text-amber-500 dark:text-zinc-400 hidden sm:block">
                {currentPageVocab.length} words
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Title */}
      <div className="bg-amber-100/50 dark:bg-zinc-800/50 border-b border-amber-200/50 dark:border-zinc-700/50">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <h1 
            className="text-2xl md:text-3xl font-bold text-amber-900 dark:text-amber-100"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2 text-sm text-amber-600 dark:text-amber-400">
            <span>{article.author || "Unknown"}</span>
            <span>•</span>
            <span>{article.reading_time_minutes || 5} min read</span>
            <span>•</span>
            <span className="px-2 py-0.5 bg-amber-200 dark:bg-zinc-700 rounded-full text-xs">
              {article.category || "General"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex max-w-6xl mx-auto w-full">
        {/* Left sidebar - Vocabulary buttons (desktop) */}
        <div className="hidden lg:flex flex-col w-48 xl:w-56 p-4 border-r border-amber-200/50 dark:border-zinc-700/50">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Vocabulary
            </h3>
            <div className="space-y-2">
              {currentPageVocab.length > 0 ? (
                currentPageVocab.map((v, index) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedWordIndex(selectedWordIndex === index ? -1 : index)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedWordIndex === index
                        ? "bg-amber-200 dark:bg-amber-700 text-amber-900 dark:text-amber-100 font-medium shadow-sm"
                        : "bg-amber-100 dark:bg-zinc-800 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {v.word}
                  </button>
                ))
              ) : (
                <p className="text-amber-500/50 dark:text-zinc-500 text-sm text-center py-4">
                  No vocabulary on this page
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col">
          {/* Reading content */}
          <div className="flex-1 p-6 md:p-8 lg:p-12">
            <div 
              className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed md:leading-loose text-amber-800 dark:text-zinc-200"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {selectedWord ? (
                <p>{highlightText(pages[currentPage], selectedWord.word)}</p>
              ) : (
                <p>{pages[currentPage]}</p>
              )}
            </div>
          </div>

          {/* Definition bar */}
          <div className="bg-amber-100 dark:bg-zinc-800 border-t border-amber-200 dark:border-zinc-700">
            <div className="max-w-2xl mx-auto px-6 py-4 min-h-[60px] flex items-center">
              {selectedWord ? (
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                      {selectedWord.word}
                    </span>
                    {selectedWord.pronunciation && (
                      <span className="text-sm text-amber-600 dark:text-amber-400">
                        {selectedWord.pronunciation}
                      </span>
                    )}
                    {selectedWord.part_of_speech && (
                      <span className="text-xs px-2 py-0.5 bg-amber-200 dark:bg-zinc-700 rounded text-amber-700 dark:text-amber-300">
                        {selectedWord.part_of_speech}
                      </span>
                    )}
                  </div>
                  <p className="text-amber-800 dark:text-amber-200 font-medium">
                    {selectedWord.translation}
                  </p>
                </div>
              ) : (
                <p className="text-amber-500 dark:text-zinc-500 text-sm text-center w-full">
                  {currentPageVocab.length > 0 
                    ? "👆 Click a vocabulary word to see its meaning" 
                    : "No vocabulary words on this page"}
                </p>
              )}
            </div>
          </div>

          {/* Mobile vocabulary buttons */}
          {currentPageVocab.length > 0 && (
            <div className="lg:hidden bg-amber-50 dark:bg-zinc-850 border-t border-amber-200/50 dark:border-zinc-700/50 p-3">
              <div className="flex flex-wrap gap-2 justify-center">
                {currentPageVocab.map((v, index) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedWordIndex(selectedWordIndex === index ? -1 : index)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedWordIndex === index
                        ? "bg-amber-300 dark:bg-amber-600 text-amber-900 dark:text-amber-100 font-medium"
                        : "bg-amber-100 dark:bg-zinc-800 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {v.word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation bar */}
          <div className="bg-amber-100/80 dark:bg-zinc-800/80 border-t border-amber-200 dark:border-zinc-700">
            <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === 0
                    ? "text-amber-300 dark:text-zinc-600 cursor-not-allowed"
                    : "text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-zinc-700"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:block">Previous</span>
              </button>

              {/* Page dots */}
              <div className="flex items-center gap-1">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i)
                      setSelectedWordIndex(-1)
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentPage
                        ? "bg-amber-500 dark:bg-amber-400 w-4"
                        : "bg-amber-300 dark:bg-zinc-600 hover:bg-amber-400 dark:hover:bg-zinc-500"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === pages.length - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === pages.length - 1
                    ? "text-amber-300 dark:text-zinc-600 cursor-not-allowed"
                    : "text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-zinc-700"
                }`}
              >
                <span className="text-sm font-medium hidden sm:block">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vocabulary Panel - Full list at bottom */}
      {vocabulary.length > 0 && (
        <div className="bg-amber-100/50 dark:bg-zinc-800/50 border-t border-amber-200 dark:border-zinc-700">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
              📚 All Vocabulary ({vocabulary.length} words)
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {vocabulary.map((v) => (
                <div 
                  key={v.id} 
                  className="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-amber-100 dark:border-zinc-700"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-amber-900 dark:text-amber-100">{v.word}</span>
                    {v.pronunciation && (
                      <span className="text-xs text-amber-500 dark:text-zinc-500">{v.pronunciation}</span>
                    )}
                  </div>
                  <p className="text-amber-600 dark:text-amber-300 text-sm">{v.translation}</p>
                  {v.part_of_speech && (
                    <span className="text-xs text-amber-500 dark:text-zinc-500 mt-1 block">
                      {v.part_of_speech}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
