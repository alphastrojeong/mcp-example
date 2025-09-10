import OpenAI from 'openai';
import { MCPServer } from './mcp-server';

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export interface MCPResult {
  content: Array<{
    type: string;
    text: string;
  }>;
}

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
}

export interface ToolCallResult {
  toolName: string;
  args: any;
  result: MCPResult;
  success: boolean;
  error?: string;
}

export class MCPClient {
  private mcpServer: MCPServer;
  private openai: OpenAI;
  private tools: MCPTool[] = [];
  private conversationHistory: ConversationMessage[] = [];
  private maxIterations: number = 5; // 최대 반복 횟수

  constructor() {
    this.mcpServer = new MCPServer();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async connect() {
    console.log('🔗 MCP 클라이언트가 연결되었습니다');
    
    // 사용 가능한 도구 목록 가져오기
    await this.loadTools();
  }

  async disconnect() {
    console.log('🔌 MCP 클라이언트 연결이 해제되었습니다');
    // Playwright 브라우저 정리
    await this.mcpServer.cleanup();
  }

  private async loadTools() {
    try {
      const serverTools = this.mcpServer.getTools();
      this.tools = serverTools.map(tool => ({
        name: tool.name,
        description: tool.description || '',
        inputSchema: tool.inputSchema,
      }));
      console.log(`📋 ${this.tools.length}개의 도구를 로드했습니다:`, this.tools.map(t => t.name));
    } catch (error) {
      console.error('도구 목록 로드 실패:', error);
    }
  }

  async callTool(toolName: string, args: any): Promise<MCPResult> {
    try {
      const response = await this.mcpServer.executeTool(toolName, args);
      return response;
    } catch (error) {
      console.error(`도구 ${toolName} 실행 실패:`, error);
      throw error;
    }
  }

  async chatWithOpenAI(message: string): Promise<string> {
    try {
      // 대화 히스토리에 사용자 메시지 추가
      this.conversationHistory.push({
        role: 'user',
        content: message,
      });

      // 시스템 메시지 설정
      const systemMessage: ConversationMessage = {
        role: 'system',
        content: `당신은 MCP(Model Context Protocol) 도구를 사용할 수 있는 AI 어시스턴트입니다.
        사용 가능한 도구들:
          ${this.tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}
          
        중요한 지침:
        1. 사용자의 요청을 완전히 수행하기 위해 필요한 모든 도구를 사용하세요
        2. 도구 실행 결과를 바탕으로 추가 작업이 필요한지 판단하세요
        3. 여러 도구를 순차적으로 사용하여 복잡한 작업을 완료하세요
        4. 각 도구 호출 후 결과를 분석하고 다음 단계를 결정하세요
        5. 모든 도구 호출이 완료된 후 최종 결과를 사용자에게 설명하세요`,
      };

      // OpenAI 함수 호출을 위한 도구 정의
      const openaiTools = this.tools.map(tool => ({
        type: 'function' as const,
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema,
        },
      }));

      let iteration = 0;
      let finalResponse = '';

      while (iteration < this.maxIterations) {
        console.log(`🔄 반복 ${iteration + 1}/${this.maxIterations}`);

        // 대화 메시지 구성
        const messages = [systemMessage, ...this.conversationHistory];

        const completion = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages,
          tools: openaiTools,
          tool_choice: 'auto',
        });

        const assistantMessage = completion.choices[0].message;
        console.log("assistantMessage", assistantMessage);

        // 도구 호출이 있는 경우
        if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
          console.log(`🔧 ${assistantMessage.tool_calls.length}개의 도구 호출 실행`);

          // 도구 호출 결과들을 저장
          const toolCallResults: ToolCallResult[] = [];

          // 모든 도구 호출 실행
          for (const toolCall of assistantMessage.tool_calls) {
            const toolName = toolCall.type === 'function' ? toolCall.function.name : '';
            const toolArgs = toolCall.type === 'function' ? JSON.parse(toolCall.function.arguments) : {};

            console.log(`🛠️ 도구 실행: ${toolName}`, toolArgs);

            try {
              const toolResult = await this.callTool(toolName, toolArgs);
              const toolResultText = toolResult.content[0]?.text || '도구 실행 결과 없음';

              toolCallResults.push({
                toolName,
                args: toolArgs,
                result: toolResult,
                success: true,
              });

              console.log(`✅ 도구 실행 성공: ${toolName}`, toolResultText);

              // 도구 호출 결과를 대화 히스토리에 추가
              this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage.content || '',
                tool_calls: assistantMessage.tool_calls,
              });

              this.conversationHistory.push({
                role: 'user',
                content: `도구 ${toolName} 실행 결과: ${toolResultText}`,
                tool_call_id: toolCall.id,
              });

            } catch (error) {
              console.error(`❌ 도구 실행 실패: ${toolName}`, error);
              
              toolCallResults.push({
                toolName,
                args: toolArgs,
                result: { content: [{ type: 'text', text: '실패' }] },
                success: false,
                error: error instanceof Error ? error.message : String(error),
              });

              // 실패한 도구 호출도 대화 히스토리에 추가
              this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage.content || '',
                tool_calls: assistantMessage.tool_calls,
              });

              this.conversationHistory.push({
                role: 'user',
                content: `도구 ${toolName} 실행 실패: ${error}`,
                tool_call_id: toolCall.id,
              });
            }
          }

          // 모든 도구 호출이 완료되었는지 확인
          const allSuccessful = toolCallResults.every(result => result.success);
          if (allSuccessful) {
            console.log('✅ 모든 도구 호출이 성공적으로 완료되었습니다');
          }

          iteration++;
        } else {
          // 도구 호출이 없는 경우 - 최종 응답
          finalResponse = assistantMessage.content || '응답을 생성할 수 없습니다.';
          console.log('💬 최종 응답 생성:', finalResponse);
          break;
        }
      }

      if (iteration >= this.maxIterations) {
        finalResponse = '최대 반복 횟수에 도달했습니다. 작업을 완료할 수 없습니다.';
        console.log('⚠️ 최대 반복 횟수 도달');
      }

      // 대화 히스토리에 최종 응답 추가
      this.conversationHistory.push({
        role: 'assistant',
        content: finalResponse,
      });

      return finalResponse;
    } catch (error) {
      console.error('OpenAI API 호출 실패:', error);
      throw error;
    }
  }

  getAvailableTools(): MCPTool[] {
    return this.tools;
  }

  // 대화 히스토리 초기화
  clearConversationHistory(): void {
    this.conversationHistory = [];
    console.log('🗑️ 대화 히스토리가 초기화되었습니다');
  }

  // 대화 히스토리 가져오기
  getConversationHistory(): ConversationMessage[] {
    return [...this.conversationHistory];
  }

  // 최대 반복 횟수 설정
  setMaxIterations(maxIterations: number): void {
    this.maxIterations = maxIterations;
    console.log(`🔄 최대 반복 횟수가 ${maxIterations}로 설정되었습니다`);
  }

  // 현재 반복 횟수 가져오기
  getMaxIterations(): number {
    return this.maxIterations;
  }
}
