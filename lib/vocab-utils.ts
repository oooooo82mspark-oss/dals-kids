/** 파일에서 영단어를 추출하는 유틸리티 함수들 */

import type { VocabWord } from './vocab-types'

// 학습지, 워크시트, 시험지 메타데이터 키워드 (단어 목록에서 제외)
const STOP_WORDS = new Set([
  'date', 'name', 'teacher', 'parents', 'book', 'title',
  'read', 'out', 'loud', 'at', 'least', 'times', 'write', 'over',
  'word', 'meaning', 'wise', 'reader', 'page', 'unit', 'lesson',
  'review', 'test', 'score', 'english', 'korean', 'vocabulary',
  'check', 'point', 'homework', 'signature',
])

/**
 * 텍스트나 OCR 결과에서 영단어-한국어 뜻 쌍을 스마트하게 추출
 * 지원 형식:
 *  1. 구분자 형식: "apple - 사과", "apple : 사과", "apple, 사과", "apple\t사과"
 *  2. 워크시트/시험지 표 형식 (번호 + 단어 + 뜻):
 *     "1  January  1월"
 *     "17 first place 1등"
 *     "20 collar 개 목걸이"
 *  3. 2단 표 가로 나열 형식:
 *     "1 January 1월 11 July 7월"
 *  4. 스페이스로 구분된 영단어 + 한글:
 *     "excitement 즐거움"
 *     "basement 지하실"
 *  5. 멀티라인 토큰 스트림 (OCR 순차 텍스트):
 *     1
 *     January
 *     January (손글씨)
 *     1월
 *     1월 (손글씨)
 */
