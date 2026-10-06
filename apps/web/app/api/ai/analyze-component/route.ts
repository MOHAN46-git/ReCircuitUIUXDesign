import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { AIComponentAnalysisSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const provider = getAIProvider();

    const analysis = await provider.analyzeComponent({
      imageBase64: body.imageBase64,
      imageUrl: body.imageUrl,
      notes: body.notes,
    });

    // Validate with Zod schema
    const validated = AIComponentAnalysisSchema.parse(analysis);

    return NextResponse.json({
      success: true,
      analysis: validated,
    });
  } catch (error: any) {
    console.error('Error analyzing component:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to analyze component',
      },
      { status: 400 }
    );
  }
}
