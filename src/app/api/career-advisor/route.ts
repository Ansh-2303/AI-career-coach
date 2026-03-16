import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });

export async function POST(req: Request) {
  try {
    const { dilemma } = await req.json();

    if (!dilemma) {
      return NextResponse.json({ error: "Please provide a career dilemma" }, { status: 400 });
    }

    const prompt = `You are an elite Career Coach for tech professionals. 
    Analyze this career dilemma: "${dilemma}"
    
    Provide your advice in strict JSON format with these exact keys:
    - "summary": string (1-2 sentences summarizing the core tradeoff)
    - "prosOptionA": string array (3 pros of the first option/path)
    - "prosOptionB": string array (3 pros of the second option/path)
    - "recommendation": string (Your decisive, expert recommendation on what they should do and why)
    
    Output ONLY valid JSON.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });

    const advice = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');

    return NextResponse.json(advice);

  } catch (error: any) {
    console.error("Advisor Error:", error);
    return NextResponse.json({ error: "Failed to generate advice" }, { status: 500 });
  }
}