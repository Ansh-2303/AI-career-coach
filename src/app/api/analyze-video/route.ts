import { AssemblyAI } from "assemblyai"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Groq from "groq-sdk"

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY as string
})

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY as string
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "No video file provided" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadUrl = await client.files.upload(buffer)

    const transcript = await client.transcripts.transcribe({
      audio_url: uploadUrl,
      speech_models: ["universal-2"],
      disfluencies: true 
    })

    const prompt = `You are an expert AI Career Coach and an elite Video Producer. Analyze this candidate's video transcript:
    "${transcript.text}"
    
    Provide strict JSON output with the following keys combining standard feedback and advanced cinematic direction:
    - "score": number (1 to 10 rating their pitch)
    - "clarity": string (Brief assessment of their message clarity)
    - "fillerWords": string array (List any filler words used like 'um', 'so', 'you know', or empty array)
    - "strengths": string (1 sentence on what they did well)
    - "improvement": string (1 actionable tip to improve)
    - "highlightReel": array of exactly 2 objects containing "quote" (their best, most impactful sentence) and "impact" (why it sells them).
    - "bRollDirector": array of exactly 2 objects containing "triggerPhrase" (a short phrase they said) and "visualSuggestion" (what professional image/graphic to edit over the video when they say it).
    
    Output ONLY valid JSON.`

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    })

    const aiFeedback = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}")

    return NextResponse.json({
      text: transcript.text,
      aiFeedback: aiFeedback
    })

  } catch (error: any) {
    console.error("AI Analysis Error:", error)
    return NextResponse.json({ error: error.message || "Failed to analyze video" }, { status: 500 })
  }
}