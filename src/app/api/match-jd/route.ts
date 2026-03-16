import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });

export async function POST(req: Request) {
  try {
    const { resume, jobDescription } = await req.json();

    if (!resume || !jobDescription) {
      return NextResponse.json({ error: "Please provide both a resume and a job description." }, { status: 400 });
    }
const prompt = `You are an expert Technical Recruiter and ATS (Applicant Tracking System).
    Analyze this candidate's resume against the provided Job Description.
    
    RESUME:
    ${resume}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    Provide your analysis in strict JSON format with these exact keys:
    - "score": number (0 to 100 representing the overall match percentage)
    - "role": string (The exact job title from the job description)
    - "matchedSkills": string array (Up to 5 key skills the candidate HAS. Use short, 1-2 word skill names only.)
    - "missingSkills": string array (Up to 5 key skills the candidate is MISSING. STRICT RULE: Use short skill names only. NEVER include notes, explanations, or parentheses inside this array.)
    - "recommendation": string (1 concise sentence of advice on how to tailor the resume for this specific job)
    
    Output ONLY valid JSON.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });

    const analysis = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error("Match Error:", error);
    return NextResponse.json({ error: "Failed to analyze match" }, { status: 500 });
  }
}