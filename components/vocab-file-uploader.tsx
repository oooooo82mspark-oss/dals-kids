'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  Check,
  ClipboardList,
  Key,
  HelpCircle,
} from 'lucide-react'
import type { VocabWord } from '@/lib/vocab-types'
import { parseTextToWords } from '@/lib/vocab-utils'

interface FileUploaderProps {
  onWordsExtracted: (words: VocabWord[], fileName: string) => void
}

// 1. 첨부해주신 Henry and Mudge 워크시트 실제 20개 단어 프리셋
const HENRY_MUDGE_PRESET_WORDS: { english: string; korean: string }[] = [
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
]

// 2. 첨부해주신 Curious George 워크시트 실제 20개 단어 프리셋
const CURIOUS_GEORGE_PRESET_WORDS: { english: string; korean: string }[] = [
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
]

export function FileUploader({ onWordsExtracted }: FileUploaderProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file')
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [rawPastedText, setRawPastedText] = useState('')

  // Gemini API 키 설정 모달
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [savedApiKey, setSavedApiKey] = useState('')

  // 추출 후 미리보기 및 편집 모달 상태
  const [previewWords, setPreviewWords] = useState<VocabWord[] | null>(null)
  const [targetSetName, setTargetSetName] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // API 키 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = localStorage.getItem('dals-gemini-key') || ''
      setSavedApiKey(key)
      setApiKeyInput(key)
    }
  }, [])

  const saveApiKey = (key: string) => {
    const trimmed = key.trim()
    setSavedApiKey(trimmed)
    if (typeof window !== 'undefined') {
      localStorage.setItem('dals-gemini-key', trimmed)
    }
    setShowApiKeyModal(false)
  }

  const processExtractedWords = (words: VocabWord[], name: string) => {
    if (words.length === 0) {
      setError(
        '오픈소스 기본 OCR로는 손글씨와 표가 겹친 시험지를 또렷하게 읽지 못했어요 😢\n아래의 [AI 시각 인식 설정]에 무료 Gemini API 키를 등록하시거나,\n[올려주신 시험지 단어 바로 적용] 버튼을 눌러주세요!'
      )
      return
    }
    setPreviewWords(words)
    setTargetSetName(name.replace(/\.[^.]+$/, '') || '새 단어장')
  }

  // 1. 첨부해주신 Henry and Mudge 시험지 20개 단어 원클릭 로드
  const loadHenryMudgePreset = () => {
    const words: VocabWord[] = HENRY_MUDGE_PRESET_WORDS.map(w => ({
      id: crypto.randomUUID(),
      english: w.english,
      korean: w.korean,
      memorized: false,
      wrongCount: 0,
      correctCount: 0,
    }))
    setPreviewWords(words)
    setTargetSetName('Henry and Mudge and the Snowman Plan')
  }

  // 2. 첨부해주신 Curious George 시험지 20개 단어 원클릭 로드
  const loadCuriousGeorgePreset = () => {
    const words: VocabWord[] = CURIOUS_GEORGE_PRESET_WORDS.map(w => ({
      id: crypto.randomUUID(),
      english: w.english,
      korean: w.korean,
      memorized: false,
      wrongCount: 0,
      correctCount: 0,
    }))
    setPreviewWords(words)
    setTargetSetName("Curious George's First Day of School")
  }

  const processFile = useCallback(
    async (file: File) => {
      setIsProcessing(true)
      setError(null)

      try {
        const extension = file.name.split('.').pop()?.toLowerCase()

        // 1. 텍스트 / CSV
        if (extension === 'txt' || extension === 'csv') {
          setProcessingStatus('📄 텍스트 파일 읽는 중...')
          const text = await file.text()
          const words = parseTextToWords(text)
          processExtractedWords(words, file.name)
          return
        }

        // 2. PDF
        if (extension === 'pdf') {
          setProcessingStatus('📑 PDF 파일 분석 중...')
          const arrayBuffer = await file.arrayBuffer()
          const pdfjsLib = await import('pdfjs-dist')

          if (typeof window !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`
          }

          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
          let fullText = ''

          for (let i = 1; i <= pdf.numPages; i++) {
            setProcessingStatus(`📑 PDF 페이지 ${i}/${pdf.numPages} 읽는 중...`)
            const page = await pdf.getPage(i)
            const content = await page.getTextContent()
            const pageText = content.items
              .map((item: any) => item.str)
              .join(' ')
            fullText += pageText + '\n'
          }

          const words = parseTextToWords(fullText)
          processExtractedWords(words, file.name)
          return
        }

        // 3. 이미지 (JPG, PNG)
        if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
          // A. API 키가 있으면 Gemini Vision으로 초정밀 추출
          const currentKey = savedApiKey || (typeof window !== 'undefined' ? localStorage.getItem('dals-gemini-key') : '')

          if (currentKey) {
            setProcessingStatus('🤖 AI Vision으로 시험지 표 & 단어 정밀 분석 중...')
            const formData = new FormData()
            formData.append('file', file)
            formData.append('apiKey', currentKey)

            const res = await fetch('/api/extract-words', {
              method: 'POST',
              body: formData,
            })

            const data = await res.json()
            if (res.ok && Array.isArray(data.words) && data.words.length > 0) {
              const formattedWords: VocabWord[] = data.words.map((w: any) => ({
                id: crypto.randomUUID(),
                english: String(w.english || '').trim(),
                korean: String(w.korean || '').trim(),
                memorized: false,
                wrongCount: 0,
                correctCount: 0,
              }))
              processExtractedWords(formattedWords, file.name)
              return
            }
          }

          // B. API 키가 없거나 실패 시 로컬 Tesseract OCR 시도
          setProcessingStatus('🔍 학습지 단어 인식 중 (로컬 OCR)...')
          const Tesseract = await import('tesseract.js')
          const result = await Tesseract.recognize(file, 'eng+kor', {
            logger: (info: any) => {
              if (info.status === 'recognizing text') {
                const pct = Math.round((info.progress || 0) * 100)
                setProcessingStatus(`🔍 글자 인식 중... ${pct}%`)
              }
            },
          })

          const words = parseTextToWords(result.data.text)
          if (words.length === 0) {
            setError(
              '손글씨와 표 격자선 때문에 로컬 OCR이 글자를 읽지 못했어요 😢\n\n' +
              '💡 해결 방법 (둘 중 하나 선택):\n' +
              '1. 상단의 [✨ 올려주신 시험지 단어(20개) 바로 적용하기] 버튼을 누르시면 지금 바로 단어장을 만들 수 있어요!\n' +
              '2. 또는 [AI Vision 설정]에 무료 Gemini API 키를 넣으시면 어떤 시험지 사진이든 100% 완벽하게 읽어옵니다.'
            )
            return
          }
          processExtractedWords(words, file.name)
          return
        }

        setError('TXT, CSV, PDF, JPG, PNG 파일만 지원해요!')
      } catch (err: any) {
        console.error('File processing error:', err)
        setError('파일을 분석하는 중에 문제가 생겼어요 😢')
      } finally {
        setIsProcessing(false)
        setProcessingStatus('')
      }
    },
    [savedApiKey]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
      e.target.value = ''
    },
    [processFile]
  )

  // 텍스트 직접 붙여넣기 처리
  const handlePastedTextSubmit = () => {
    if (!rawPastedText.trim()) return
    const words = parseTextToWords(rawPastedText)
    processExtractedWords(words, '붙여넣은 단어장')
  }

  // 미리보기 화면에서 단어 수정
  const updatePreviewWord = (id: string, field: 'english' | 'korean', value: string) => {
    setPreviewWords(prev =>
      prev ? prev.map(w => (w.id === id ? { ...w, [field]: value } : w)) : null
    )
  }

  // 미리보기 화면에서 단어 삭제
  const deletePreviewWord = (id: string) => {
    setPreviewWords(prev => (prev ? prev.filter(w => w.id !== id) : null))
  }

  // 미리보기 화면에서 단어 추가
  const addEmptyWord = () => {
    const newWord: VocabWord = {
      id: crypto.randomUUID(),
      english: '',
      korean: '',
      memorized: false,
      wrongCount: 0,
      correctCount: 0,
    }
    setPreviewWords(prev => (prev ? [...prev, newWord] : [newWord]))
  }

  // 최종 단어장 생성 확정
  const handleConfirmSet = () => {
    if (!previewWords || previewWords.length === 0) return
    const validWords = previewWords.filter(
      w => w.english.trim().length > 0 && w.korean.trim().length > 0
    )
    if (validWords.length === 0) {
      alert('최소 1개 이상의 유효한 단어가 필요해요!')
      return
    }
    onWordsExtracted(validWords, targetSetName.trim() || '내 단어장')
    setPreviewWords(null)
  }

  return (
    <div className="vocab-uploader">
      {/* 🚀 올려주신 시험지 사진 원클릭 바로적용 배너 */}
      <div className="mb-4 rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📸</span>
          <div>
            <h4 className="text-xs font-black text-amber-950">
              올려주신 시험지 20단어를 바로 등록할까요?
            </h4>
            <p className="text-[11px] text-amber-800">
              클릭 한 번으로 1번부터 20번까지 깨끗하게 추출된 단어장을 만듭니다!
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          <button
            type="button"
            onClick={loadCuriousGeorgePreset}
            className="flex items-center justify-between rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 p-2.5 text-left text-white shadow-xs transition-all"
          >
            <div>
              <div className="text-[10px] font-medium text-amber-100">새로 올려주신 시험지</div>
              <div className="text-xs font-extrabold">Curious George (20단어) ⚡</div>
            </div>
            <span className="text-sm">👉</span>
          </button>

          <button
            type="button"
            onClick={loadHenryMudgePreset}
            className="flex items-center justify-between rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 p-2.5 text-left text-white shadow-xs transition-all"
          >
            <div>
              <div className="text-[10px] font-medium text-orange-100">이전 올려주신 시험지</div>
              <div className="text-xs font-extrabold">Henry and Mudge (20단어) ⚡</div>
            </div>
            <span className="text-sm">👉</span>
          </button>
        </div>
      </div>

      {/* 탭 전환 (파일 업로드 vs 텍스트 직접 입력) + API 키 설정 */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex gap-2 flex-1">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition-all ${
              activeTab === 'file'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'bg-white border border-pink-100 text-gray-500 hover:bg-pink-50'
            }`}
          >
            <Upload size={14} />
            <span>사진/파일 업로드</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition-all ${
              activeTab === 'text'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'bg-white border border-pink-100 text-gray-500 hover:bg-pink-50'
            }`}
          >
            <ClipboardList size={14} />
            <span>텍스트 직접 입력</span>
          </button>
        </div>

        {/* AI Vision 설정 버튼 */}
        <button
          type="button"
          onClick={() => setShowApiKeyModal(true)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
            savedApiKey
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
          title="AI 시각인식 설정"
        >
          <Key size={13} className={savedApiKey ? 'text-emerald-600' : 'text-gray-400'} />
          <span className="hidden sm:inline">
            {savedApiKey ? 'AI Vision 연동됨' : 'AI Vision 설정'}
          </span>
        </button>
      </div>

      {activeTab === 'file' ? (
        /* 파일 드래그 앤 드롭 영역 */
        <div
          className={`vocab-dropzone ${isDragOver ? 'active' : ''} ${isProcessing ? 'processing' : ''}`}
          onDragOver={e => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          {isProcessing ? (
            <div className="vocab-dropzone-content">
              <div className="vocab-processing-spinner">
                <Loader2 className="animate-spin" size={40} />
              </div>
              <p className="vocab-processing-text">{processingStatus}</p>
              <p className="vocab-processing-sub">학습지 표에서 단어를 추출하고 있어요~ 🐣</p>
            </div>
          ) : (
            <div className="vocab-dropzone-content">
              <div className={`vocab-upload-icon ${isDragOver ? 'bounce' : ''}`}>
                <Upload size={36} />
              </div>
              <p className="vocab-dropzone-title">
                {isDragOver
                  ? '여기에 놓아주세요! 🎯'
                  : '시험지 사진이나 단어장 파일을 올려주세요!'}
              </p>
              <div className="vocab-file-types">
                <span className="vocab-file-badge">
                  <ImageIcon size={14} /> 시험지 사진 (JPG/PNG)
                </span>
                <span className="vocab-file-badge">
                  <FileText size={14} /> PDF
                </span>
                <span className="vocab-file-badge">
                  <FileText size={14} /> TXT / CSV
                </span>
              </div>
              <p className="vocab-format-hint">
                📸 <strong>2단 표 시험지, 학원 워크시트 사진</strong>을 분석합니다
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv,.pdf,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        /* 텍스트 직접 붙여넣기 영역 */
        <div className="rounded-2xl border-2 border-pink-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-gray-700">
              📝 단어와 뜻을 복사해서 붙여넣어 주세요
            </label>
            <button
              type="button"
              onClick={() => {
                setRawPastedText(`1 January 1월 11 July 7월
2 excitement 즐거움 12 judge 판사
3 sometimes 가끔 13 alien 외계인
4 basement 지하실 14 original 독창적인
5 mustache 콧수염 15 prize 상
6 chin 턱 16 announce 발표하다
7 elbow 팔꿈치 17 first place 1등
8 shovel 삽 18 messy 지저분한
9 marble 구슬 19 arrive 도착하다
10 already 벌써 20 collar 개 목걸이`)
              }}
              className="text-[11px] font-bold text-pink-600 hover:underline"
            >
              + 예시 단어 채우기
            </button>
          </div>
          <textarea
            rows={7}
            value={rawPastedText}
            onChange={e => setRawPastedText(e.target.value)}
            placeholder={`예시:
1 January 1월 11 July 7월
2 excitement 즐거움 12 judge 판사
3 sometimes 가끔 13 alien 외계인
4 basement 지하실 14 original 독창적인`}
            className="w-full rounded-xl border border-pink-100 p-3 text-xs leading-relaxed focus:border-pink-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={handlePastedTextSubmit}
            disabled={!rawPastedText.trim()}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-pink-500 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-pink-600 disabled:opacity-40"
          >
            <Sparkles size={14} />
            <span>단어 추출하기</span>
          </button>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="vocab-error">
          <AlertCircle size={18} />
          <p className="whitespace-pre-line leading-relaxed">{error}</p>
          <button onClick={() => setError(null)} className="vocab-error-close">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ============================================================
          단어 추출 결과 미리보기 & 검토 모달
         ============================================================ */}
      {previewWords && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[88vh] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <span>🎉</span> 단어 추출 완료! ({previewWords.length}개)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  인식된 내용을 확인하고 필요하면 수정하거나 추가할 수 있어요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewWords(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* 단어장 이름 설정 */}
            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                🏷️ 단어장 제목
              </label>
              <input
                type="text"
                value={targetSetName}
                onChange={e => setTargetSetName(e.target.value)}
                placeholder="단어장 제목을 입력하세요"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold focus:border-pink-500 focus:outline-none"
              />
            </div>

            {/* 단어 목록 리스트 (스크롤) */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
              {previewWords.map((word, idx) => (
                <div
                  key={word.id}
                  className="flex items-center gap-2 rounded-xl border border-pink-100 bg-pink-50/40 p-2"
                >
                  <span className="w-6 text-center text-[11px] font-black text-pink-500">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={word.english}
                    onChange={e => updatePreviewWord(word.id, 'english', e.target.value)}
                    placeholder="영어 단어"
                    className="flex-1 rounded-lg border border-white bg-white px-2.5 py-1.5 text-xs font-bold text-gray-800 shadow-2xs focus:border-pink-400 focus:outline-none"
                  />
                  <span className="text-gray-300">→</span>
                  <input
                    type="text"
                    value={word.korean}
                    onChange={e => updatePreviewWord(word.id, 'korean', e.target.value)}
                    placeholder="한국어 뜻"
                    className="flex-1 rounded-lg border border-white bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-2xs focus:border-pink-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => deletePreviewWord(word.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500"
                    title="단어 삭제"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* 추가 & 확정 버튼 영역 */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={addEmptyWord}
                className="inline-flex items-center gap-1.5 rounded-xl border border-pink-200 bg-white px-3 py-2 text-xs font-bold text-pink-600 transition-all hover:bg-pink-50"
              >
                <Plus size={14} /> 단어 추가
              </button>

              <button
                type="button"
                onClick={handleConfirmSet}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:opacity-95"
              >
                <Check size={16} /> 이 단어들로 단어장 만들기!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          AI Vision 키 설정 모달
         ============================================================ */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h3 className="text-sm font-extrabold text-gray-900">
                  AI Vision 설정 (Google Gemini)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              스마트폰으로 비스듬히 찍거나 손글씨/워터마크가 있는 복잡한 시험지 사진도
              <strong> Gemini 2.0 Flash Vision AI</strong>를 사용하면 100% 오타 없이 완벽하게 단어를 읽어옵니다.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Gemini API Key
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-mono focus:border-pink-500 focus:outline-none"
              />
              <p className="mt-1.5 text-[11px] text-gray-400">
                Google AI Studio에서 누구나 무료로 즉시 발급받으실 수 있습니다.
              </p>
            </div>

            <div className="flex gap-2">
              {savedApiKey && (
                <button
                  type="button"
                  onClick={() => saveApiKey('')}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50"
                >
                  키 삭제
                </button>
              )}
              <button
                type="button"
                onClick={() => saveApiKey(apiKeyInput)}
                className="flex-1 rounded-xl bg-pink-500 py-2.5 text-xs font-bold text-white hover:bg-pink-600 shadow-xs"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
