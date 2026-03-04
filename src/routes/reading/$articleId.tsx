import { createFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { useEffect, useState, useMemo } from "react"
import { supabaseConfig } from "~/lib/supabase"
import { ChevronLeft, ChevronRight, BookOpen, Play, SkipForward } from "lucide-react"
import clsx from "clsx"

interface Article {
  id: string
  title: string
  content: string
  author: string | null
  category: string | null
  image_url: string | null
  reading_time_minutes: number | null
  word_count: number | null
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

  const [currentPage, setCurrentPage] = useState(0)
  const [selectedWordIndex, setSelectedWordIndex] = useState(-1)
  
  const [autoPlay, setAutoPlay] = useState(false)
  const [autoNext, setAutoNext] = useState(false)

  useEffect(() => {
    async function fetchArticle() {
      const { url, anonKey } = supabaseConfig

      try {
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

  const pages = useMemo(() => {
    if (!article?.content) return []
    const contentPages = article.content.split('\n\n').filter(p => p.trim())
    return ['', ...contentPages]
  }, [article?.content])

  const fuzzyMatch = (word: string, text: string): boolean => {
    const lowerWord = word.toLowerCase()
    const lowerText = text.toLowerCase()
    if (lowerText.includes(lowerWord)) return true
    const variations = [lowerWord + 's', lowerWord + 'es', lowerWord + 'ed', lowerWord + 'ing', lowerWord.slice(0, -1) + 'ies', lowerWord.slice(0, -1) + 'ied']
    for (const variant of variations) {
      if (lowerText.includes(variant)) return true
    }
    return false
  }

  const currentPageVocab = useMemo(() => {
    if (!vocabulary.length || currentPage === 0) return []
    const pageText = pages[currentPage] || ''
    return vocabulary.filter(v => fuzzyMatch(v.word, pageText))
  }, [vocabulary, pages, currentPage])

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

  const highlightText = (text: string, wordToHighlight: string) => {
    if (!wordToHighlight) return text
    
    const lowerWord = wordToHighlight.toLowerCase()
    const variations = [lowerWord, lowerWord + 's', lowerWord + 'es', lowerWord + 'ed', lowerWord + 'ing', lowerWord.slice(0, -1) + 'ies', lowerWord.slice(0, -1) + 'ied']
    const regex = new RegExp(`\\b(${variations.join('|')})\\b`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, i) => {
      if (part.toLowerCase() === lowerWord || variations.includes(part.toLowerCase())) {
        return <mark key={i} className="bg-amber-300 text-amber-900 px-0.5 rounded">{part}</mark>
      }
      return part
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📖</div>
          <p className="text-zinc-400">Loading story...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-400">{error}</p>
          <Link to="/reading" className="text-zinc-400 hover:underline mt-4 block">← Back to Bookshelf</Link>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-zinc-400">Story not found</p>
          <Link to="/reading" className="text-zinc-400 hover:underline mt-4 block">← Back to Bookshelf</Link>
        </div>
      </div>
    )
  }

  const selectedWord = selectedWordIndex >= 0 ? currentPageVocab[selectedWordIndex] : null
  const contentPages = pages.length - 1

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      {/* Header */}
      <div className="w-full bg-zinc-800/50 py-4 px-6">
        <Link to="/reading" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Bookshelf</span>
        </Link>
      </div>

      {/* Title */}
      <div className="w-full bg-zinc-800/30 py-8 text-center">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-zinc-100" style={{ fontFamily: "Georgia, serif" }}>
          {article.title}
        </h1>
        <div className="flex items-center justify-center gap-3 mt-3 text-zinc-400 text-sm">
          <span>{article.author || "Unknown"}</span>
          <span>•</span>
          <span>{article.reading_time_minutes || 5} min</span>
          <span>•</span>
          <span className="px-2 py-0.5 bg-zinc-700 rounded-full text-xs">{article.category || "General"}</span>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Navigation */}
        <div className="hidden md:flex flex-col w-20 lg:w-32 bg-zinc-800/20 p-4">
          {currentPage === 0 ? (
            <div className="flex flex-col items-center pt-8 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400">AUTO</h3>
              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} className="rounded" />
                <Play className="w-3 h-3" />
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={autoNext} onChange={(e) => setAutoNext(e.target.checked)} className="rounded" />
                <SkipForward className="w-3 h-3" />
              </label>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 mt-4">
              <button onClick={goToPrevPage} disabled={currentPage === 1} className={clsx("w-10 h-10 flex items-center justify-center bg-zinc-700 rounded", currentPage === 1 && "opacity-50 cursor-not-allowed")}>
                ↑
              </button>
              <div className="text-center">
                <p className="text-zinc-300">{currentPage}</p>
                <p className="text-zinc-500">/</p>
                <p className="text-zinc-500">{contentPages}</p>
              </div>
              <button onClick={goToNextPage} disabled={currentPage >= contentPages} className={clsx("w-10 h-10 flex items-center justify-center bg-zinc-700 rounded", currentPage >= contentPages && "opacity-50 cursor-not-allowed")}>
                ↓
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {currentPage === 0 ? (
            /* Cover Page */
            <div className="flex-1 flex items-center justify-center p-8 bg-zinc-800/20 cursor-pointer" onClick={goToNextPage}>
              <div className="text-center">
                {article.image_url ? (
                  <img src={article.image_url} alt={article.title} className="max-h-[60vh] mx-auto mb-8 rounded-lg shadow-2xl" />
                ) : (
                  <div className="w-48 h-72 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-lg shadow-2xl flex items-center justify-center mb-8">
                    <BookOpen className="w-16 h-16 text-zinc-300" />
                  </div>
                )}
                <p className="text-zinc-500 text-lg animate-pulse">Click anywhere to start reading →</p>
              </div>
            </div>
          ) : (
            /* Reading Page */
            <>
              <div className="flex-1 p-8 md:p-12 lg:p-16">
                <div className="max-w-4xl mx-auto">
                  <div className="text-xl md:text-2xl lg:text-3xl leading-10 md:leading-12 text-zinc-300 indent-8" style={{ fontFamily: "Georgia, serif" }}>
                    {selectedWord ? highlightText(pages[currentPage], selectedWord.word) : pages[currentPage]}
                  </div>
                </div>
              </div>

              {/* Definition Bar */}
              <div className="bg-zinc-800 border-t border-zinc-700 p-4">
                <div className="max-w-4xl mx-auto">
                  {selectedWord ? (
                    <div>
                      <span className="text-lg font-semibold text-zinc-100">{selectedWord.word}</span>
                      {selectedWord.pronunciation && <span className="text-zinc-400 ml-2">{selectedWord.pronunciation}</span>}
                      {selectedWord.part_of_speech && <span className="text-xs px-2 py-0.5 bg-zinc-700 rounded ml-2 text-zinc-300">{selectedWord.part_of_speech}</span>}
                      <p className="text-zinc-300 mt-1">{selectedWord.translation}</p>
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-center">
                      {currentPageVocab.length > 0 ? "👆 Click a vocabulary word to see its meaning" : "No vocabulary words on this page"}
                    </p>
                  )}
                </div>
              </div>

              {/* Page Navigation */}
              <div className="bg-zinc-800/50 border-t border-zinc-700 p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <button onClick={goToPrevPage} disabled={currentPage === 1} className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg", currentPage === 1 ? "text-zinc-600" : "text-zinc-300 hover:bg-zinc-700")}>
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: contentPages }, (_, i) => i + 1).map((i) => (
                      <button key={i} onClick={() => { setCurrentPage(i); setSelectedWordIndex(-1); }} className={clsx("w-2 h-2 rounded-full", i === currentPage ? "bg-amber-400 w-6" : "bg-zinc-600 hover:bg-zinc-500")} />
                    ))}
                  </div>
                  <button onClick={goToNextPage} disabled={currentPage >= contentPages} className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg", currentPage >= contentPages ? "text-zinc-600" : "text-zinc-300 hover:bg-zinc-700")}>
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar - Vocabulary */}
        {currentPage > 0 && (
          <div className="hidden lg:flex flex-col w-48 xl:w-56 bg-zinc-800/20 p-4 border-l border-zinc-700">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Vocabulary
              </h3>
              <div className="space-y-2">
                {currentPageVocab.length > 0 ? (
                  currentPageVocab.map((v, index) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedWordIndex(selectedWordIndex === index ? -1 : index)}
                      className={clsx(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-all capitalize",
                        selectedWordIndex === index
                          ? "bg-amber-400 text-amber-900 font-medium"
                          : "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700"
                      )}
                    >
                      {v.word}
                    </button>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm text-center py-4">
                    No vocabulary on this page
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {currentPage > 0 && (
        <div className="md:hidden bg-zinc-800 border-t border-zinc-700 p-3">
          <div className="flex justify-center items-center gap-8">
            <button onClick={goToPrevPage} disabled={currentPage === 1} className={clsx("p-2 rounded-lg", currentPage === 1 ? "text-zinc-600" : "text-zinc-300")}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-zinc-300 font-medium">{currentPage} / {contentPages}</span>
            <button onClick={goToNextPage} disabled={currentPage >= contentPages} className={clsx("p-2 rounded-lg", currentPage >= contentPages ? "text-zinc-600" : "text-zinc-300")}>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Vocabulary Buttons */}
      {currentPage > 0 && currentPageVocab.length > 0 && (
        <div className="md:hidden bg-zinc-800/50 border-t border-zinc-700 p-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {currentPageVocab.map((v, index) => (
              <button key={v.id} onClick={() => setSelectedWordIndex(selectedWordIndex === index ? -1 : index)} className={clsx("px-3 py-1.5 rounded-full text-sm", selectedWordIndex === index ? "bg-amber-400 text-amber-900 font-medium" : "bg-zinc-700 text-zinc-300")}>
                {v.word}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
