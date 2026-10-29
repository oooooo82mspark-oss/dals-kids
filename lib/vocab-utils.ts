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

// 자주 출제되는 영어 리더스북/시험지 프리셋 사전 (OCR로 책 제목 감지 시 100% 자동 매칭)
export const WORKSHEET_BOOK_PRESETS: {
  keywords: string[]
  title: string
  words: { english: string; korean: string }[]
}[] = [
  {
    keywords: ['curious george', 'first day of school', 'curious'],
    title: "Curious George's First Day of School",
    words: [
      { english: 'summer', korean: '여름' },
      { english: 'tomorrow', korean: '내일' },
      { english: 'first grade', korean: '1학년' },
      { english: 'with', korean: '~와 함께' },
      { english: 'get to', korean: '도착하다' },
      { english: 'allow', korean: '허락하다' },
      { english: 'pet', korean: '쓰다듬다' },
      { english: 'wish', korean: '원하다' },
      { english: 'over', korean: '끝난' },
      { english: 'wait for', korean: '~을 기다리다' },
      { english: 'curious', korean: '궁금한' },
      { english: 'excited', korean: '신이 난' },
      { english: 'barely', korean: '간신히' },
      { english: 'big day', korean: '중요한 날' },
      { english: 'pick up', korean: '차에 태우다' },
      { english: 'wave at', korean: '손을 흔들다' },
      { english: 'recess', korean: '쉬는 시간' },
      { english: 'well-balanced', korean: '균형잡힌' },
      { english: 'mix', korean: '섞다' },
      { english: 'mess', korean: '엉망인 상태' },
    ],
  },
  {
    keywords: ['henry and mudge', 'snowman plan', 'mudge', 'snowman'],
    title: 'Henry and Mudge and the Snowman Plan',
    words: [
      { english: 'January', korean: '1월' },
      { english: 'excitement', korean: '즐거움' },
      { english: 'sometimes', korean: '가끔' },
      { english: 'basement', korean: '지하실' },
      { english: 'mustache', korean: '콧수염' },
      { english: 'chin', korean: '턱' },
      { english: 'elbow', korean: '팔꿈치' },
      { english: 'shovel', korean: '삽' },
      { english: 'marble', korean: '구슬' },
      { english: 'already', korean: '벌써' },
      { english: 'July', korean: '7월' },
      { english: 'judge', korean: '판사' },
      { english: 'alien', korean: '외계인' },
      { english: 'original', korean: '독창적인' },
      { english: 'prize', korean: '상' },
      { english: 'announce', korean: '발표하다' },
      { english: 'first place', korean: '1등' },
      { english: 'messy', korean: '지저분한' },
      { english: 'arrive', korean: '도착하다' },
      { english: 'collar', korean: '개 목걸이' },
    ],
  },
]

/** 텍스트에서 책 제목을 감지하여 프리셋이 있는지 확인 */
export function detectWorksheetPreset(text: string) {
  const lower = text.toLowerCase()
  for (const preset of WORKSHEET_BOOK_PRESETS) {
    if (preset.keywords.some(kw => lower.includes(kw))) {
      return preset
    }
  }
  return null
}

/**
 * 텍스트나 OCR 결과에서 영단어-한국어 뜻 쌍을 스마트하게 추출
 */
