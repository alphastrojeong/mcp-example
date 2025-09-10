import { NextRequest, NextResponse } from 'next/server';
import { MCPClient } from '@/lib/mcp-client';

// 전역 MCP 클라이언트 인스턴스 (대화 히스토리 유지)
let globalMCPClient: MCPClient | null = null;

export async function POST(request: NextRequest) {
  try {
    const { message, action, maxIterations } = await request.json();

    // 특별한 액션 처리
    if (action === 'clear') {
      if (globalMCPClient) {
        globalMCPClient.clearConversationHistory();
        await globalMCPClient.disconnect();
        globalMCPClient = null;
      }
      return NextResponse.json({ 
        response: '대화 히스토리가 초기화되었습니다',
        action: 'cleared'
      });
    }

    if (action === 'disconnect') {
      if (globalMCPClient) {
        await globalMCPClient.disconnect();
        globalMCPClient = null;
      }
      return NextResponse.json({ 
        response: '연결이 해제되었습니다',
        action: 'disconnected'
      });
    }

    if (!message) {
      return NextResponse.json(
        { error: '메시지가 필요합니다' },
        { status: 400 }
      );
    }

    // MCP 클라이언트 초기화 또는 재사용
    if (!globalMCPClient) {
      globalMCPClient = new MCPClient();
      await globalMCPClient.connect();
    }

    // 최대 반복 횟수 설정 (제공된 경우)
    if (maxIterations && typeof maxIterations === 'number') {
      globalMCPClient.setMaxIterations(maxIterations);
    }
    
    const response = await globalMCPClient.chatWithOpenAI(message);
    const conversationHistory = globalMCPClient.getConversationHistory();
    
    return NextResponse.json({ 
      response,
      tools: globalMCPClient.getAvailableTools(),
      conversationHistory: conversationHistory.slice(-10), // 최근 10개 메시지만 반환
      maxIterations: globalMCPClient.getMaxIterations()
    });
  } catch (error) {
    console.error('Chat API 오류:', error);
    
    // 오류 발생 시 연결 정리
    if (globalMCPClient) {
      try {
        await globalMCPClient.disconnect();
      } catch (cleanupError) {
        console.error('정리 중 오류:', cleanupError);
      }
      globalMCPClient = null;
    }
    
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
