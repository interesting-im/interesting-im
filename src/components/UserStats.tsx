import { supabaseConfig } from "~/lib/supabase"

export interface UserStats {
  total_coins: number
  total_experience: number
  level: number
  articles_completed: number
  words_learned: number
  streak_days: number
}

// Calculate level from experience (each level needs 100 * level XP)
export function calculateLevel(experience: number): number {
  let level = 1
  let xpNeeded = 100
  let totalXp = 0
  
  while (totalXp + xpNeeded <= experience) {
    totalXp += xpNeeded
    level++
    xpNeeded = 100 * level
  }
  
  return level
}

// Get experience needed for next level
export function getNextLevelXP(level: number): number {
  return 100 * level
}

// Coins for different actions
export const COINS = {
  READ_ARTICLE: 10,
  LEARN_WORD: 2,
  COMPLETE_ARTICLE: 20,
  DAILY_STREAK: 5
}

// XP for different actions
export const XP = {
  READ_ARTICLE: 15,
  LEARN_WORD: 5,
  COMPLETE_ARTICLE: 30,
  DAILY_STREAK: 10
}

export default function UserStatsDisplay({ stats }: { stats: UserStats }) {
  const nextLevelXP = getNextLevelXP(stats.level)
  const currentLevelXP = stats.total_experience
  const progress = Math.min(100, (currentLevelXP / nextLevelXP) * 100)
  
  return (
    <div className="bg-gradient-to-r from-amber-900/50 to-yellow-900/50 rounded-xl p-4 border border-amber-700/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-xl font-bold text-amber-950">
            {stats.level}
          </div>
          <div>
            <div className="text-white font-semibold">Level {stats.level}</div>
            <div className="text-amber-400 text-sm">{stats.total_experience} XP</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-amber-400">
          <span className="text-2xl">🪙</span>
          <span className="text-xl font-bold">{stats.total_coins}</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-slate-400">
        <span>{currentLevelXP} XP</span>
        <span>{nextLevelXP} XP to Level {stats.level + 1}</span>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="bg-slate-800/50 rounded-lg p-2">
          <div className="text-white font-bold">{stats.articles_completed}</div>
          <div className="text-slate-500 text-xs">Articles</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2">
          <div className="text-white font-bold">{stats.words_learned}</div>
          <div className="text-slate-500 text-xs">Words</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2">
          <div className="text-white font-bold">{stats.streak_days}</div>
          <div className="text-slate-500 text-xs">Streak</div>
        </div>
      </div>
    </div>
  )
}
