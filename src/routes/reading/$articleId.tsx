import { createFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { useEffect } from "react"
import { supabaseConfig } from "~/lib/supabase"

// Fetch single article with vocabulary
async function getArticle(articleId: string) {
  const { url, anonKey } = supabaseConfig
  
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
    console.error("Failed to fetch article:", await articleRes.text())
    return null
  }
  
  const articles = await articleRes.json()
  if (!articles || articles.length === 0) {
    return null
  }
  
  const article = articles[0]
  
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
  
  const vocabulary = vocabRes.ok ? await vocabRes.json() : []
  
  return { article, vocabulary }
}

export const Route = createFileRoute("/reading/$articleId")({
  loader: async ({ params }) => {
    const data = await getArticle(params.articleId)
    return { data }
  },
})

export default function ArticlePage() {
  const { data } = Route.useLoaderData()
  
  // Client-side word tap interaction
  useEffect(() => {
    const handleWordClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.dataset.word) {
        const tooltip = document.getElementById('word-tooltip')
        const wordEl = document.getElementById('tooltip-word')
        const transEl = document.getElementById('tooltip-translation')
        const pronEl = document.getElementById('tooltip-pronunciation')
        const exampleEl = document.getElementById('tooltip-example')
        
        if (tooltip && wordEl && transEl) {
          wordEl.textContent = target.dataset.word || ''
          transEl.textContent = target.dataset.translation || ''
          pronEl.textContent = target.dataset.pronunciation || ''
          exampleEl.textContent = target.dataset.example || ''
          
          tooltip.style.display = 'block'
          tooltip.style.left = `${Math.min(e.clientX + 10, window.innerWidth - 250)}px`
          tooltip.style.top = `${Math.min(e.clientY + 10, window.innerHeight - 150)}px`
          
          // Hide on click elsewhere
          const hideTooltip = (evt: MouseEvent) => {
            if (evt.target !== target) {
              tooltip.style.display = 'none'
              document.removeEventListener('click', hideTooltip)
            }
          }
          setTimeout(() => document.addEventListener('click', hideTooltip), 100)
        }
      }
    }
    
    document.addEventListener('click', handleWordClick)
    return () => document.removeEventListener('click', handleWordClick)
  }, [])
  
  if (!data?.article) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Article not found</div>
      </div>
    )
  }
  
  const { article, vocabulary } = data
  
  // Create vocabulary map for quick lookup
  const vocabMap = new Map()
  vocabulary?.forEach((v: any) => {
    vocabMap.set(v.word.toLowerCase(), v)
  })
  
  // Process content - wrap vocabulary words
  const processContent = (content: string) => {
    if (!vocabulary || vocabulary.length === 0) {
      return content
    }
    
    // Sort words by length (longest first) to avoid partial matches
    const words = vocabulary
      .map((v: any) => v.word)
      .sort((a: string, b: string) => b.length - a.length)
    
    // Create regex pattern
    const pattern = new RegExp(`\\b(${words.join('|')})\\b`, 'gi')
    
    return content.split(pattern).map((part, i) => {
      const matchedWord = vocabulary.find(
        (v: any) => v.word.toLowerCase() === part.toLowerCase()
      )
      
      if (matchedWord) {
        return (
          <span
            key={i}
            className="cursor-pointer text-yellow-400 hover:text-yellow-300 hover:underline font-medium"
            data-word={matchedWord.word}
            data-translation={matchedWord.translation}
            data-pronunciation={matchedWord.pronunciation || ''}
            data-example={matchedWord.example_sentence || ''}
          >
            {part}
          </span>
        )
      }
      return part
    })
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/reading" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Reading
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm">
                {vocabulary?.length || 0} vocabulary words
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
        
        {/* Meta */}
        <div className="flex items-center gap-4 mb-8 text-slate-400">
          <span>{article.author || "Unknown"}</span>
          <span>•</span>
          <span>{article.reading_time_minutes || 5} min read</span>
          <span>•</span>
          <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs">
            {article.category || "General"}
          </span>
        </div>
        
        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          {article.content.split('\n\n').map((paragraph: string, i: number) => (
            <p key={i} className="text-slate-200 leading-relaxed mb-6">
              {processContent(paragraph)}
            </p>
          ))}
        </div>
        
        {/* Vocabulary Panel */}
        {vocabulary && vocabulary.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">📚 Vocabulary</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {vocabulary.map((v: any) => (
                <div key={v.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-white font-medium">{v.word}</span>
                    <span className="text-slate-500 text-sm">{v.pronunciation}</span>
                  </div>
                  <div className="text-yellow-400 text-sm mb-1">{v.translation}</div>
                  <div className="text-slate-400 text-xs">{v.part_of_speech}</div>
                  {v.example_sentence && (
                    <div className="mt-2 text-slate-500 text-xs italic">
                      "{v.example_sentence}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Word Tooltip (hidden by default, shown on click) */}
      <div 
        id="word-tooltip"
        className="fixed hidden bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl z-50 max-w-xs"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <div className="text-white font-medium mb-1" id="tooltip-word"></div>
        <div className="text-yellow-400 text-sm mb-1" id="tooltip-translation"></div>
        <div className="text-slate-400 text-xs" id="tooltip-pronunciation"></div>
        <div className="text-slate-500 text-xs mt-2 italic" id="tooltip-example"></div>
      </div>
    </div>
  )
}
