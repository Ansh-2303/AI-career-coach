import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY as string
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { resume, jobDescription } = await req.json()

    if (!resume || !jobDescription) {
      return NextResponse.json({ error: "Missing resume or job description" }, { status: 400 })
    }

    console.log("ATS Matcher request from user:", userId)

    const prompt = `You are an elite, brutally strict Applicant Tracking System (ATS) and a Master Executive Resume Writer.
    
    JOB DESCRIPTION: 
    "${jobDescription}"
    
    CANDIDATE RESUME: 
    "${resume}"
    
    Perform a deep semantic gap analysis. Output your findings in strict JSON format with exactly this structure:
    {
      "matchScore": number (0 to 100, representing the ATS pass probability),
      "verdict": "string: 2 sentences summarizing the overall fit.",
      "keywords": {
        "matched": ["string", "string"],
        "missingCritical": ["string", "string"],
        "missingBonus": ["string", "string"]
      },
      "bulletSurgeon": [
        {
          "original": "string (Identify a weak or generic bullet point from their actual resume)",
          "upgraded": "string (Rewrite this exact bullet to include missing keywords, action verbs, and simulated quantifiable metrics to make it ATS-friendly)",
          "reason": "string (1 sentence explaining why the upgrade is better)"
        }
        // Provide exactly 3 bullet upgrades
      ]
    }
    
    Output ONLY valid JSON.`

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    })

    const analysis = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}")
    return NextResponse.json(analysis)

  } catch (error: any) {
    console.error("ATS Matcher Error:", error)
    return NextResponse.json({ error: "Failed to run ATS analysis" }, { status: 500 })
  }
}