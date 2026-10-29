'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import type { VocabWord, QuizMode, QuizResult } from '@/lib/vocab-types'
import { generateQuizOptions, shuffleArray, speakEnglish } from '@/lib/vocab-utils'
import {
  Play,
  RotateCcw,
  ChevronRight,
  Trophy,
  Target,
  Frown,
  PartyPopper,
  Pencil,
  MousePointerClick,
  ArrowLeft,
  Volume2,
} from 'lucide-react'

interface VocabQuizProps {
  words: VocabWord[]
  onQuizComplete: (result: QuizResult) => void
  onUpdateWord: (id: string, correct: boolean) => void
  onBack: () => void
}

type QuizState = 'setup' | 'playing' | 'answered' | 'result'

interface ActiveQuizItem {
  word: VocabWord
  options: string[]
  correctAnswer: string
}

export function VocabQuiz({ words, onQuizComplete, onUpdateWord, onBack }: VocabQuizProps) {
  const [mode, setMode] = useState<QuizMode>('en-to-ko')
  const [quizType, setQuizType] = useState<'choice' | 'typing'>('choice')
  const [state, setState] = useState<QuizState>('setup')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [typedAnswer, setTypedAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongWords, setWrongWords] = useState<VocabWord[]>([])
  const [quizScope, setQuizScope] = useState<'all' | 'not-memorized'>('all')
  const [showConfetti, setShowConfetti] = useState(false)

  // ⭐️ 핵심 수정: 시험 시작 시 각 문제와 4개 보기를 사전에 완전히 고정하여 생성
  // 부모의 단어 상태가 변경되거나 리렌더링되어도 보기가 절대 뒤바뀌지 않음!
  const [quizItems, setQuizItems] = useState<ActiveQuizItem[]>([])

  const scopedWords = useMemo(() => {
    if (quizScope === 'not-memorized') {
      return words.filter(w => !w.memorized)
    }
    return words
  }, [words, quizScope])

  const currentItem = quizItems[currentIndex] || null
  const currentWord = currentItem?.word || null
  const totalQuestions = quizItems.length
  const currentOptions = currentItem?.options || []

  // 시험 시작
  const startQuiz = useCallback(() => {
    if (scopedWords.length < 2) return

    const shuffled = shuffleArray(scopedWords)
    const allAnswers =
      mode === 'en-to-ko'
        ? scopedWords.map(w => w.korean)
        : scopedWords.map(w => w.english)

    // 각 문제마다 고정된 4지선다 보기 사전 생성
    const preparedItems: ActiveQuizItem[] = shuffled.map(word => {
      const correctAnswer = mode === 'en-to-ko' ? word.korean : word.english
      const options =
        quizType === 'choice'
          ? generateQuizOptions(correctAnswer, allAnswers)
          : []
      return {
        word,
        options,
        correctAnswer,
      }
    })

    setQuizItems(preparedItems)
    setCurrentIndex(0)
    setCorrectCount(0)
    setWrongWords([])
    setSelectedAnswer(null)
    setTypedAnswer('')
    setIsCorrect(null)
    setShowConfetti(false)
    setState('playing')

    // 첫 문제 자동 발음 (영어가 문제인 경우)
    if (mode === 'en-to-ko' && preparedItems[0]) {
      setTimeout(() => {
        speakEnglish(preparedItems[0].word.english)
      }, 200)
    }
  }, [scopedWords, mode, quizType])

  // 다음 문제로 넘어갈 때 자동 발음
  const playCurrentWordPronunciation = useCallback(() => {
    if (currentWord) {
      speakEnglish(currentWord.english)
    }
  }, [currentWord])

  const checkAnswer = useCallback(
    (answer: string) => {
      if (!currentItem || state === 'answered') return
      const correct = currentItem.correctAnswer

      // 타이핑 모드에서는 대소문자 무시
      const normalizedAnswer = answer.trim().toLowerCase()
      const normalizedCorrect = correct.trim().toLowerCase()
      const right = normalizedAnswer === normalizedCorrect

      setSelectedAnswer(answer)
      setIsCorrect(right)
      setState('answered')

      if (right) {
        setCorrectCount(prev => prev + 1)
      } else {
        setWrongWords(prev => [...prev, currentItem.word])
      }

      onUpdateWord(currentItem.word.id, right)
    },
    [currentItem, state, onUpdateWord]
  )

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= totalQuestions) {
      // 퀴즈 종료
      const result: QuizResult = {
        totalQuestions,
        correctAnswers: correctCount + (isCorrect ? 0 : 0),
        wrongAnswers: wrongWords,
        timestamp: new Date().toISOString(),
      }

      if (wrongWords.length === 0) {
        setShowConfetti(true)
      }

      onQuizComplete(result)
      setState('result')
    } else {
      const nextIdx = currentIndex + 1
      setCurrentIndex(nextIdx)
      setSelectedAnswer(null)
      setTypedAnswer('')
      setIsCorrect(null)
      setState('playing')

      // 다음 문제 영어 발음 자동 재생
      if (mode === 'en-to-ko' && quizItems[nextIdx]) {
        setTimeout(() => {
          speakEnglish(quizItems[nextIdx].word.english)
        }, 150)
      }
    }
  }, [currentIndex, totalQuestions, correctCount, isCorrect, wrongWords, onQuizComplete, mode, quizItems])

  // 결과 화면
  if (state === 'result') {
    const score = Math.round((correctCount / totalQuestions) * 100)
    const isPerfect = score === 100
    const isGreat = score >= 80
    const isGood = score >= 60

    return (
      <div className="vocab-quiz-result">
        {showConfetti && (
          <div className="vocab-confetti">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="vocab-confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD93D', '#C9B1FF'][
                    i % 7
                  ],
                }}
              />
            ))}
          </div>
        )}

        <div className="vocab-result-card">
          <div className="vocab-result-emoji">
            {isPerfect ? '🏆' : isGreat ? '🌟' : isGood ? '😊' : '💪'}
          </div>
          <h2 className="vocab-result-title">
            {isPerfect
              ? '완벽해요!'
              : isGreat
                ? '정말 잘했어요!'
                : isGood
                  ? '좋아요!'
                  : '다음엔 더 잘할 수 있어요!'}
          </h2>
          <div className="vocab-result-score">
            <div className="vocab-score-circle">
              <svg viewBox="0 0 100 100" className="vocab-score-svg">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="vocab-score-bg"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="vocab-score-fill"
                  strokeDasharray={`${score * 2.76} 276`}
                  strokeLinecap="round"
                  transform="rotate(-90, 50, 50)"
                />
              </svg>
              <span className="vocab-score-text">{score}점</span>
            </div>
          </div>
          <div className="vocab-result-stats">
            <div className="vocab-stat correct">
              <span className="vocab-stat-icon">✅</span>
              <span>맞힌 문제</span>
              <strong>{correctCount}개</strong>
            </div>
            <div className="vocab-stat wrong">
              <span className="vocab-stat-icon">❌</span>
              <span>틀린 문제</span>
              <strong>{wrongWords.length}개</strong>
            </div>
          </div>

          {wrongWords.length > 0 && (
            <div className="vocab-wrong-review">
              <h3>📝 다시 확인해봐요!</h3>
              <div className="vocab-wrong-list">
                {wrongWords.map(w => (
                  <div key={w.id} className="vocab-wrong-item">
                    <button
                      type="button"
                      onClick={() => speakEnglish(w.english)}
                      className="p-1 text-pink-500 hover:text-pink-700 transition-transform active:scale-90"
                      title="발음 듣기"
                    >
                      <Volume2 size={15} />
                    </button>
                    <span className="vocab-wrong-en">{w.english}</span>
                    <span className="vocab-wrong-arrow">→</span>
                    <span className="vocab-wrong-ko">{w.korean}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="vocab-result-actions">
            <button className="vocab-btn-retry" onClick={startQuiz}>
              <RotateCcw size={16} /> 다시 도전!
            </button>
            <button className="vocab-btn-back" onClick={onBack}>
              <ArrowLeft size={16} /> 단어장으로
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 설정 화면
  if (state === 'setup') {
    const notMemorizedCount = words.filter(w => !w.memorized).length

    return (
      <div className="vocab-quiz-setup">
        <div className="vocab-setup-card">
          <div className="vocab-setup-header">
            <div className="vocab-setup-emoji">🧪</div>
            <h2>단어 시험 준비!</h2>
            <p>어떤 방식으로 시험을 볼까요?</p>
          </div>

          {/* 시험 범위 */}
          <div className="vocab-setup-section">
            <h3>📚 시험 범위</h3>
            <div className="vocab-setup-options">
              <button
                className={`vocab-setup-option ${quizScope === 'all' ? 'active' : ''}`}
                onClick={() => setQuizScope('all')}
              >
                <Target size={20} />
                <span>전체 단어</span>
                <span className="vocab-setup-count">{words.length}개</span>
              </button>
              <button
                className={`vocab-setup-option ${quizScope === 'not-memorized' ? 'active' : ''}`}
                onClick={() => setQuizScope('not-memorized')}
                disabled={notMemorizedCount < 2}
              >
                <Frown size={20} />
                <span>안 외운 단어만</span>
                <span className="vocab-setup-count">{notMemorizedCount}개</span>
              </button>
            </div>
          </div>

          {/* 시험 모드 */}
          <div className="vocab-setup-section">
            <h3>🎯 시험 모드</h3>
            <div className="vocab-setup-options">
              <button
                className={`vocab-setup-option ${mode === 'en-to-ko' ? 'active' : ''}`}
                onClick={() => setMode('en-to-ko')}
              >
                <span className="vocab-setup-flag">🇺🇸</span>
                <span>영어 → 한국어</span>
                <span className="vocab-setup-desc">뜻 맞추기</span>
              </button>
              <button
                className={`vocab-setup-option ${mode === 'ko-to-en' ? 'active' : ''}`}
                onClick={() => setMode('ko-to-en')}
              >
                <span className="vocab-setup-flag">🇰🇷</span>
                <span>한국어 → 영어</span>
                <span className="vocab-setup-desc">단어 맞추기</span>
              </button>
            </div>
          </div>

          {/* 시험 방식 */}
          <div className="vocab-setup-section">
            <h3>✏️ 시험 방식</h3>
            <div className="vocab-setup-options">
              <button
                className={`vocab-setup-option ${quizType === 'choice' ? 'active' : ''}`}
                onClick={() => setQuizType('choice')}
              >
                <MousePointerClick size={20} />
                <span>4지선다</span>
                <span className="vocab-setup-desc">보기에서 고르기</span>
              </button>
              <button
                className={`vocab-setup-option ${quizType === 'typing' ? 'active' : ''}`}
                onClick={() => setQuizType('typing')}
              >
                <Pencil size={20} />
                <span>직접 쓰기</span>
                <span className="vocab-setup-desc">타이핑으로 입력</span>
              </button>
            </div>
          </div>

          <button
            className="vocab-start-btn"
            onClick={startQuiz}
            disabled={scopedWords.length < 2}
          >
            <Play size={18} />
            <span>시험 시작!</span>
          </button>

          {scopedWords.length < 2 && (
            <p className="vocab-setup-warning">
              ⚠️ 시험을 보려면 최소 2개 이상의 단어가 필요해요!
            </p>
          )}

          <button className="vocab-setup-back" onClick={onBack}>
            <ArrowLeft size={14} /> 단어장으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  // 문제 풀기 화면
  if (!currentItem) return null

  const questionText =
    mode === 'en-to-ko' ? currentItem.word.english : currentItem.word.korean
  const correctAnswer = currentItem.correctAnswer

  return (
    <div className="vocab-quiz-play">
      {/* 상단 진행 바 */}
      <div className="vocab-quiz-header">
        <div className="vocab-quiz-progress-bar">
          <div
            className="vocab-quiz-progress-fill"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
        <div className="vocab-quiz-counter">
          <span className="vocab-quiz-current">{currentIndex + 1}</span>
          <span className="vocab-quiz-separator">/</span>
          <span className="vocab-quiz-total">{totalQuestions}</span>
        </div>
      </div>

      {/* 문제 카드 */}
      <div className={`vocab-question-card ${state === 'answered' ? (isCorrect ? 'correct' : 'wrong') : ''}`}>
        <div className="vocab-question-label">
          {mode === 'en-to-ko' ? '이 영어 단어의 뜻은?' : '이 뜻의 영어 단어는?'}
        </div>

        {/* 질문 단어 + 발음 듣기 버튼 */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="vocab-question-word mb-0">{questionText}</div>
          <button
            type="button"
            onClick={playCurrentWordPronunciation}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-600 shadow-xs hover:bg-pink-200 hover:scale-105 active:scale-95 transition-all"
            title="원어민 발음 듣기"
          >
            <Volume2 size={20} />
          </button>
        </div>

        {/* 4지선다 (고정된 보기) */}
        {quizType === 'choice' && (
          <div className="vocab-options-grid">
            {currentOptions.map((option, idx) => {
              let optionClass = 'vocab-option'
              if (state === 'answered') {
                if (option === correctAnswer) {
                  optionClass += ' correct'
                } else if (option === selectedAnswer && !isCorrect) {
                  optionClass += ' wrong'
                } else {
                  optionClass += ' disabled'
                }
              }

              return (
                <button
                  key={idx}
                  className={optionClass}
                  onClick={() => checkAnswer(option)}
                  disabled={state === 'answered'}
                >
                  <span className="vocab-option-number">{idx + 1}</span>
                  <span className="vocab-option-text">{option}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* 타이핑 */}
        {quizType === 'typing' && (
          <div className="vocab-typing-area">
            {state !== 'answered' ? (
              <form
                onSubmit={e => {
                  e.preventDefault()
                  if (typedAnswer.trim()) checkAnswer(typedAnswer)
                }}
                className="vocab-typing-form"
              >
                <input
                  type="text"
                  value={typedAnswer}
                  onChange={e => setTypedAnswer(e.target.value)}
                  placeholder={
                    mode === 'en-to-ko'
                      ? '한국어 뜻을 입력하세요...'
                      : '영어 단어를 입력하세요...'
                  }
                  className="vocab-typing-input"
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  className="vocab-typing-submit"
                  disabled={!typedAnswer.trim()}
                >
                  확인!
                </button>
              </form>
            ) : (
              <div className="vocab-typing-result">
                <div className="vocab-typed-answer">
                  <span className="vocab-typed-label">내 답:</span>
                  <span className={isCorrect ? 'correct' : 'wrong'}>
                    {selectedAnswer}
                  </span>
                </div>
                {!isCorrect && (
                  <div className="vocab-correct-answer">
                    <span className="vocab-typed-label">정답:</span>
                    <span>{correctAnswer}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 정답/오답 피드백 */}
        {state === 'answered' && (
          <div className={`vocab-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
            <span className="vocab-feedback-emoji">
              {isCorrect ? '🎉 맞았어요!' : '😅 아쉬워요!'}
            </span>
            {!isCorrect && quizType === 'choice' && (
              <span className="vocab-feedback-correct">
                정답: <strong>{correctAnswer}</strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 다음 문제 버튼 */}
      {state === 'answered' && (
        <button className="vocab-next-btn" onClick={nextQuestion}>
          {currentIndex + 1 >= totalQuestions ? (
            <>
              <Trophy size={18} /> 결과 보기
            </>
          ) : (
            <>
              다음 문제 <ChevronRight size={18} />
            </>
          )}
        </button>
      )}
    </div>
  )
}
