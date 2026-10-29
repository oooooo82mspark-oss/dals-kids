'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Upload,
  GraduationCap,
  Trash2,
  ArrowLeft,
  Plus,
  Clock,
  FileText,
} from 'lucide-react'
import type { VocabWord, VocabSet, QuizResult } from '@/lib/vocab-types'
import { saveVocabSets, loadVocabSets } from '@/lib/vocab-utils'
import { FileUploader } from '@/components/vocab-file-uploader'
import { WordList } from '@/components/vocab-word-list'
import { VocabQuiz } from '@/components/vocab-quiz'

type ViewType = 'home' | 'create' | 'view-set' | 'quiz'

export default function VocabPage() {
  const [vocabSets, setVocabSets] = useState<VocabSet[]>([])
  const [currentSetId, setCurrentSetId] = useState<string | null>(null)
  const [view, setView] = useState<ViewType>('home')
  const [isLoaded, setIsLoaded] = useState(false)

  // localStorage에서 로드
  useEffect(() => {
    const loaded = loadVocabSets()
    setVocabSets(loaded)
    setIsLoaded(true)
  }, [])

  // 변경 시 저장
  useEffect(() => {
    if (isLoaded) {
      saveVocabSets(vocabSets)
    }
  }, [vocabSets, isLoaded])

  const currentSet = vocabSets.find(s => s.id === currentSetId) || null

  const handleWordsExtracted = useCallback(
    (words: VocabWord[], fileName: string) => {
      const newSet: VocabSet = {
        id: crypto.randomUUID(),
        name: fileName.replace(/\.[^.]+$/, ''),
        words,
        createdAt: new Date().toISOString(),
        lastTestedAt: null,
      }
      setVocabSets(prev => [newSet, ...prev])
      setCurrentSetId(newSet.id)
      setView('view-set')
    },
    []
  )

  const handleDeleteSet = useCallback((setId: string) => {
    if (!confirm('정말 이 단어장을 삭제할까요?')) return
    setVocabSets(prev => prev.filter(s => s.id !== setId))
    if (setId === currentSetId) {
      setCurrentSetId(null)
      setView('home')
    }
  }, [currentSetId])

  const handleToggleMemorized = useCallback(
    (wordId: string) => {
      setVocabSets(prev =>
        prev.map(set =>
          set.id === currentSetId
            ? {
                ...set,
                words: set.words.map(w =>
                  w.id === wordId ? { ...w, memorized: !w.memorized } : w
                ),
              }
            : set
        )
      )
    },
    [currentSetId]
  )

  const handleDeleteWord = useCallback(
    (wordId: string) => {
      setVocabSets(prev =>
        prev.map(set =>
          set.id === currentSetId
            ? { ...set, words: set.words.filter(w => w.id !== wordId) }
            : set
        )
      )
    },
    [currentSetId]
  )

  const handleUpdateWord = useCallback(
    (wordId: string, correct: boolean) => {
      setVocabSets(prev =>
        prev.map(set =>
          set.id === currentSetId
            ? {
                ...set,
                words: set.words.map(w =>
                  w.id === wordId
                    ? {
                        ...w,
                        correctCount: correct
                          ? w.correctCount + 1
                          : w.correctCount,
                        wrongCount: correct ? w.wrongCount : w.wrongCount + 1,
                      }
                    : w
                ),
              }
            : set
        )
      )
    },
    [currentSetId]
  )

  const handleQuizComplete = useCallback(
    (result: QuizResult) => {
      setVocabSets(prev =>
        prev.map(set =>
          set.id === currentSetId
            ? { ...set, lastTestedAt: result.timestamp }
            : set
        )
      )
    },
    [currentSetId]
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  return (
    <main className="vocab-app">
      {/* 귀여운 배경 데코 */}
      <div className="vocab-bg-deco">
        <div className="vocab-bg-blob blob-1" />
        <div className="vocab-bg-blob blob-2" />
        <div className="vocab-bg-blob blob-3" />
      </div>

      {/* 헤더 */}
      <header className="vocab-header">
        <div className="vocab-header-inner">
          <Link href="/" className="vocab-back-link">
            <ArrowLeft size={18} />
          </Link>
          <div className="vocab-logo">
            <span className="vocab-logo-emoji">🐣</span>
            <div>
              <h1 className="vocab-logo-title">달스키즈 영단어장</h1>
              <p className="vocab-logo-sub">파일을 올리면 단어장이 뿅!</p>
            </div>
          </div>
        </div>
      </header>

      <div className="vocab-content">
        {/* ===== 홈 화면: 단어장 목록 ===== */}
        {view === 'home' && (
          <div className="vocab-home animate-fade-in">
            {/* 새 단어장 만들기 버튼 */}
            <button
              className="vocab-create-btn"
              onClick={() => setView('create')}
            >
              <div className="vocab-create-icon">
                <Plus size={24} />
              </div>
              <div>
                <strong>새 단어장 만들기</strong>
                <span>파일 업로드로 단어 추출!</span>
              </div>
            </button>

            {/* 단어장 목록 */}
            {vocabSets.length > 0 ? (
              <div className="vocab-sets-list">
                <h2 className="vocab-sets-title">
                  📚 내 단어장 ({vocabSets.length})
                </h2>
                {vocabSets.map(set => {
                  const memorized = set.words.filter(w => w.memorized).length
                  const total = set.words.length
                  const pct = total > 0 ? Math.round((memorized / total) * 100) : 0

                  return (
                    <div key={set.id} className="vocab-set-card">
                      <div
                        className="vocab-set-card-main"
                        onClick={() => {
                          setCurrentSetId(set.id)
                          setView('view-set')
                        }}
                      >
                        <div className="vocab-set-icon">📖</div>
                        <div className="vocab-set-info">
                          <h3>{set.name}</h3>
                          <div className="vocab-set-meta">
                            <span>
                              <FileText size={12} /> {total}개 단어
                            </span>
                            <span>
                              <Clock size={12} /> {formatDate(set.createdAt)}
                            </span>
                          </div>
                          <div className="vocab-set-progress-mini">
                            <div className="vocab-set-progress-bar-mini">
                              <div
                                className="vocab-set-progress-fill-mini"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span>{pct}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="vocab-set-card-actions">
                        <button
                          className="vocab-set-quiz-btn"
                          onClick={() => {
                            setCurrentSetId(set.id)
                            setView('quiz')
                          }}
                        >
                          <GraduationCap size={14} /> 시험
                        </button>
                        <button
                          className="vocab-set-delete-btn"
                          onClick={() => handleDeleteSet(set.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="vocab-empty-home">
                <div className="vocab-empty-illustration">📚</div>
                <h3>아직 단어장이 없어요!</h3>
                <p>파일을 업로드해서 나만의 단어장을 만들어 보세요 ✨</p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-xs font-bold text-pink-600 shadow-xs transition-all hover:bg-pink-50 hover:border-pink-300"
                  onClick={() => {
                    const sampleWords: VocabWord[] = [
                      { id: crypto.randomUUID(), english: 'apple', korean: '사과', memorized: true, wrongCount: 0, correctCount: 1 },
                      { id: crypto.randomUUID(), english: 'puppy', korean: '강아지', memorized: false, wrongCount: 0, correctCount: 0 },
                      { id: crypto.randomUUID(), english: 'rainbow', korean: '무지개', memorized: false, wrongCount: 0, correctCount: 0 },
                      { id: crypto.randomUUID(), english: 'butterfly', korean: '나비', memorized: false, wrongCount: 0, correctCount: 0 },
                      { id: crypto.randomUUID(), english: 'sunshine', korean: '햇살', memorized: true, wrongCount: 0, correctCount: 1 },
                      { id: crypto.randomUUID(), english: 'star', korean: '별', memorized: false, wrongCount: 0, correctCount: 0 },
                    ]
                    const sampleSet: VocabSet = {
                      id: crypto.randomUUID(),
                      name: '🐣 귀여운 기초 단어 (샘플)',
                      words: sampleWords,
                      createdAt: new Date().toISOString(),
                      lastTestedAt: null,
                    }
                    setVocabSets([sampleSet])
                    setCurrentSetId(sampleSet.id)
                    setView('view-set')
                  }}
                >
                  <span>✨</span>
                  <span>체험용 샘플 단어장 바로 불러오기</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== 새 단어장 만들기 ===== */}
        {view === 'create' && (
          <div className="vocab-create-view animate-fade-in">
            <button
              className="vocab-view-back"
              onClick={() => setView('home')}
            >
              <ArrowLeft size={16} /> 돌아가기
            </button>
            <div className="vocab-create-header">
              <h2>📂 파일 업로드</h2>
              <p>
                영단어와 뜻이 적힌 파일을 올려주세요!
                <br />
                <code>apple - 사과</code> 형식이면 자동으로 추출해 드려요.
              </p>
            </div>
            <FileUploader onWordsExtracted={handleWordsExtracted} />

            <div className="vocab-format-guide">
              <h3>✅ 이런 형태 모두 지원해요!</h3>
              <div className="vocab-format-examples">
                <div className="vocab-format-example">
                  <strong>📸 학원 시험지 / 워크시트 사진 (JPG, PNG)</strong>
                  <p className="text-xs text-gray-600 mb-1">
                    2단 표, 번호(#), 손글씨가 섞인 시험지 사진도 OCR로 단어와 뜻을 똑똑하게 분리 추출해요.
                  </p>
                  <pre>{`#  Word          Meaning    #  Word        Meaning
1  January       1월        11 July        7월
2  excitement    즐거움     12 judge       판사
...`}</pre>
                </div>
                <div className="vocab-format-example">
                  <strong>📄 텍스트 / CSV / 복사한 내용</strong>
                  <pre>{`apple - 사과
banana - 바나나
17 first place 1등`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== 단어장 보기 ===== */}
        {view === 'view-set' && currentSet && (
          <div className="vocab-view-set animate-fade-in">
            <div className="vocab-set-header-bar">
              <button
                className="vocab-view-back"
                onClick={() => {
                  setCurrentSetId(null)
                  setView('home')
                }}
              >
                <ArrowLeft size={16} /> 돌아가기
              </button>
              <button
                className="vocab-quiz-launch"
                onClick={() => setView('quiz')}
                disabled={currentSet.words.length < 2}
              >
                <GraduationCap size={16} /> 시험 보기!
              </button>
            </div>

            <div className="vocab-set-title-bar">
              <span className="vocab-set-title-emoji">📖</span>
              <h2>{currentSet.name}</h2>
            </div>

            <WordList
              words={currentSet.words}
              onToggleMemorized={handleToggleMemorized}
              onDeleteWord={handleDeleteWord}
            />
          </div>
        )}

        {/* ===== 퀴즈 ===== */}
        {view === 'quiz' && currentSet && (
          <div className="vocab-quiz-view animate-fade-in">
            <VocabQuiz
              words={currentSet.words}
              onQuizComplete={handleQuizComplete}
              onUpdateWord={handleUpdateWord}
              onBack={() => setView('view-set')}
            />
          </div>
        )}
      </div>
    </main>
  )
}
