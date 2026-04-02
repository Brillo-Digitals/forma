import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `
You are a landing page architect for FORMA. Given a product description,
return a JSON array of sections. Each section must have: id (use uuid),
type (hero|features|testimonials|pricing|footer), order, and props.
The copy must be specific to the described product, not generic.
Return only valid JSON. No markdown, no explanation.
`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    let jsonString = "";
    if (response.content[0].type === 'text') {
       jsonString = response.content[0].text;
    }

    // Attempt to extract JSON if Claude added markdown fences despite instructions
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
