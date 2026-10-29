'use client'

import { useState } from 'react'
import type { VocabWord } from '@/lib/vocab-types'
import {
  Check,
  X,
  Eye,
  EyeOff,
  Trash2,
  Star,
  BookOpen,
  Volume2,
} from 'lucide-react'
import { speakEnglish } from '@/lib/vocab-utils'

interface WordListProps {
  words: VocabWord[]
  onToggleMemorized: (id: string) => void
  onDeleteWord: (id: string) => void
}

export function WordList({ words, onToggleMemorized, onDeleteWord }: WordListProps) {
  const [showMeaning, setShowMeaning] = useState<Record<string, boolean>>({})
  const [filter, setFilter] = useState<'all' | 'memorized' | 'not-memorized'>('all')

  const filteredWords = words.filter(w => {
    if (filter === 'memorized') return w.memorized
    if (filter === 'not-memorized') return !w.memorized
    return true
  })

  const memorizedCount = words.filter(w => w.memorized).length
  const progress = words.length > 0 ? Math.round((memorizedCount / words.length) * 100) : 0

  const toggleMeaning = (id: string) => {
    setShowMeaning(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="vocab-wordlist">
      {/* 진행 상황 바 */}
      <div className="vocab-progress-section">
        <div className="vocab-progress-header">
          <div className="vocab-progress-label">
            <Star size={16} className="vocab-star-icon" />
            <span>
              <strong>{memorizedCount}</strong> / {words.length} 단어 완료!
            </span>
          </div>
          <span className="vocab-progress-pct">{progress}%</span>
        </div>
        <div className="vocab-progress-bar">
          <div
            className="vocab-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <div className="vocab-complete-msg">
            🎉 축하해요! 모든 단어를 외웠어요!
          </div>
        )}
      </div>

      {/* 필터 버튼 */}
      <div className="vocab-filter-bar">
        <button
          className={`vocab-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <BookOpen size={14} /> 전체 ({words.length})
        </button>
        <button
          className={`vocab-filter-btn ${filter === 'not-memorized' ? 'active' : ''}`}
          onClick={() => setFilter('not-memorized')}
        >
          📖 아직 안 외운 ({words.length - memorizedCount})
        </button>
        <button
          className={`vocab-filter-btn ${filter === 'memorized' ? 'active' : ''}`}
          onClick={() => setFilter('memorized')}
        >
          ⭐ 외운 단어 ({memorizedCount})
        </button>
      </div>

      {/* 단어 카드 리스트 */}
      <div className="vocab-cards-grid">
        {filteredWords.map((word, index) => (
          <div
            key={word.id}
            className={`vocab-word-card ${word.memorized ? 'memorized' : ''}`}
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <div className="vocab-card-number">{index + 1}</div>
            <div className="vocab-card-content">
              <div className="vocab-card-english flex items-center gap-2">
                <span>{word.english}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    speakEnglish(word.english)
                  }}
                  className="p-1 text-pink-500 hover:text-pink-700 hover:scale-110 active:scale-90 transition-all rounded-full hover:bg-pink-100"
                  title="발음 듣기"
                >
                  <Volume2 size={15} />
                </button>
              </div>
              <div
                className={`vocab-card-korean ${showMeaning[word.id] ? 'visible' : 'hidden-meaning'}`}
                onClick={() => toggleMeaning(word.id)}
              >
                {showMeaning[word.id] ? (
                  <>
                    <span>{word.korean}</span>
                    <EyeOff size={14} className="vocab-eye-icon" />
                  </>
                ) : (
                  <>
                    <span>뜻 보기</span>
                    <Eye size={14} className="vocab-eye-icon" />
                  </>
                )}
              </div>
            </div>
            <div className="vocab-card-actions">
              <button
                className={`vocab-memorize-btn ${word.memorized ? 'checked' : ''}`}
                onClick={() => onToggleMemorized(word.id)}
                title={word.memorized ? '다시 공부하기' : '외웠어요!'}
              >
                {word.memorized ? <Check size={16} /> : <Star size={16} />}
              </button>
              <button
                className="vocab-delete-btn"
                onClick={() => onDeleteWord(word.id)}
                title="삭제"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="vocab-empty-list">
          {filter === 'memorized'
            ? '아직 외운 단어가 없어요! 열심히 공부해봐요 💪'
            : filter === 'not-memorized'
              ? '와! 모든 단어를 다 외웠어요! 🎉'
              : '단어가 없어요. 파일을 업로드해 주세요! 📂'}
        </div>
      )}
    </div>
  )
}
