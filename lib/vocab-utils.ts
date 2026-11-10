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

// 유효한 2글자 영단어 화이트리스트 (cs, wb, jy 등 OCR 깨진 글자 차단)
const VALID_2_LETTER_WORDS = new Set([
  'am', 'an', 'as', 'at', 'be', 'by', 'do', 'go', 'he', 'hi',
  'if', 'in', 'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or',
  'so', 'to', 'up', 'us', 'we', 'ox'
])

// 자주 출제되는 영어 리더스북/시험지 프리셋 사전 (OCR로 책 제목 또는 본문 단어 감지 시 100% 자동 매칭)
export const WORKSHEET_BOOK_PRESETS: {
  keywords: string[]
  distinctiveWords: string[]
  title: string
  words: { english: string; korean: string }[]
}[] = [
  {
    keywords: [
      'curious george', 'first day of school', 'curious', 'george',
      '큐리어스', '조지', '호기심 많은 조지'
    ],
    distinctiveWords: [
      'summer', 'tomorrow', 'first grade', 'allow', 'recess',
      'well-balanced', 'barely', 'big day', 'wave at', 'pet', 'wish', 'mess'
    ],
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
    keywords: [
      'henry and mudge', 'snowman plan', 'mudge', 'snowman', 'henry',
      '헨리', '머지', '눈사람'
    ],
    distinctiveWords: [
      'january', 'excitement', 'basement', 'mustache', 'shovel',
      'marble', 'alien', 'first place', 'collar', 'messy', 'announce'
    ],
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
  {
    keywords: [
      'harry the dirty dog', 'harry dirty dog', 'harry', 'dirty dog',
      '해리', '더러운 개 해리'
    ],
    distinctiveWords: [
      'dirty', 'railroad', 'crawl', 'furiously', 'wag',
      'chute', 'scrub', 'certainly', 'give up', 'by the way'
    ],
    title: 'Harry the Dirty Dog',
    words: [
      { english: 'dirty', korean: '더러운' },
      { english: 'fix', korean: '수리하다' },
      { english: 'railroad', korean: '철로' },
      { english: 'wonder', korean: '궁금해하다' },
      { english: 'crawl', korean: '기어가다' },
      { english: 'strange', korean: '이상한' },
      { english: 'clever', korean: '영리한' },
      { english: 'suddenly', korean: '갑자기' },
      { english: 'furiously', korean: '맹렬히' },
      { english: 'wag', korean: '(꼬리를) 흔들다' },
      { english: 'certainly', korean: '확실히' },
      { english: 'chute', korean: '활송 장치' },
      { english: 'in fact', korean: '사실은' },
      { english: 'run away', korean: '도망가다' },
      { english: 'without', korean: '~없이' },
      { english: 'by the way', korean: '그런데' },
      { english: 'give up', korean: '포기하다' },
      { english: 'bark', korean: '짖다' },
      { english: 'beg', korean: '간청하다' },
      { english: 'scrub', korean: '문질러 씻다' },
    ],
  },
  {
    keywords: [
      'billy the ghost and me', 'billy the ghost', 'billy ghost',
      '빌리', '유령 빌리', 'billy the ghost & me'
    ],
    distinctiveWords: [
      'pain', 'practice', 'yell', 'deputy', 'mustache',
      'a bunch of', 'grin', 'fool around', 'escape', 'float',
      'pound', 'rein', 'jab', 'peek', 'grubby',
      'elbow', 'polite', 'pinch', 'lasso', 'reach'
    ],
    title: 'Billy the Ghost and Me',
    words: [
      { english: 'pain', korean: '고통, 골칫거리' },
      { english: 'practice', korean: '연습' },
      { english: 'yell', korean: '소리치다' },
      { english: 'deputy', korean: '보안관' },
      { english: 'mustache', korean: '콧수염' },
      { english: 'a bunch of', korean: '다발, 묶음' },
      { english: 'grin', korean: '활짝 웃다' },
      { english: 'fool around', korean: '노닥거리다' },
      { english: 'escape', korean: '도망치다' },
      { english: 'float', korean: '떠오르다' },
      { english: 'pound', korean: '쿵쿵거리다' },
      { english: 'rein', korean: '고삐' },
      { english: 'jab', korean: '찌르다' },
      { english: 'peek', korean: '훔쳐보다' },
      { english: 'grubby', korean: '더러운' },
      { english: 'elbow', korean: '팔꿈치' },
      { english: 'polite', korean: '예의바른' },
      { english: 'pinch', korean: '꼬집다' },
      { english: 'lasso', korean: '올가미 밧줄' },
      { english: 'reach', korean: '도달하다' },
    ],
  },
  {
    keywords: [
      'count the blessings', 'berenstain bears count the blessings', 'count the blessing',
      '축복', '곰돌이 축복', 'the berenstain bears count the blessings'
    ],
    distinctiveWords: [
      'supper', 'skip', 'sigh', 'roar', 'electrical',
      'complain', 'sturdy', 'thunder', 'storm', 'appreciate',
      'streak', 'cozy', 'nervous', 'rush', 'glow', 'sip'
    ],
    title: 'The Berenstain Bears Count the Blessings',
    words: [
      { english: 'supper', korean: '저녁' },
      { english: 'skip', korean: '건너뛰다' },
      { english: 'sigh', korean: '한숨쉬다' },
      { english: 'roar', korean: '으르렁거리다' },
      { english: 'electrical', korean: '전기의' },
      { english: 'complain', korean: '불평하다' },
      { english: 'flash', korean: '번쩍이다' },
      { english: "count one's blessings", korean: '(힘들 때) 좋았던 일을 떠올리다' },
      { english: 'sturdy', korean: '튼튼한' },
      { english: 'thunder', korean: '천둥' },
      { english: 'storm', korean: '폭풍' },
      { english: 'count', korean: '수를 세다' },
      { english: 'appreciate', korean: '고마워하다' },
      { english: 'blessing', korean: '축복' },
      { english: 'streak', korean: '(빛의) 줄기' },
      { english: 'cozy', korean: '아늑한' },
      { english: 'nervous', korean: '불안한, 긴장한' },
      { english: 'rush', korean: '돌진하다' },
      { english: 'glow', korean: '빛나다' },
      { english: 'sip', korean: '(음료를) 훌쩍이다' },
    ],
  },
  {
    keywords: [
      'berenstain bears', 'missing honey', 'berenstain', 'bears and the missing honey',
      '베런스타인', '곰돌이', 'the berenstain bears and the missing honey'
    ],
    distinctiveWords: [
      'whoever', 'whistle', 'hound', 'detective', 'belief',
      'thief', 'scent', 'perfume', 'butcher', 'indeed',
      'stump', 'breeze', 'cane', 'tough', 'in spite of'
    ],
    title: 'The Berenstain Bears and the Missing Honey',
    words: [
      { english: 'whoever', korean: '누구든' },
      { english: 'whistle', korean: '호루라기' },
      { english: 'hound', korean: '사냥개' },
      { english: 'detective', korean: '탐정' },
      { english: 'belief', korean: '신념, 믿음' },
      { english: 'thief', korean: '도둑' },
      { english: 'scent', korean: '향기, 냄새' },
      { english: 'perfume', korean: '향수' },
      { english: 'butcher', korean: '정육점 주인' },
      { english: 'indeed', korean: '정말, 확실히' },
      { english: 'crime', korean: '범죄' },
      { english: 'stump', korean: '쩔쩔매게 하다' },
      { english: 'breeze', korean: '산들바람' },
      { english: 'missing', korean: '없어진' },
      { english: 'cane', korean: '지팡이' },
      { english: 'trip', korean: '넘어지다' },
      { english: 'tough', korean: '힘든, 어려운' },
      { english: 'dare', korean: '~할 용기가 있다' },
      { english: 'in spite of', korean: '~에도 불구하고' },
      { english: 'tip', korean: '기울이다' },
    ],
  },
  {
    keywords: [
      "burglar's breakfast", 'the burglar\'s breakfast', 'burglar', 'breakfast',
      '버글러', '도둑의 아침식사', 'the burglar’s breakfast', 'burglar’s'
    ],
    distinctiveWords: [
      'lawn', 'burglar', 'magnify', 'snaffle', 'villain',
      'invisible', 'grumpy', 'interrupt', 'stride', 'at least', 'make sure'
    ],
    title: "The Burglar's Breakfast",
    words: [
      { english: 'lawn', korean: '잔디' },
      { english: 'burglar', korean: '강도' },
      { english: 'hunt', korean: '사냥하다' },
      { english: 'decide', korean: '결정하다' },
      { english: 'magnify', korean: '확대하다' },
      { english: 'trail', korean: '~의 뒤를 밟다' },
      { english: 'snaffle', korean: '손에 넣다' },
      { english: 'villain', korean: '악인' },
      { english: 'glance', korean: '힐끗 보다' },
      { english: 'invisible', korean: '눈에 보이지 않는' },
      { english: 'mow', korean: '깎다, 베다' },
      { english: 'whole', korean: '전체의' },
      { english: 'at least', korean: '적어도' },
      { english: 'make sure', korean: '확실히 하다' },
      { english: 'run out of~', korean: '~가 떨어지다' },
      { english: 'notice', korean: '알아채다' },
      { english: 'grumpy', korean: '심술궂은' },
      { english: 'interrupt', korean: '방해하다' },
      { english: 'instead of~', korean: '~ 대신에' },
      { english: 'stride', korean: '성큼성큼 걷다' },
    ],
  },
]

/** 텍스트 정규화: 유니코드 따옴표, 특수기호, 공백 통일 */
export function normalizeWorksheetText(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u201A\u201B\u2032`']/g, "'") // 모든 유니코드 작은따옴표를 표준 아포스트로피로
    .replace(/[\u201C\u201D\u201E\u201F"]/g, '"')
    .replace(/[-_~–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 텍스트에서 책 제목 또는 본문 단어 패턴을 감지하여 프리셋이 있는지 확인 */
export function detectWorksheetPreset(text: string) {
  if (!text) return null
  const normalized = normalizeWorksheetText(text)
  const compact = normalized.replace(/[^a-z0-9가-힣]/g, '') // 공백/특수문자 모두 제거한 비교용

  for (const preset of WORKSHEET_BOOK_PRESETS) {
    // 1. 키워드/제목 직접 매칭 (정규화된 텍스트 및 공백제거 텍스트 양방향)
    for (const kw of preset.keywords) {
      const normKw = normalizeWorksheetText(kw)
      const compactKw = normKw.replace(/[^a-z0-9가-힣]/g, '')
      if (normalized.includes(normKw) || (compactKw.length >= 4 && compact.includes(compactKw))) {
        return preset
      }
    }

    // 2. 책 제목의 핵심 영단어가 텍스트에 모두 포함되어 있는지 확인
    // 예: 'burglar' + 'breakfast', 'harry' + 'dirty' + 'dog', 'henry' + 'mudge', 'curious' + 'george'
    const titleWords = preset.title
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(w => !['the', 'and', 'of', 'in', 'on', 'a', 'an'].includes(w))

    if (titleWords.length >= 2 && titleWords.every(tw => normalized.includes(tw))) {
      return preset
    }

    // 3. 시험지 본문 고유 단어 2개 이상 일치 시 자동 감지 (제목이 잘렸거나 노이즈가 심할 때)
    const matchCount = preset.distinctiveWords.filter(w => normalized.includes(w.toLowerCase())).length
    if (matchCount >= 2) {
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

    // 2글자 단어는 유효한 단어(am, an, in, on 등)만 허용 (cs, wb, jy 등 노이즈 차단)
    if (en.length === 2 && !VALID_2_LETTER_WORDS.has(en.toLowerCase())) return

    // 한글이 적어도 한 글자 이상 포함되어야 하며, 영문자가 섞인 열 혼입 노이즈는 제외
    if (!/[가-힣]/.test(ko)) return
    if (/[a-zA-Z]/.test(ko)) return

    // 영단어는 알파벳, 띄어쓰기, 하이픈, 아포스트로피만 허용 (예: well-balanced, wait for)
    if (!/^[a-zA-Z][a-zA-Z\s\-']*$/.test(en)) return

    // ⭐️ 중요: "Ea TS", "a SR", "s a", "I BN" 같은 비정상적인 1~2글자 분절 노이즈 차단
    const parts = en.split(/\s+/)
    if (parts.some(p => p.length === 1 && p !== 'a' && p !== 'I')) return
    if (parts.length > 1 && parts.every(p => p.length <= 2)) return // "Ea TS", "s a" 등 차단

    // ⭐️ 손글씨 중복 및 변형 차단:
    // 시험지 표에서 학생이 바로 아래 칸에 따라 쓴 손글씨는
    // 이미 추가된 영단어와 동일하거나 1~2글자 오타(Levenshtein 거리 1 이하) 형태입니다.
    const normalizedEn = en.toLowerCase()

    // 1) 완전 일치 중복은 손글씨 따라쓰기이므로 무시
    if (seenEnglish.has(normalizedEn)) return

    // 2) 기존에 이미 등록된 단어와 유사한 단어(손글씨 오인식 변형) 체크
    for (const existing of seenEnglish) {
      if (Math.abs(existing.length - normalizedEn.length) <= 1) {
        // 간단한 편집 거리 체크 (길이 차이 1 이하 & 시작 글자 동일)
        if (existing.startsWith(normalizedEn[0])) {
          let diffCount = 0
          const minLen = Math.min(existing.length, normalizedEn.length)
          for (let c = 0; c < minLen; c++) {
            if (existing[c] !== normalizedEn[c]) diffCount++
          }
          diffCount += Math.abs(existing.length - normalizedEn.length)
          // 4글자 이상 단어에서 1글자만 다른 것은 손글씨 오인식 조각이므로 무시
          if (existing.length >= 4 && diffCount <= 1) {
            return
          }
        }
      }
    }

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

// 기본 탑재 단어장 (첫 방문 또는 초기화 시 바로 제공)
export const DEFAULT_VOCAB_SETS: import('./vocab-types').VocabSet[] = [
  {
    id: 'preset-curious-george',
    name: "Curious George's First Day of School",
    createdAt: '2026-10-24T09:00:00.000Z',
    lastTestedAt: null,
    words: [
      { id: 'cg-1', english: 'summer', korean: '여름', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-2', english: 'tomorrow', korean: '내일', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-3', english: 'first grade', korean: '1학년', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-4', english: 'with', korean: '~와 함께', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-5', english: 'get to', korean: '도착하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-6', english: 'allow', korean: '허락하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-7', english: 'pet', korean: '쓰다듬다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-8', english: 'wish', korean: '원하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-9', english: 'over', korean: '끝난', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-10', english: 'wait for', korean: '~을 기다리다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-11', english: 'curious', korean: '궁금한', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-12', english: 'excited', korean: '신이 난', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-13', english: 'barely', korean: '간신히', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-14', english: 'big day', korean: '중요한 날', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-15', english: 'pick up', korean: '차에 태우다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-16', english: 'wave at', korean: '손을 흔들다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-17', english: 'recess', korean: '쉬는 시간', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-18', english: 'well-balanced', korean: '균형잡힌', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-19', english: 'mix', korean: '섞다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'cg-20', english: 'mess', korean: '엉망인 상태', memorized: false, wrongCount: 0, correctCount: 0 },
    ],
  },
  {
    id: 'preset-henry-mudge',
    name: 'Henry and Mudge and the Snowman Plan',
    createdAt: '2026-10-15T09:00:00.000Z',
    lastTestedAt: null,
    words: [
      { id: 'hm-1', english: 'January', korean: '1월', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-2', english: 'excitement', korean: '즐거움', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-3', english: 'sometimes', korean: '가끔', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-4', english: 'basement', korean: '지하실', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-5', english: 'mustache', korean: '콧수염', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-6', english: 'chin', korean: '턱', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-7', english: 'elbow', korean: '팔꿈치', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-8', english: 'shovel', korean: '삽', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-9', english: 'marble', korean: '구슬', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-10', english: 'already', korean: '벌써', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-11', english: 'July', korean: '7월', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-12', english: 'judge', korean: '판사', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-13', english: 'alien', korean: '외계인', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-14', english: 'original', korean: '독창적인', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-15', english: 'prize', korean: '상', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-16', english: 'announce', korean: '발표하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-17', english: 'first place', korean: '1등', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-18', english: 'messy', korean: '지저분한', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-19', english: 'arrive', korean: '도착하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hm-20', english: 'collar', korean: '개 목걸이', memorized: false, wrongCount: 0, correctCount: 0 },
    ],
  },
  {
    id: 'preset-harry-dirty-dog',
    name: 'Harry the Dirty Dog',
    createdAt: '2026-11-05T09:00:00.000Z',
    lastTestedAt: null,
    words: [
      { id: 'hd-1', english: 'dirty', korean: '더러운', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-2', english: 'fix', korean: '수리하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-3', english: 'railroad', korean: '철로', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-4', english: 'wonder', korean: '궁금해하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-5', english: 'crawl', korean: '기어가다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-6', english: 'strange', korean: '이상한', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-7', english: 'clever', korean: '영리한', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-8', english: 'suddenly', korean: '갑자기', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-9', english: 'furiously', korean: '맹렬히', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-10', english: 'wag', korean: '(꼬리를) 흔들다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-11', english: 'certainly', korean: '확실히', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-12', english: 'chute', korean: '활송 장치', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-13', english: 'in fact', korean: '사실은', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-14', english: 'run away', korean: '도망가다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-15', english: 'without', korean: '~없이', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-16', english: 'by the way', korean: '그런데', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-17', english: 'give up', korean: '포기하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-18', english: 'bark', korean: '짖다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-19', english: 'beg', korean: '간청하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'hd-20', english: 'scrub', korean: '문질러 씻다', memorized: false, wrongCount: 0, correctCount: 0 },
    ],
  },
  {
    id: 'preset-billy-ghost',
    name: 'Billy the Ghost and Me',
    createdAt: '2026-11-09T09:00:00.000Z',
    lastTestedAt: null,
    words: [
      { id: 'bg-1', english: 'pain', korean: '고통, 골칫거리', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-2', english: 'practice', korean: '연습', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-3', english: 'yell', korean: '소리치다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-4', english: 'deputy', korean: '보안관', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-5', english: 'mustache', korean: '콧수염', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-6', english: 'a bunch of', korean: '다발, 묶음', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-7', english: 'grin', korean: '활짝 웃다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-8', english: 'fool around', korean: '노닥거리다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-9', english: 'escape', korean: '도망치다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-10', english: 'float', korean: '떠오르다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-11', english: 'pound', korean: '쿵쿵거리다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-12', english: 'rein', korean: '고삐', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-13', english: 'jab', korean: '찌르다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-14', english: 'peek', korean: '훔쳐보다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-15', english: 'grubby', korean: '더러운', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-16', english: 'elbow', korean: '팔꿈치', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-17', english: 'polite', korean: '예의바른', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-18', english: 'pinch', korean: '꼬집다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-19', english: 'lasso', korean: '올가미 밧줄', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bg-20', english: 'reach', korean: '도달하다', memorized: false, wrongCount: 0, correctCount: 0 },
    ],
  },
  {
    id: 'preset-berenstain-blessings',
    name: 'The Berenstain Bears Count the Blessings',
    createdAt: '2026-10-30T09:00:00.000Z',
    lastTestedAt: null,
    words: [
      { id: 'bbb-1', english: 'supper', korean: '저녁', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-2', english: 'skip', korean: '건너뛰다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-3', english: 'sigh', korean: '한숨쉬다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-4', english: 'roar', korean: '으르렁거리다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-5', english: 'electrical', korean: '전기의', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-6', english: 'complain', korean: '불평하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-7', english: 'flash', korean: '번쩍이다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-8', english: "count one's blessings", korean: '(힘들 때) 좋았던 일을 떠올리다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-9', english: 'sturdy', korean: '튼튼한', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-10', english: 'thunder', korean: '천둥', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-11', english: 'storm', korean: '폭풍', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-12', english: 'count', korean: '수를 세다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-13', english: 'appreciate', korean: '고마워하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-14', english: 'blessing', korean: '축복', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-15', english: 'streak', korean: '(빛의) 줄기', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-16', english: 'cozy', korean: '아늑한', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-17', english: 'nervous', korean: '불안한, 긴장한', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-18', english: 'rush', korean: '돌진하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-19', english: 'glow', korean: '빛나다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbb-20', english: 'sip', korean: '(음료를) 훌쩍이다', memorized: false, wrongCount: 0, correctCount: 0 },
    ],
  },
  {
    id: 'preset-berenstain-bears',
    name: 'The Berenstain Bears and the Missing Honey',
    createdAt: '2026-10-31T09:00:00.000Z',
    lastTestedAt: null,
    words: [
      { id: 'bbh-1', english: 'whoever', korean: '누구든', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-2', english: 'whistle', korean: '호루라기', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-3', english: 'hound', korean: '사냥개', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-4', english: 'detective', korean: '탐정', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-5', english: 'belief', korean: '신념, 믿음', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-6', english: 'thief', korean: '도둑', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-7', english: 'scent', korean: '향기, 냄새', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-8', english: 'perfume', korean: '향수', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-9', english: 'butcher', korean: '정육점 주인', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-10', english: 'indeed', korean: '정말, 확실히', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-11', english: 'crime', korean: '범죄', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-12', english: 'stump', korean: '쩔쩔매게 하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-13', english: 'breeze', korean: '산들바람', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-14', english: 'missing', korean: '없어진', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-15', english: 'cane', korean: '지팡이', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-16', english: 'trip', korean: '넘어지다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-17', english: 'tough', korean: '힘든, 어려운', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-18', english: 'dare', korean: '~할 용기가 있다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-19', english: 'in spite of', korean: '~에도 불구하고', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bbh-20', english: 'tip', korean: '기울이다', memorized: false, wrongCount: 0, correctCount: 0 },
    ],
  },
  {
    id: 'preset-burglar-breakfast',
    name: "The Burglar's Breakfast",
    createdAt: '2026-11-02T09:00:00.000Z',
    lastTestedAt: null,
    words: [
      { id: 'bb-1', english: 'lawn', korean: '잔디', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-2', english: 'burglar', korean: '강도', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-3', english: 'hunt', korean: '사냥하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-4', english: 'decide', korean: '결정하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-5', english: 'magnify', korean: '확대하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-6', english: 'trail', korean: '~의 뒤를 밟다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-7', english: 'snaffle', korean: '손에 넣다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-8', english: 'villain', korean: '악인', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-9', english: 'glance', korean: '힐끗 보다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-10', english: 'invisible', korean: '눈에 보이지 않는', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-11', english: 'mow', korean: '깎다, 베다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-12', english: 'whole', korean: '전체의', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-13', english: 'at least', korean: '적어도', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-14', english: 'make sure', korean: '확실히 하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-15', english: 'run out of~', korean: '~가 떨어지다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-16', english: 'notice', korean: '알아채다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-17', english: 'grumpy', korean: '심술궂은', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-18', english: 'interrupt', korean: '방해하다', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-19', english: 'instead of~', korean: '~ 대신에', memorized: false, wrongCount: 0, correctCount: 0 },
      { id: 'bb-20', english: 'stride', korean: '성큼성큼 걷다', memorized: false, wrongCount: 0, correctCount: 0 },
    ],
  },
]

/** localStorage에 단어장 저장 */
export function saveVocabSets(sets: import('./vocab-types').VocabSet[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dals-vocab-sets', JSON.stringify(sets))
  }
}

/** localStorage에서 단어장 로드 */
export function loadVocabSets(): import('./vocab-types').VocabSet[] {
  if (typeof window === 'undefined') return DEFAULT_VOCAB_SETS
  const data = localStorage.getItem('dals-vocab-sets')
  if (!data) return DEFAULT_VOCAB_SETS
  try {
    const parsed = JSON.parse(data)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return DEFAULT_VOCAB_SETS
  } catch {
    return DEFAULT_VOCAB_SETS
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
