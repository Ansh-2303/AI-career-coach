import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { targetRole, currentBackground } = await req.json();

    if (!targetRole || !currentBackground) {
      return NextResponse.json({ error: "Please provide both your background and target role." }, { status: 400 });
    }

    const prompt = `You are an elite, brutally honest Career Architect and Senior Engineering Manager. 
    Analyze the gap between the candidate's current background and their target role.
    
    TARGET ROLE: "${targetRole}"
    CANDIDATE BACKGROUND/RESUME: "${currentBackground}"
    
    Perform a deep gap analysis and generate a highly specific, actionable career roadmap.
    
    Output in strict JSON format with these exact keys:
    - "matchScore": number (0 to 100, representing how close they currently are to landing this role)
    - "roleOverview": string (2 sentences on what hiring managers actually look for in this role)
    - "possessedSkills": string array (What they already have that is relevant)
    - "missingCriticalSkills": string array (Dealbreakers: what they absolutely MUST learn)
    - "missingBonusSkills": string array (Nice-to-haves that will make them stand out)
    - "timeline": array of exactly 3 objects representing learning phases. Each object must have:
        - "phase": string (e.g., "Phase 1: Closing the Gap (Months 1-3)")
        - "focus": string (The core objective of this phase)
        - "milestones": string array (3 specific technical or soft-skill steps to achieve)
        - "portfolioProject": string (1 specific, impressive project idea they should build to prove these skills)
    
    Output ONLY valid JSON. No markdown formatting, no conversational text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const roadmap = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
    return NextResponse.json(roadmap);

  } catch (error: any) {
    console.error("Heavy Roadmap Error:", error);
    return NextResponse.json({ error: "Failed to generate advanced roadmap" }, { status: 500 });
  }
}