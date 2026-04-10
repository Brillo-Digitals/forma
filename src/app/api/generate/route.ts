import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const SYSTEM_PROMPT = `
You are a landing page architect for FORMA. Given a product description,
return a JSON array of sections. Each section must have: id (use uuid),
type (hero|features|testimonials|pricing|footer), order, and props.
The copy must be specific to the described product, not generic.
Return only a valid JSON array. No markdown fences.
`;

export async function POST(req: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Server is not configured. Missing GEMINI_API_KEY.' },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const result = await model.generateContent(prompt.trim());
    let jsonString = result.response.text();

    // Sometimes the model can still wrap it in markdown despite responseMimeType
    const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    const sections = JSON.parse(jsonString);

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Invalid model response format. Expected an array.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ sections });
  } catch (error: any) {
    console.error("AI Generation Error:", error);

    const status = typeof error?.status === 'number' ? error.status : 500;
    const details = typeof error?.message === 'string' ? error.message : 'Unknown error';

    if (status === 429) {
      return NextResponse.json(
        {
          error: 'Gemini quota exceeded. Please retry later or update your API plan/billing.',
          details,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Generation failed', details },
      { status: 500 }
    );
  }
}
