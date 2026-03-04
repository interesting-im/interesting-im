import { createFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { useEffect, useState, useMemo } from "react"
import { supabaseConfig } from "~/lib/supabase"
import { ChevronLeft, ChevronRight, BookOpen, Play, Pause, SkipForward } from "lucide-react"
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

  // Page state: 0 = cover, 1+ = content pages
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedWordIndex, setSelectedWordIndex] = useState(-1)
  
  // Auto-play settings
  const [autoPlay, setAutoPlay] = useState(false)
  const [autoNext, setAutoNext] = useState(false)

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

  // Split content into pages (by double newlines)
  const pages = useMemo(() => {
    if (!article?.content) return []
    // First item is cover page (empty), then content split by paragraphs
    const contentPages = article.content.split('\n\n').filter(p => p.trim())
    return ['', ...contentPages] // Index 0 = cover, 1+ = content
  }, [article?.content])

  // Fuzzy match function - handles plurals, case-insensitive, etc.
  const fuzzyMatch = (word: string, text: string): boolean => {
    const lowerWord = word.toLowerCase()
    const lowerText = text.toLowerCase()
    
    // Direct match
    if (lowerText.includes(lowerWord)) return true
    
    // Match plural forms (add s, es, ed, ing)
    const variations = [
      lowerWord + 's',
      lowerWord + 'es', 
      lowerWord + 'ed',
      lowerWord + 'ing',
      lowerWord.slice(0, -1) + 'ies', // party -> parties
      lowerWord.slice(0, -1) + 'ied',  // copy -> copied
    ]
    
    for (const variant of variations) {
      if (lowerText.includes(variant)) return true
    }
    
    return false
  }

  // Get vocabulary for current page
  const currentPageVocab = useMemo(() => {
    if (!vocabulary.length || currentPage === 0) return []
    const pageText = pages[currentPage] || ''
    return vocabulary.filter(v => fuzzyMatch(v.word, pageText))
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

  // Handle cover page click
  const handleCoverClick = () => {
    goToNextPage()
  }

  // Highlight word in text - fuzzy matching for plurals, case, etc.
  const highlightText = (text: string, wordToHighlight: string) => {
    if (!wordToHighlight) return text
    
    const lowerWord = wordToHighlight.toLowerCase()
    
    // Build regex with fuzzy variations
    const variations = [
      lowerWord,
      lowerWord + 's',
      lowerWord + 'es',
      lowerWord + 'ed',
      lowerWord + 'ing',
      lowerWord.slice(0, -1) + 'ies',
      lowerWord.slice(0, -1) + 'ied',
    ]
    
    // Create regex that matches any variation
    const regex = new RegExp(`\\b(${variations.join('|')})\\b`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, i) => {
      if (part.toLowerCase() === lowerWord || 
          variations.includes(part.toLowerCase())) {
        return (
          <mark 
            key={i} 
            className="bg-amber-300 dark:bg-amber-700/50 text-amber-900 dark:text-amber-100 px-0.5 rounded"
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
      <div className="min-h-screen bg-amber-100/50 dark:bg-zinc-800/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📖</div>
          <p className="text-stone-600 dark:text-stone-400">Loading story...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-100/50 dark:bg-zinc-800/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Link to="/reading" className="text-stone-600 dark:text-stone-400 hover:underline mt-4 block">
            ← Back to Bookshelf
          </Link>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-amber-100/50 dark:bg-zinc-800/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-stone-600 dark:text-stone-400">Story not found</p>
          <Link to="/reading" className="text-stone-600 dark:text-stone-400 hover:underline mt-4 block">
            ← Back to Bookshelf
          </Link>
        </div>
      </div>
    )
  }

  const selectedWord = selectedWordIndex >= 0 ? currentPageVocab[selectedWordIndex] : null
  const contentPages = pages.length - 1 // Excluding cover

  // Left sidebar classes based on page
  const leftSidebarClasses = clsx(
    currentPage === 0
      ? "lg:flex lg:bg-amber-100/10 lg:dark:bg-zinc-800/10"
      : "md:flex bg-amber-100/20 dark:bg-zinc-800/20",
    "hidden md:basis-1/8"
  )

  return (
    <div className="ml-4 mr-4 flex justify-center min-h-screen">
      <div className="basis lg:basis-2/3 xl:basis-3/4 2xl:basis-5/6 flex flex-col">
        {/* Title Section */}
        <div id="title" className="flex w-full">
          <div className={leftSidebarClasses}></div>
          <div className="basis-full md:basis-7/8 lg:pt-12 flex justify-center items-center bg-amber-100/50 dark:bg-zinc-800/50">
            <div>
              <h1 
                className="mt-4 text-center text-2xl md:text-4xl lg:text-5xl text-stone-700 dark:text-stone-300"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {article.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Player Section (for future audio) */}
        <div id="player" className="flex w-full">
          <div className={leftSidebarClasses}></div>
          <div className="basis-full md:basis-7/8 flex justify-center items-center bg-amber-100/50 dark:bg-zinc-800/50">
            <div className="basis-full md:mt-4">
              {/* Audio player placeholder - can be integrated later */}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div id="page" className="flex w-full">
          {/* Left Sidebar - Navigation & Auto settings */}
          <div className={leftSidebarClasses}>
            {currentPage === 0 ? (
              // Cover page: show auto settings
              <div className="flex flex-col items-center pt-8">
                <h3 className="text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">AUTO</h3>
                <label className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 cursor-pointer mb-2">
                  <input 
                    type="checkbox" 
                    checked={autoPlay}
                    onChange={(e) => setAutoPlay(e.target.checked)}
                    className="rounded text-stone-600"
                  />
                  <Play className="w-3 h-3" />
                  Read
                </label>
                <label className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoNext}
                    onChange={(e) => setAutoNext(e.target.checked)}
                    className="rounded text-stone-600"
                  />
                  <SkipForward className="w-3 h-3" />
                  Next
                </label>
              </div>
            ) : (
              // Content pages: show navigation
              <div className="mt-2 flex flex-col items-center">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={clsx(
                    "h-8 w-8 px-1 py-1 mb-2 justify-center items-center bg-stone-600 text-sm text-white rounded",
                    "hover:bg-stone-800 dark:hover:bg-amber-600",
                    "lg:w-10 lg:px-2",
                    currentPage === 1 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  ↑
                </button>
                <div className="w-6 lg:w-16 ml-1 lg:-ml-3 my-4 flex justify-center">
                  <div className="flex">
                    <p className="text-stone-700 dark:text-stone-300">{currentPage}</p>
                    <p className="text-stone-500 mx-1">/</p>
                    <p className="text-stone-500">{contentPages}</p>
                  </div>
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage >= contentPages}
                  className={clsx(
                    "h-8 w-8 px-1 py-1 mt-2 justify-center items-center bg-stone-600 text-sm text-white rounded",
                    "hover:bg-stone-800 dark:hover:bg-amber-600",
                    "lg:w-10 lg:px-2",
                    currentPage >= contentPages && "opacity-50 cursor-not-allowed"
                  )}
                >
                  ↓
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="basis-full md:basis-7/8 flex">
            {currentPage === 0 ? (
              // Cover page with image
              <div 
                className="flex p-4 justify-center items-center min-w-full bg-amber-100/50 dark:bg-zinc-800/50 cursor-pointer"
                onClick={handleCoverClick}
              >
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    height={800}
                    width={400}
                    onClick={handleCoverClick}
                    className="max-h-[500px] object-contain"
                  />
                ) : (
                  <div className="w-48 h-72 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg shadow-2xl flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-amber-200" />
                  </div>
                )}
              </div>
            ) : (
              // Content page with highlight
              <div className="flex flex-col min-w-full pb-4 md:px-4 bg-amber-100/50 dark:bg-zinc-800/50">
                <div className="flex">
                  {/* Vocabulary buttons */}
                  <div className="hidden md:flex flex-col md:basis-1/12 md:-ml-3 items-start">
                    {currentPageVocab.map((v, index) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedWordIndex(selectedWordIndex === index ? -1 : index)}
                        className={clsx(
                          "min-w-10 m-1 p-2 bg-stone-400 dark:bg-neutral-700 text-center text-lg capitalize rounded",
                          "hover:bg-stone-500/75 dark:hover:bg-amber-800",
                          "md:min-w-20",
                          selectedWordIndex === index
                            ? "text-stone-700 dark:text-amber-200 font-semibold"
                            : "text-stone-700 dark:text-stone-300/67"
                        )}
                      >
                        {v.word}
                      </button>
                    ))}
                  </div>
                  
                  <div className="hidden md:flex mr-2 border-1 border-stone-500/75 border-dashed" />
                  
                  {/* Text content */}
                  <div className="basis-full md:basis-11/12 flex justify-start items-center">
                    <div>
                      <div 
                        className={clsx(
                          "mx-8 text leading-8 indent-8 text-stone-600 dark:text-stone-400 selection:text-amber-700",
                          "md:min-h-[320px] md:text-lg md:leading-10",
                          "lg:min-h-[480px] lg:text-2xl lg:leading-12"
                        )}
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {selectedWord ? (
                          highlightText(pages[currentPage], selectedWord.word)
                        ) : (
                          pages[currentPage]
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Definition bar */}
                <div id="dict" className="flex">
                  {currentPageVocab.length === 0 || selectedWordIndex === -1 ? (
                    <div className="w-full p-4 bg-amber-100/50 dark:bg-zinc-800/50 text-center text-xl text-stone-600 dark:text-stone-400">
                      &nbsp;
                    </div>
                  ) : (
                    <div className="w-full p-4 bg-stone-400 dark:bg-neutral-700 text-center text-xl text-stone-700 dark:text-amber-200 capitalize">
                      {selectedWord?.translation}
                    </div>
                  )}
                </div>

                {/* Mobile vocabulary buttons */}
                {currentPageVocab.length > 0 && (
                  <div className="flex mt-4 justify-center items-center md:hidden">
                    {currentPageVocab.map((v, index) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedWordIndex(selectedWordIndex === index ? -1 : index)}
                        className={clsx(
                          "min-w-10 mx-1 p-2 bg-stone-400 dark:bg-neutral-700 text-center text-lg capitalize rounded",
                          "hover:bg-stone-500/75 dark:hover:bg-amber-800",
                          "md:min-w-20",
                          selectedWordIndex === index
                            ? "text-stone-700 dark:text-amber-200 font-semibold"
                            : "text-stone-700 dark:text-stone-300/67"
                        )}
                      >
                        {v.word}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {currentPage > 0 && (
          <div id="navi" className="flex justify-center items-center md:hidden my-4">
            <button 
              className="mr-8 cursor-pointer" 
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft color={currentPage === 1 ? "#9ca3af" : "black"} size={24} strokeWidth={1.5} />
            </button>
            <div className="w-6 lg:w-16 ml-1 lg:-ml-3 my-4 flex justify-center">
              <div className="flex">
                <p className="text-stone-700 dark:text-stone-300">{currentPage}</p>
                <p className="text-stone-500 mx-1">/</p>
                <p className="text-stone-500">{contentPages}</p>
              </div>
            </div>
            <button 
              className="ml-8 cursor-pointer" 
              onClick={goToNextPage}
              disabled={currentPage >= contentPages}
            >
              <ChevronRight color={currentPage >= contentPages ? "#9ca3af" : "black"} size={24} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
