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

    const prompt = `You are an expert OCR and education assistant.
Examine this vocabulary worksheet/test image carefully.
Extract all English vocabulary words and their corresponding Korean meanings from the printed table.
Rules:
1. Extract the PRINTED English words and Korean meanings. Do NOT extract the handwritten text underneath.
2. Ignore headers like '#', 'Word', 'Meaning', 'Date', 'Name', 'Teacher', 'Parents', 'Book Title', 'Read out loud', etc.
3. Return ONLY a valid JSON array of objects with "english" and "korean" fields.
4. No markdown, no code fences, no explanations. Just raw JSON: [{"english": "January", "korean": "1월"}, ...]
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
    const cleanJson = textOutput.replace(/```(?:json)?/g, '').replace(/```/g, '').trim()

    const parsedWords = JSON.parse(cleanJson)

    return NextResponse.json({ words: parsedWords })
  } catch (err: any) {
    console.error('Extract words error:', err)
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: err.message || '단어 추출 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
