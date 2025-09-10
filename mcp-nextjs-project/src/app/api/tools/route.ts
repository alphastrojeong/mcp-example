import { NextResponse } from 'next/server';
import { MCPClient } from '@/lib/mcp-client';

export async function GET() {
  try {
    const mcpClient = new MCPClient();
    
    try {
      await mcpClient.connect();
      const tools = mcpClient.getAvailableTools();
      
      return NextResponse.json({ tools });
    } finally {
      await mcpClient.disconnect();
    }
  } catch (error) {
    console.error('Tools API 오류:', error);
    return NextResponse.json(
      { error: '도구 목록을 가져올 수 없습니다' },
      { status: 500 }
    );
  }
}
