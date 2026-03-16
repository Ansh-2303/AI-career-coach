import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY as string
})

export async function POST(req: Request) {

  try {

    /* 1️⃣ Verify user authentication */

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    /* 2️⃣ Parse request body */

    const { resume, jobDescription } = await req.json()

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Please provide both a resume and a job description." },
        { status: 400 }
      )
    }

    console.log("Cover letter request from user:", userId)

    /* 3️⃣ AI Prompt */

    const prompt = `You are an elite Executive Career Coach. Write a modern, highly compelling cover letter for the candidate based on their resume and the target job description.
    
    RESUME:
    ${resume}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    RULES:
    - Keep it under 300 words.
    - Make it sound confident, professional, and engaging (not robotic).
    - Directly connect the candidate's past experience to the specific needs mentioned in the job description.
    - Do not use placeholder brackets like [Company Name] if the name is in the JD. If missing, use generic but smooth phrasing.
    
    Provide your output in strict JSON format with exactly this structure:
    {
      "coverLetter": "string: the complete text of the cover letter"
    }
    
    Output ONLY valid JSON.`

    /* 4️⃣ Call Groq AI */

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    })

    /* 5️⃣ Parse AI response */

    const result = JSON.parse(
      chatCompletion.choices[0]?.message?.content || "{}"
    )

    return NextResponse.json(result)

  } catch (error: any) {

    console.error("Cover Letter Error:", error)

    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    )
  }
}