export function parseTextToWords(text: string): VocabWord[] {
  if (!text || typeof text !== 'string') return []

  const words: VocabWord[] = []
  const seenEnglish = new Set<string>()

  const addWord = (rawEn: string, rawKo: string) => {
    const en = rawEn.trim().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '')
    const ko = rawKo.trim().replace(/^[^가-힣0-9]+|[^가-힣0-9]+$/g, '')

    // 유효성 검사
    if (!en || !ko) return
    if (en.length < 2) return // 1글자 노이즈 제거
    if (STOP_WORDS.has(en.toLowerCase())) return
    // 한글이 적어도 한 글자 이상 포함되어야 함
    if (!/[가-힣]/.test(ko)) return
    // 영단어는 알파벳, 띄어쓰기, 하이픈, 아포스트로피만 허용
    if (!/^[a-zA-Z][a-zA-Z\s\-']*$/.test(en)) return

    const normalizedEn = en.toLowerCase()
    if (!seenEnglish.has(normalizedEn)) {
      seenEnglish.add(normalizedEn)
      words.push({
        id: crypto.randomUUID(),
        english: en,
        korean: ko,
        memorized: false,
        wrongCount: 0,
        correctCount: 0,
      })
    }
  }

  // 1차 시도: 라인 단위 분석
  const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)

  for (const line of rawLines) {
    // 시험지 상하단 안내문 등 무시
    if (
      line.includes('문맥을 고려한') ||
      line.includes('Book Title') ||
      line.includes('Read out loud')
    ) {
      continue
    }

    // 1-1. 명시적 구분자가 있는 경우
    if (line.includes(' - ') || line.includes(' : ') || line.includes(' = ') || line.includes('\t')) {
      const parts = line.split(/\s*[-:=]\s*|\t/).map(p => p.trim()).filter(Boolean)
      if (parts.length >= 2) {
        // 첫 번째가 영어, 두 번째가 한글인 경우
        if (/[a-zA-Z]/.test(parts[0]) && /[가-힣]/.test(parts[1])) {
          addWord(parts[0], parts[1])
          continue
        }
      }
    }

    // 1-2. 쉼표(CSV) 구분
    if (line.includes(',')) {
      const parts = line.split(',').map(p => p.trim().replace(/^"(.*)"$/, '$1')).filter(Boolean)
      if (parts.length >= 2 && /[a-zA-Z]/.test(parts[0]) && /[가-힣]/.test(parts[1])) {
        addWord(parts[0], parts[1])
        continue
      }
    }

    // 1-3. 워크시트 2단 표 및 번호 표 정규식 매칭
    // 예: "1 January 1월 11 July 7월"
    // 예: "17 first place 1등"
    // 패턴: (선택적 번호) (영단어 또는 2단어 구) (한글 뜻)
    const tableRegex = /(?:^|\s)(?:\d{1,3}\s+)?([a-zA-Z][a-zA-Z\-']*(?:\s+[a-zA-Z\-']+)?)\s+([0-9]*[가-힣]+[가-힣0-9\s,\.·~]*?)(?=(?:\s+\d{1,3}\s+[a-zA-Z]|\s+[a-zA-Z][a-zA-Z\-']*\s+[0-9]*[가-힣]|$))/g

    let match: RegExpExecArray | null
    let matchedInLine = false

    while ((match = tableRegex.exec(line)) !== null) {
      const enCandidate = match[1]?.trim()
      const koCandidate = match[2]?.trim()

      if (enCandidate && koCandidate && /[가-힣]/.test(koCandidate)) {
        addWord(enCandidate, koCandidate)
        matchedInLine = true
      }
    }

    if (matchedInLine) continue

    // 1-4. 단순 스페이스로 구분된 [영어단어/숙어] [한글뜻]
    // 예: "excitement 즐거움", "collar 개 목걸이"
    const simpleSpaceMatch = line.match(/^(\d{1,3}\s+)?([a-zA-Z][a-zA-Z\s\-']+?)\s+([0-9]*[가-힣][가-힣0-9\s,\.·~]*)$/)
    if (simpleSpaceMatch) {
      addWord(simpleSpaceMatch[2], simpleSpaceMatch[3])
      continue
    }
  }

  // 2차 시도: 만약 라인 단위 분석으로 단어가 3개 미만으로 나왔다면,
  // OCR 특성상 줄바꿈이 토큰마다 발생했을 수 있으므로 순차 토큰 스트림으로 재시도
  if (words.length < 3) {
    const tokens = text
      .split(/\s+/)
      .map(t => t.trim())
      .filter(t => t.length > 0 && !STOP_WORDS.has(t.toLowerCase()))

    let i = 0
    while (i < tokens.length) {
      const token = tokens[i]

      // 순수 숫자(번호)는 스킵
      if (/^\d{1,3}$/.test(token)) {
        i++
        continue
      }

      // 영어 토큰 발견
      if (/^[a-zA-Z][a-zA-Z\-']*$/.test(token)) {
        let enPhrase = token

        // 다음 토큰도 영어인 경우 (예: "first place" 또는 손글씨로 같은 단어 반복 "January January")
        if (i + 1 < tokens.length && /^[a-zA-Z][a-zA-Z\-']*$/.test(tokens[i + 1])) {
          // 손글씨 중복 (동일하거나 매우 유사한 단어)인 경우 스킵
          if (tokens[i + 1].toLowerCase() === token.toLowerCase()) {
            i++ // 손글씨 중복 무시
          } else {
            // "first place" 같은 2단어 구
            enPhrase += ' ' + tokens[i + 1]
            i++
          }
        }

        // 그 다음 토큰에서 한글 뜻 찾기
        if (i + 1 < tokens.length) {
          const nextToken = tokens[i + 1]
          if (/[가-힣]/.test(nextToken)) {
            let koMeaning = nextToken

            // 그 뒤 토큰도 한글이고 손글씨 중복이 아니면 병합 (예: "개 목걸이")
            if (i + 2 < tokens.length && /[가-힣]/.test(tokens[i + 2])) {
              if (tokens[i + 2] !== nextToken) {
                koMeaning += ' ' + tokens[i + 2]
                i++
              } else {
                // 손글씨 중복 "1월 1월"
                i++
              }
            }

            addWord(enPhrase, koMeaning)
            i += 2
            continue
          }
        }
      }

      i++
    }
  }

  return words
}

/** localStorage에 단어장 저장 */
export function saveVocabSets(sets: import('./vocab-types').VocabSet[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dals-vocab-sets', JSON.stringify(sets))
  }
}

/** localStorage에서 단어장 로드 */
export function loadVocabSets(): import('./vocab-types').VocabSet[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('dals-vocab-sets')
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

/** 퀴즈용 선택지 생성 (4지선다) */
export function generateQuizOptions(
  correctAnswer: string,
  allAnswers: string[],
  count: number = 4
): string[] {
  const options = new Set<string>([correctAnswer])
  const filteredAnswers = allAnswers.filter(a => a !== correctAnswer)

  while (options.size < count && filteredAnswers.length > 0) {
    const randomIdx = Math.floor(Math.random() * filteredAnswers.length)
    options.add(filteredAnswers[randomIdx])
    filteredAnswers.splice(randomIdx, 1)
  }

  // 셔플
  return Array.from(options).sort(() => Math.random() - 0.5)
}

/** 배열 셔플 (Fisher-Yates) */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** 영단어 발음 듣기 (Web Speech API) */
export function speakEnglish(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

  try {
    // 이전 발음 정지
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.88 // 어린이 학습용으로 살짝 또렷하고 여유로운 속도
    utterance.pitch = 1.05 // 밝고 또렷한 톤

    // 미국 영어 음성 우선 매칭
    const voices = window.speechSynthesis.getVoices()
    const usVoice = voices.find(v => v.lang === 'en-US' || v.lang.startsWith('en'))
    if (usVoice) {
      utterance.voice = usVoice
    }

    window.speechSynthesis.speak(utterance)
  } catch (err) {
    console.error('Speech synthesis error:', err)
  }
}

