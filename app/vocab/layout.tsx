import type { Metadata, Viewport } from 'next'
import './vocab.css'

export const metadata: Metadata = {
  title: '달스키즈 영단어장 🐣 | 파일 업로드로 나만의 단어장 만들기',
  description:
    '파일(TXT, CSV, PDF, 이미지)을 업로드하면 영단어를 자동으로 추출해서 나만의 단어장을 만들어 드려요. 4지선다, 타이핑 시험으로 재미있게 외워보세요!',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fff0f6',
}

export default function VocabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
