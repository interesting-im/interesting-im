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

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedWordIndexLeft, setSelectedWordIndexLeft] = useState(-1)
  const [selectedWordIndexRight, setSelectedWordIndexRight] = useState(-1)
  
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
    return contentPages
  }, [article?.content])

  const contentPages = pages.length

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

  const getPageVocab = (pageNum: number) => {
    if (!vocabulary.length || pageNum < 1 || pageNum > contentPages) return []
    const pageText = pages[pageNum - 1] || ''
    return vocabulary.filter(v => fuzzyMatch(v.word, pageText))
  }

  const currentPageVocab = useMemo(() => getPageVocab(currentPage), [vocabulary, pages, currentPage])
  const nextPageVocab = useMemo(() => getPageVocab(currentPage + 1), [vocabulary, pages, currentPage])

  const goToNextPage = () => {
    if (currentPage < contentPages) {
      setCurrentPage(currentPage + 1)
      setSelectedWordIndexLeft(-1)
      setSelectedWordIndexRight(-1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      setSelectedWordIndexLeft(-1)
      setSelectedWordIndexRight(-1)
    }
  }

  const goToNextPair = () => {
    if (currentPage + 1 < contentPages) {
      setCurrentPage(currentPage + 2)
    } else if (currentPage < contentPages) {
      setCurrentPage(currentPage + 1)
    }
    setSelectedWordIndexLeft(-1)
    setSelectedWordIndexRight(-1)
  }

  const goToPrevPair = () => {
    if (currentPage > 2) {
      setCurrentPage(currentPage - 2)
    } else {
      setCurrentPage(1)
    }
    setSelectedWordIndexLeft(-1)
    setSelectedWordIndexRight(-1)
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
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📖</div>
          <p className="text-stone-400">Loading story...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-400">{error}</p>
          <Link to="/reading" className="text-stone-400 hover:underline mt-4 block">← Back to Bookshelf</Link>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-stone-400">Story not found</p>
          <Link to="/reading" className="text-stone-400 hover:underline mt-4 block">← Back to Bookshelf</Link>
        </div>
      </div>
    )
  }

  const hasNextPage = currentPage < contentPages
  const showSpread = contentPages >= 2 && currentPage < contentPages

  const selectedWordLeft = selectedWordIndexLeft >= 0 ? currentPageVocab[selectedWordIndexLeft] : null
  const selectedWordRight = selectedWordIndexRight >= 0 ? nextPageVocab[selectedWordIndexRight] : null

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Header */}
      <div className="w-full bg-stone-200/80 py-4 px-6">
        <Link to="/reading" className="flex items-center gap-2 text-stone-400 hover:text-stone-200 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Bookshelf</span>
        </Link>
      </div>

      {/* Title */}
      <div className="w-full bg-stone-200/60 py-4 text-center">
        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-stone-100" style={{ fontFamily: "Georgia, serif" }}>
          {article.title}
        </h1>
        <div className="flex items-center justify-center gap-3 mt-2 text-stone-400 text-sm">
          <span>{article.author || "Unknown"}</span>
          <span>•</span>
          <span>{article.reading_time_minutes || 5} min</span>
          <span>•</span>
          <span className="px-2 py-0.5 bg-stone-300 rounded-full text-xs">{article.category || "General"}</span>
        </div>
      </div>

      {/* Main Content with Spread Layout */}
      {showSpread ? (
        /* Two Page Spread Layout */
        <div className="flex-1 flex">
          {/* Left Vocabulary Sidebar */}
          <div className="hidden xl:flex flex-col w-36 bg-stone-200/40 p-3 border-r border-stone-700">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-stone-400 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Page {currentPage}
              </h3>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {currentPageVocab.length > 0 ? (
                  currentPageVocab.map((v, index) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedWordIndexLeft(selectedWordIndexLeft === index ? -1 : index)}
                      className={clsx(
                        "w-full text-left px-2 py-1.5 rounded text-xs transition-all capitalize truncate",
                        selectedWordIndexLeft === index
                          ? "bg-amber-400 text-amber-900 font-medium"
                          : "bg-stone-300/50 text-stone-300 hover:bg-stone-300"
                      )}
                    >
                      {v.word}
                    </button>
                  ))
                ) : (
                  <p className="text-stone-500 text-xs">No vocab</p>
                )}
              </div>
            </div>
          </div>

          {/* Left Page Content */}
          <div className="flex-1 p-8 lg:p-12 border-r border-stone-700 flex flex-col">
            <div className="flex-1 flex items-center">
              <div className="w-full text-3xl leading-relaxed text-stone-300 indent-8" style={{ fontFamily: "Georgia, serif" }}>
                {selectedWordLeft ? highlightText(pages[currentPage - 1], selectedWordLeft.word) : pages[currentPage - 1]}
              </div>
            </div>
            {/* Left Definition */}
            <div className="bg-stone-200 border-t border-stone-700 p-3">
              {selectedWordLeft ? (
                <div>
                  <span className="text-base font-semibold text-stone-100">{selectedWordLeft.word}</span>
                  {selectedWordLeft.pronunciation && <span className="text-stone-400 ml-2 text-sm">{selectedWordLeft.pronunciation}</span>}
                  <p className="text-stone-300 text-sm mt-0.5">{selectedWordLeft.translation}</p>
                </div>
              ) : (
                <p className="text-stone-500 text-sm text-center">
                  {currentPageVocab.length > 0 ? "👆 Click a word" : "No vocabulary"}
                </p>
              )}
            </div>
          </div>

          {/* Right Page Content */}
          <div className="flex-1 p-8 lg:p-12 flex flex-col">
            <div className="flex-1 flex items-center">
              <div className="w-full text-3xl leading-relaxed text-stone-300 indent-8" style={{ fontFamily: "Georgia, serif" }}>
                {selectedWordRight ? highlightText(pages[currentPage], selectedWordRight.word) : pages[currentPage]}
              </div>
            </div>
            {/* Right Definition */}
            <div className="bg-stone-200 border-t border-stone-700 p-3">
              {selectedWordRight ? (
                <div>
                  <span className="text-base font-semibold text-stone-100">{selectedWordRight.word}</span>
                  {selectedWordRight.pronunciation && <span className="text-stone-400 ml-2 text-sm">{selectedWordRight.pronunciation}</span>}
                  <p className="text-stone-300 text-sm mt-0.5">{selectedWordRight.translation}</p>
                </div>
              ) : (
                <p className="text-stone-500 text-sm text-center">
                  {nextPageVocab.length > 0 ? "👆 Click a word" : "No vocabulary"}
                </p>
              )}
            </div>
          </div>

          {/* Right Vocabulary Sidebar */}
          <div className="hidden xl:flex flex-col w-36 bg-stone-200/40 p-3 border-l border-stone-700">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-stone-400 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Page {currentPage + 1}
              </h3>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {nextPageVocab.length > 0 ? (
                  nextPageVocab.map((v, index) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedWordIndexRight(selectedWordIndexRight === index ? -1 : index)}
                      className={clsx(
                        "w-full text-left px-2 py-1.5 rounded text-xs transition-all capitalize truncate",
                        selectedWordIndexRight === index
                          ? "bg-amber-400 text-amber-900 font-medium"
                          : "bg-stone-300/50 text-stone-300 hover:bg-stone-300"
                      )}
                    >
                      {v.word}
                    </button>
                  ))
                ) : (
                  <p className="text-stone-500 text-xs">No vocab</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Single Page Layout */
        <div className="flex-1 flex">
          {/* Left Navigation Sidebar - only on large screens */}
          <div className="hidden lg:flex flex-col w-20 bg-stone-200/40 p-4">
            <div className="flex flex-col items-center space-y-4 mt-4">
              <button onClick={goToPrevPair} disabled={currentPage <= 1} className={clsx("w-10 h-10 flex items-center justify-center bg-stone-300 rounded", currentPage <= 1 && "opacity-50 cursor-not-allowed")}>
                ⏮
              </button>
              <button onClick={goToPrevPage} disabled={currentPage === 1} className={clsx("w-10 h-10 flex items-center justify-center bg-stone-300 rounded", currentPage === 1 && "opacity-50 cursor-not-allowed")}>
                ◀
              </button>
              <div className="text-center">
                <p className="text-stone-300">{currentPage}</p>
                <p className="text-stone-500">/</p>
                <p className="text-stone-500">{contentPages}</p>
              </div>
              <button onClick={goToNextPage} disabled={!hasNextPage} className={clsx("w-10 h-10 flex items-center justify-center bg-stone-300 rounded", !hasNextPage && "opacity-50 cursor-not-allowed")}>
                ▶
              </button>
              <button onClick={goToNextPair} disabled={currentPage >= contentPages} className={clsx("w-10 h-10 flex items-center justify-center bg-stone-300 rounded", currentPage >= contentPages && "opacity-50 cursor-not-allowed")}>
                ⏭
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 md:p-10 lg:p-16">
              <div className="max-w-6xl mx-auto h-full flex items-center">
                <div className="w-full text-2xl md:text-3xl lg:text-4xl leading-relaxed text-stone-300 indent-8" style={{ fontFamily: "Georgia, serif" }}>
                  {selectedWordLeft ? highlightText(pages[currentPage - 1], selectedWordLeft.word) : pages[currentPage - 1]}
                </div>
              </div>
            </div>

            {/* Definition Bar */}
            <div className="bg-stone-200 border-t border-stone-700 p-4">
              <div className="max-w-5xl mx-auto">
                {selectedWordLeft ? (
                  <div>
                    <span className="text-lg font-semibold text-stone-100">{selectedWordLeft.word}</span>
                    {selectedWordLeft.pronunciation && <span className="text-stone-400 ml-2">{selectedWordLeft.pronunciation}</span>}
                    {selectedWordLeft.part_of_speech && <span className="text-xs px-2 py-0.5 bg-stone-300 rounded ml-2 text-stone-300">{selectedWordLeft.part_of_speech}</span>}
                    <p className="text-stone-300 mt-1">{selectedWordLeft.translation}</p>
                  </div>
                ) : (
                  <p className="text-stone-500 text-center">
                    {currentPageVocab.length > 0 ? "👆 Click a vocabulary word to see its meaning" : "No vocabulary words on this page"}
                  </p>
                )}
              </div>
            </div>

            {/* Page Navigation */}
            <div className="bg-stone-200/80 border-t border-stone-700 p-4">
              <div className="max-w-5xl mx-auto flex items-center justify-between">
                <button onClick={goToPrevPage} disabled={currentPage === 1} className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg", currentPage === 1 ? "text-stone-600" : "text-stone-300 hover:bg-stone-300")}>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: contentPages }, (_, i) => i + 1).map((i) => (
                    <button key={i} onClick={() => { setCurrentPage(i); setSelectedWordIndexLeft(-1); setSelectedWordIndexRight(-1); }} className={clsx("w-2 h-2 rounded-full", i === currentPage ? "bg-amber-400 w-6" : "bg-stone-400 hover:bg-stone-400")} />
                  ))}
                </div>

                <button onClick={goToNextPage} disabled={!hasNextPage} className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg", !hasNextPage ? "text-stone-600" : "text-stone-300 hover:bg-stone-300")}>
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Vocabulary Sidebar - single page */}
          {currentPage > 0 && (
            <div className="hidden lg:flex flex-col w-44 bg-stone-200/40 p-4 border-l border-stone-700">
              <div className="sticky top-24">
                <h3 className="text-sm font-semibold text-stone-400 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Vocabulary
                </h3>
                <div className="space-y-2">
                  {currentPageVocab.length > 0 ? (
                    currentPageVocab.map((v, index) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedWordIndexLeft(selectedWordIndexLeft === index ? -1 : index)}
                        className={clsx(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-all capitalize",
                          selectedWordIndexLeft === index
                            ? "bg-amber-400 text-amber-900 font-medium"
                            : "bg-stone-300/50 text-stone-300 hover:bg-stone-300"
                        )}
                      >
                        {v.word}
                      </button>
                    ))
                  ) : (
                    <p className="text-stone-500 text-sm text-center py-4">No vocabulary</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-stone-200 border-t border-stone-700 p-3">
        <div className="flex justify-center items-center gap-8">
          <button onClick={goToPrevPage} disabled={currentPage === 1} className={clsx("p-2 rounded-lg", currentPage === 1 ? "text-stone-600" : "text-stone-300")}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-stone-300 font-medium">{currentPage} / {contentPages}</span>
          <button onClick={goToNextPage} disabled={!hasNextPage} className={clsx("p-2 rounded-lg", !hasNextPage ? "text-stone-600" : "text-stone-300")}>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Vocabulary Buttons */}
      {currentPage > 0 && currentPageVocab.length > 0 && (
        <div className="lg:hidden bg-stone-200/80 border-t border-stone-700 p-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {currentPageVocab.map((v, index) => (
              <button key={v.id} onClick={() => setSelectedWordIndexLeft(selectedWordIndexLeft === index ? -1 : index)} className={clsx("px-3 py-1.5 rounded-full text-sm", selectedWordIndexLeft === index ? "bg-amber-400 text-amber-900 font-medium" : "bg-stone-300 text-stone-300")}>
                {v.word}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
