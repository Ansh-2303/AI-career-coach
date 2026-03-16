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

    const { weakBullet, roleContext } = await req.json()

    if (!weakBullet) {
      return NextResponse.json(
        { error: "Please provide a bullet point to enhance." },
        { status: 400 }
      )
    }

    console.log("Resume enhancer request from user:", userId)


    /* 3️⃣ AI Prompt */

    const prompt = `You are an elite Executive Resume Writer. 
    Your job is to transform a weak, boring resume bullet point into 3 powerful, action-oriented, and metric-driven alternatives.
    ${roleContext ? `The candidate is targeting a "${roleContext}" role, so use appropriate industry keywords.` : "Make it sound professional and impactful."}
    
    ORIGINAL BULLET: "${weakBullet}"
    
    Provide your output in strict JSON format with exactly this structure:
    {
      "enhancedBullets": [
        "string: your first upgraded bullet point here",
        "string: your second upgraded bullet point here",
        "string: your third upgraded bullet point here"
      ]
    }
    
    CRITICAL RULE: "enhancedBullets" MUST be a simple array of plain strings. Do NOT return objects or keys inside the array.
    
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

    console.error("Enhancer Error:", error)

    return NextResponse.json(
      { error: "Failed to enhance bullet point" },
      { status: 500 }
    )
  }
}