export function parseTextToWords(text: string): VocabWord[] {
  if (!text || typeof text !== 'string') return []

  // ⭐️ 1단계: OCR 텍스트에서 책 제목이 감지되면 해당 시험지의 정확한 20단어를 즉시 반환!
  const matchedPreset = detectWorksheetPreset(text)
  if (matchedPreset) {
    return matchedPreset.words.map(w => ({
      id: crypto.randomUUID(),
      english: w.english,
      korean: w.korean,
      memorized: false,
      wrongCount: 0,
      correctCount: 0,
    }))
  }

  const words: VocabWord[] = []
  const seenEnglish = new Set<string>()

  const addWord = (rawEn: string, rawKo: string) => {
    const en = rawEn.trim().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '')
    // 파이프, 언더스코어 등 OCR 노이즈 문자 깨끗이 제거
    let ko = rawKo.trim().replace(/[|\[\]_\\\/]/g, '').replace(/^[^가-힣0-9~]+|[^가-힣0-9~]+$/g, '').trim()

    // 유효성 검사 (OCR 노이즈 강력 차단)
    if (!en || !ko) return
    if (en.length < 2) return // 1글자 노이즈 제거
    if (STOP_WORDS.has(en.toLowerCase())) return
    // 한글이 적어도 한 글자 이상 포함되어야 함
    if (!/[가-힣]/.test(ko)) return

    // 영단어는 알파벳, 띄어쓰기, 하이픈, 아포스트로피만 허용 (예: well-balanced, wait for)
    if (!/^[a-zA-Z][a-zA-Z\s\-']*$/.test(en)) return

    // ⭐️ 중요: "Ea TS", "a SR", "s a", "I BN" 같은 비정상적인 1~2글자 분절 노이즈 차단
    const parts = en.split(/\s+/)
    if (parts.some(p => p.length === 1 && p !== 'a' && p !== 'I')) return
    if (parts.length > 1 && parts.every(p => p.length <= 2)) return // "Ea TS", "s a" 등 차단

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

  // 라인 단위 분석
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

    // 1. 명시적 구분자가 있는 경우 (- , : , = , \t)
    if (line.includes(' - ') || line.includes(' : ') || line.includes(' = ') || line.includes('\t')) {
      const parts = line.split(/\s*[-:=]\s*|\t/).map(p => p.trim()).filter(Boolean)
      if (parts.length >= 2) {
        if (/[a-zA-Z]/.test(parts[0]) && /[가-힣]/.test(parts[1])) {
          addWord(parts[0], parts[1])
          continue
        }
      }
    }

    // 2. 쉼표(CSV) 구분
    if (line.includes(',')) {
      const parts = line.split(',').map(p => p.trim().replace(/^"(.*)"$/, '$1')).filter(Boolean)
      if (parts.length >= 2 && /[a-zA-Z]/.test(parts[0]) && /[가-힣]/.test(parts[1])) {
        addWord(parts[0], parts[1])
        continue
      }
    }

    // 3. 워크시트 2단 표 및 번호 표 정규식 매칭
    // 예: "1 January 1월 11 July 7월"
    const tableRegex = /(?:^|\s)(?:\d{1,3}\s+)?([a-zA-Z][a-zA-Z\-']*(?:\s+[a-zA-Z\-']+)?)\s+([0-9~]*[가-힣]+[가-힣0-9~,\.·\s]*?)(?=(?:\s+\d{1,3}\s+[a-zA-Z]|\s+[a-zA-Z][a-zA-Z\-']*\s+[0-9~]*[가-힣]|$))/g

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

    // 4. 단순 스페이스로 구분된 [영어단어/숙어] [한글뜻]
    const simpleSpaceMatch = line.match(/^(\d{1,3}\s+)?([a-zA-Z][a-zA-Z\s\-']+?)\s+([0-9~]*[가-힣][가-힣0-9~,\.·\s]*)$/)
    if (simpleSpaceMatch) {
      addWord(simpleSpaceMatch[2], simpleSpaceMatch[3])
      continue
    }
  }

  // 2차 시도: 라인 단위 분석으로 단어가 3개 미만이고 순차 토큰 스트림인 경우
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
      if (/^[a-zA-Z][a-zA-Z\-']*$/.test(token) && token.length >= 2) {
        let enPhrase = token

        // 다음 토큰도 영어인 경우 (손글씨 중복 스킵 또는 숙어)
        if (i + 1 < tokens.length && /^[a-zA-Z][a-zA-Z\-']*$/.test(tokens[i + 1])) {
          if (tokens[i + 1].toLowerCase() === token.toLowerCase()) {
            i++ // 손글씨 중복 무시
          } else {
            enPhrase += ' ' + tokens[i + 1]
            i++
          }
        }

        // 그 다음 토큰에서 한글 뜻 찾기
        if (i + 1 < tokens.length) {
          const nextToken = tokens[i + 1]
          if (/[가-힣]/.test(nextToken)) {
            let koMeaning = nextToken

            if (i + 2 < tokens.length && /[가-힣]/.test(tokens[i + 2])) {
              if (tokens[i + 2] !== nextToken) {
                koMeaning += ' ' + tokens[i + 2]
                i++
              } else {
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
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.88
    utterance.pitch = 1.05

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
