import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const apiKey = (formData.get('apiKey') as string) || process.env.GEMINI_API_KEY || ''

    if (!file) {
      return NextResponse.json({ error: '파일이 제공되지 않았습니다.' }, { status: 400 })
    }

    if (!apiKey) {
      return NextResponse.json({
        error: 'NO_API_KEY',
        message: '사진 속 표와 손글씨를 정확하게 읽으려면 무료 Gemini API 키가 필요합니다.',
      }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64Data = Buffer.from(arrayBuffer).toString('base64')
    const mimeType = file.type || 'image/jpeg'

    const prompt = `You are an expert OCR and education assistant specializing in school vocabulary worksheets.
Examine this vocabulary worksheet/test image carefully.

The table in this worksheet has TWO rows per numbered vocabulary item:
- TOP ROW of each item: TYPESET / COMPUTER-PRINTED English word and Korean meaning — EXTRACT THIS ONLY!
- BOTTOM ROW of each item: HANDWRITTEN copy written by a student in pencil/pen — COMPLETELY IGNORE THIS!

CRITICAL INSTRUCTIONS:
1. ONLY extract the COMPUTER-PRINTED words and meanings.
2. COMPLETELY IGNORE ALL HANDWRITTEN TEXT. Any handwriting (cursive or print written by student below the printed words) MUST BE DISCARDED.
3. Also ignore red ink circles, check marks, stamps, or teacher annotations.
4. Ignore headers: '#', 'Word', 'Meaning', 'Date', 'Name', 'Teacher', 'Parents', 'Book Title', 'Read out loud', etc.
5. Extract the book title if visible at the top (e.g., "The Burglar's Breakfast", "Harry the Dirty Dog", etc.).
6. The table usually contains 20 items (items 1-10 on the left column, items 11-20 on the right column). Extract all 20 printed items in order.
7. Return a JSON object in this exact format:
{
  "title": "Book Title Here",
  "words": [
    { "english": "word1", "korean": "뜻1" },
    { "english": "word2", "korean": "뜻2" }
  ]
}
`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error('Gemini API Error:', errText)
      return NextResponse.json(
        { error: 'API_ERROR', message: 'AI Vision 인식 중 오류가 발생했습니다. API 키를 확인해 주세요.' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // JSON 안전 추출
    let parsed: any = null
    try {
      parsed = JSON.parse(textOutput)
    } catch {
      const jsonMatch = textOutput.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      }
    }

    let words: any[] = []
    let title: string = ''

    if (Array.isArray(parsed)) {
      words = parsed
    } else if (parsed && typeof parsed === 'object') {
      words = Array.isArray(parsed.words) ? parsed.words : []
      title = String(parsed.title || '').trim()
    }

    return NextResponse.json({ words, title })
  } catch (err: any) {
    console.error('Extract words error:', err)
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: err.message || '단어 추출 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
