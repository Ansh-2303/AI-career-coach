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

    const body = await req.json()
    console.log(`Mock Interview (${body.action}) from user:`, userId)

    /* 1️⃣ MODE 1: Generate the NEXT Question based on History */
    if (body.action === "generateNext") {
      const { role, resumeContext, history } = body;
      
      // Format history for the prompt so the AI knows what has already been said
      const historyText = history.length === 0 
        ? "No questions asked yet. Start with a tailored introduction or background question."
        : history.map((h: any, i: number) => `Q${i+1}: ${h.question}\nA${i+1}: ${h.answer}`).join("\n\n");

      const prompt = `You are a tough, expert Technical Interviewer conducting a live, multi-round interview.
      ROLE: "${role}"
      CANDIDATE BACKGROUND: "${resumeContext || 'None provided'}"
      
      INTERVIEW HISTORY SO FAR:
      ${historyText}
      
      YOUR TASK: Ask the NEXT logical interview question. 
      - If this is the beginning, ask about their background.
      - If they just answered a technical question, ask a follow-up or move to a new technical concept.
      - Do NOT evaluate their previous answer. Just ask the next question naturally.
      - Keep it conversational, under 3 sentences. It will be spoken aloud.
      - Output ONLY the question text. Do not include quotes, greetings, or formatting.`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
      })

      const question = chatCompletion.choices[0]?.message?.content?.replace(/["']/g, "").trim()
      return NextResponse.json({ question })
    }

    /* 2️⃣ MODE 2: Evaluate the ENTIRE Interview */
    if (body.action === "evaluateAll") {
      const { history, role } = body;

      const historyText = history.map((h: any, i: number) => `ROUND ${i+1}:\nInterviewer: ${h.question}\nCandidate: ${h.answer}`).join("\n\n");

      const prompt = `You are an elite Engineering Manager. The candidate just finished a mock interview for the "${role}" role. 
      
      FULL INTERVIEW TRANSCRIPT:
      ${historyText}
      
      Provide a comprehensive evaluation in strict JSON format with exactly this structure:
      {
        "overallScore": number (1 to 10),
        "overallSummary": "string: 3-4 sentences summarizing their overall performance, communication, and technical depth.",
        "perQuestionAnalysis": [
          {
            "question": "string (the question asked)",
            "answer": "string (the candidate's answer)",
            "score": number (1 to 10 for this specific answer),
            "feedback": "string: 2 sentences of brutally honest feedback on this specific answer.",
            "idealAnswer": "string: How a Senior Engineer would have answered this."
          }
          // ... array must contain an object for EVERY round in the transcript
        ]
      }
      
      Output ONLY valid JSON. Ensure the JSON is properly escaped and formatted.`

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }
      })

      const evaluation = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}")
      return NextResponse.json(evaluation)
    }

    return NextResponse.json({ error: "Invalid action type" }, { status: 400 })

  } catch (error: any) {
    console.error("Interview Error:", error)
    return NextResponse.json({ error: "Failed to process interview request" }, { status: 500 })
  }
}