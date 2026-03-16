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

    const { role } = await req.json()

    if (!role) {
      return NextResponse.json(
        { error: "Please provide a job role." },
        { status: 400 }
      )
    }

    console.log("Industry insights request from user:", userId)

    /* 3️⃣ AI Prompt */

    const prompt = `You are an expert Tech Industry Analyst.
    Provide current market insights and trends for the role of "${role}".
    
    Provide your analysis in strict JSON format with exactly this structure:
    {
      "salaryRange": "string (e.g., '$90k - $140k' or general industry average)",
      "demandLevel": "string (Must be exactly one of: 'Very High', 'High', 'Moderate', 'Low')",
      "topSkills": ["string", "string", "string", "string"],
      "outlook": "string (2 concise sentences explaining future growth and market trends for this specific role)"
    }
    
    Output ONLY valid JSON.`

    /* 4️⃣ Call Groq AI */

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    })

    /* 5️⃣ Parse AI response */

    const insights = JSON.parse(
      chatCompletion.choices[0]?.message?.content || "{}"
    )

    return NextResponse.json(insights)

  } catch (error: any) {

    console.error("Insights Error:", error)

    return NextResponse.json(
      { error: "Failed to fetch industry insights" },
      { status: 500 }
    )
  }
}