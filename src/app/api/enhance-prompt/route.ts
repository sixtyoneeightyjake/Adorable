import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // For now, using placeholder enhancement prompt as requested
    const enhancementPrompt = `You are an expert prompt engineer. Your task is to improve the following user prompt to make it more clear, specific, and effective for generating better results.

Guidelines for enhancement:
- Make the prompt more specific and detailed
- Add context where helpful
- Clarify any ambiguous requests
- Suggest concrete examples or specifications
- Maintain the user's original intent
- Keep it concise but comprehensive

Original prompt: "${prompt}"

Please provide an enhanced version of this prompt that will generate better, more specific results:`;

    const { text: enhancedPrompt } = await generateText({
      model: openai('gpt-4.1'),
      prompt: enhancementPrompt,
      maxTokens: 500,
    });

    return NextResponse.json({
      originalPrompt: prompt,
      enhancedPrompt: enhancedPrompt.trim(),
    });

  } catch (error) {
    console.error('Error enhancing prompt:', error);
    return NextResponse.json(
      { error: 'Failed to enhance prompt' },
      { status: 500 }
    );
  }
}
