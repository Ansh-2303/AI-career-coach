import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string })

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    console.log(`Career Strategy [${body.action}] from user:`, userId)

    /* 🎯 FEATURE 1: Offer Negotiator */
    if (body.action === "negotiate") {
      const prompt = `You are a ruthless Corporate HR Director and an Expert Career Negotiator.
      ROLE: ${body.role} | CURRENT OFFER: ${body.offer} | COMPANY SIZE: ${body.companySize}
      
      Generate a negotiation strategy in strict JSON format:
      {
        "powerScore": number (1-100, how much leverage the candidate likely has),
        "hrPushback": "string (A realistic, slightly intimidating 2-sentence excuse HR will use to not pay more, e.g., 'We are constrained by internal bands...')",
        "counterStrategy": "string (1 sentence on what exactly to ask for: base, equity, or sign-on bonus)",
        "emailScript": "string (A highly professional, polite, but firm counter-offer email script asking for 10-15% more)"
      }`

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }
      })
      return NextResponse.json(JSON.parse(completion.choices[0]?.message?.content || "{}"))
    }

    /* 🤝 FEATURE 2: Network Autopilot */
    if (body.action === "outreach") {
      const prompt = `You are an elite Tech Recruiter. The candidate wants to cold-email people at a target company.
      COMPANY: ${body.company} | RECENT NEWS/CONTEXT: ${body.news}
      
      Write 3 distinct, highly effective cold outreach messages (under 75 words each). Output strict JSON:
      {
        "coffeeChat": "string (A low-pressure message to a Senior Engineer asking for a 15-min virtual coffee to discuss the recent news)",
        "directPitch": "string (A direct, value-driven message to a Hiring Manager pitching their skills)",
        "referralRequest": "string (A message to a company Alumni asking for an internal referral)"
      }`

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }
      })
      return NextResponse.json(JSON.parse(completion.choices[0]?.message?.content || "{}"))
    }

    /* 🚀 FEATURE 3: Proof-of-Work Architect */
    if (body.action === "pow") {
      const prompt = `You are a strict Engineering Manager. Read this Job Description and design a 48-hour "Proof of Work" weekend project that the candidate can build and send to prove they deserve the job.
      JOB DESCRIPTION: ${body.jd}
      
      Output strict JSON:
      {
        "projectTitle": "string (Catchy, highly relevant project name)",
        "techStack": ["string", "string"],
        "architecture": "string (2 sentences explaining how the app will solve a problem the company has)",
        "executionSteps": ["string", "string", "string"] (3 actionable steps to build it this weekend),
        "pitchMessage": "string (The message to send to the hiring manager linking the GitHub/Demo)"
      }`

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }
      })
      return NextResponse.json(JSON.parse(completion.choices[0]?.message?.content || "{}"))
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Strategy Error:", error)
    return NextResponse.json({ error: "Failed to process strategy request" }, { status: 500 })
  }
}