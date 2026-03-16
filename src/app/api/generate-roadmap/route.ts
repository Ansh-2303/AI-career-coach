import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import prisma from "@/lib/prisma";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY as string,
});

export async function POST(req: Request) {
  try {

    // 1️⃣ Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Ensure user exists in DB
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
      },
    });

    // 3️⃣ Parse request body
    const { targetRole, currentBackground } = await req.json();

    if (!targetRole || !currentBackground) {
      return NextResponse.json(
        { error: "Please provide both your background and target role." },
        { status: 400 }
      );
    }

    // 4️⃣ AI Prompt
    const prompt = `
You are an elite, brutally honest Career Architect and Senior Engineering Manager.

Analyze the gap between the candidate's current background and their target role.

TARGET ROLE: "${targetRole}"
CANDIDATE BACKGROUND/RESUME: "${currentBackground}"

Perform a deep gap analysis and generate a highly specific, actionable career roadmap.

Output in strict JSON format with these exact keys:

{
"matchScore": number (0 to 100),
"roleOverview": string,
"possessedSkills": string[],
"missingCriticalSkills": string[],
"missingBonusSkills": string[],
"timeline": [
  {
    "phase": string,
    "focus": string,
    "milestones": string[],
    "portfolioProject": string
  }
]
}

Rules:
- timeline must contain EXACTLY 3 phases
- milestones must contain EXACTLY 3 items
- output must be VALID JSON
- DO NOT include markdown
- DO NOT include explanations
`;

    // 5️⃣ Call Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: prompt }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI failed to generate roadmap" },
        { status: 500 }
      );
    }

    let roadmap;

    try {
      roadmap = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON" },
        { status: 500 }
      );
    }

    // 6️⃣ Save roadmap
    await prisma.careerRoadmap.create({
      data: {
        userId: user.id,
        targetRole,
        roadmap,
      },
    });

    // 7️⃣ Return result
  return NextResponse.json(roadmap);

  } catch (error) {

    console.error("Career Roadmap Generation Error:", error);

    return NextResponse.json(
      { error: "Failed to generate career roadmap" },
      { status: 500 }
    );
  }
}