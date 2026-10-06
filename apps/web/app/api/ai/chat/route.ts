import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';
import { getDataStore } from '@/lib/domain/dataService';
import { AIChatMessageSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = AIChatMessageSchema.parse(body);

    const store = getDataStore();
    const activeUser = store.getActiveUser();
    const provider = getAIProvider();

    const response = await provider.chatAssistant({
      message: validated.message,
      role: validated.role,
      userName: `${activeUser.first_name} ${activeUser.last_name}`,
    });

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
