import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are a landing page architect for FORMA. Given a product description,
return a JSON array of sections. Each section must have: id (use uuid),
type (hero|features|testimonials|pricing|footer), order, and props.
The copy must be specific to the described product, not generic.
Return only a valid JSON array. No markdown fences.
`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const result = await model.generateContent(prompt);
    let jsonString = result.response.text();

    // Sometimes the model can still wrap it in markdown despite responseMimeType
    const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    const sections = JSON.parse(jsonString);

    return NextResponse.json({ sections });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: 'Generation failed', details: error.message },
      { status: 500 }
    );
  }
}
