import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { PlaywrightService } from './playwright-service';

// MCP 서버 클래스 (HTTP 기반)
export class MCPServer {
  private tools: Tool[];
  private playwrightService: PlaywrightService;

  constructor() {
    this.playwrightService = new PlaywrightService();
    this.tools = [
      {
        name: 'get_weather',
        description: '현재 날씨 정보를 가져옵니다',
        inputSchema: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: '날씨를 확인할 도시명',
            },
          },
          required: ['location'],
        },
      },
      {
        name: 'calculate',
        description: '간단한 수학 계산을 수행합니다',
        inputSchema: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: '계산할 수학 표현식 (예: 2+2, 10*5)',
            },
          },
          required: ['expression'],
        },
      },
      {
        name: 'get_time',
        description: '현재 시간을 반환합니다',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      // Playwright 도구들
      {
        name: 'playwright_init',
        description: 'Playwright 브라우저를 초기화합니다',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'playwright_navigate',
        description: '브라우저에서 지정된 URL로 이동합니다',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: '이동할 URL',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'playwright_click',
        description: '지정된 선택자로 요소를 클릭합니다',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: '클릭할 요소의 CSS 선택자',
            },
          },
          required: ['selector'],
        },
      },
      {
        name: 'playwright_type',
        description: '지정된 선택자에 텍스트를 입력합니다',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: '텍스트를 입력할 요소의 CSS 선택자',
            },
            text: {
              type: 'string',
              description: '입력할 텍스트',
            },
          },
          required: ['selector', 'text'],
        },
      },
      {
        name: 'playwright_screenshot',
        description: '현재 페이지의 스크린샷을 찍습니다',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'playwright_get_text',
        description: '지정된 선택자의 텍스트 내용을 가져옵니다',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: '텍스트를 가져올 요소의 CSS 선택자',
            },
          },
          required: ['selector'],
        },
      },
      {
        name: 'playwright_wait_for',
        description: '지정된 선택자가 나타날 때까지 대기합니다',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: '대기할 요소의 CSS 선택자',
            },
            timeout: {
              type: 'number',
              description: '대기 시간 (밀리초, 기본값: 5000)',
            },
          },
          required: ['selector'],
        },
      },
      {
        name: 'playwright_evaluate',
        description: '브라우저에서 JavaScript 코드를 실행합니다',
        inputSchema: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: '실행할 JavaScript 코드',
            },
          },
          required: ['expression'],
        },
      },
      {
        name: 'playwright_get_page_info',
        description: '현재 페이지의 URL과 제목을 가져옵니다',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'playwright_cleanup',
        description: 'Playwright 브라우저를 정리하고 종료합니다',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ];
  }

  // 도구 목록 반환
  getTools(): Tool[] {
    return this.tools;
  }

  // 도구 실행
  async executeTool(toolName: string, args: any) {
    switch (toolName) {
      case 'get_weather':
        return {
          content: [
            {
              type: 'text',
              text: `🌤️ ${args.location}의 날씨: 맑음, 22°C`,
            },
          ],
        };

      case 'calculate':
        try {
          // 간단한 계산기 (보안상 eval 사용하지 않음)
          const result = this.safeCalculate(args.expression);
          console.log("args.expression", args.expression)
          console.log("result", result)
          return {
            content: [
              {
                type: 'text',
                text: `🧮 계산 결과: ${args.expression} = ${result}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ 계산 오류: ${error}`,
              },
            ],
          };
        }

      case 'get_time':
        return {
          content: [
            {
              type: 'text',
              text: `🕐 현재 시간: ${new Date().toLocaleString('ko-KR')}`,
            },
          ],
        };

      // Playwright 도구들
      case 'playwright_init':
        try {
          await this.playwrightService.initialize();
          return {
            content: [
              {
                type: 'text',
                text: '🎭 Playwright 브라우저가 초기화되었습니다',
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Playwright 초기화 실패: ${error}`,
              },
            ],
          };
        }

      case 'playwright_navigate':
        try {
          const result = await this.playwrightService.navigate(args.url);
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ 페이지 이동 실패: ${error}`,
              },
            ],
          };
        }

      case 'playwright_click':
        try {
          const result = await this.playwrightService.click(args.selector);
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ 클릭 실패: ${error}`,
              },
            ],
          };
        }

      case 'playwright_type':
        try {
          const result = await this.playwrightService.type(args.selector, args.text);
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ 텍스트 입력 실패: ${error}`,
              },
            ],
          };
        }

      case 'playwright_screenshot':
        try {
          const result = await this.playwrightService.screenshot();
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ 스크린샷 실패: ${error}`,
              },
            ],
          };
        }

      case 'playwright_get_text':
        try {
          const result = await this.playwrightService.getText(args.selector);
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ 텍스트 가져오기 실패: ${error}`,
              },
            ],
          };
        }

      case 'playwright_wait_for':
        try {
          const result = await this.playwrightService.waitFor(args.selector, args.timeout);
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ 대기 실패: ${error}`,
              },
            ],
          };
        }

      case 'playwright_evaluate':
        try {
          const result = await this.playwrightService.evaluate(args.expression);
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ JavaScript 실행 실패: ${error}`,
              },
            ],
          };
        }

      case 'playwright_get_page_info':
        try {
          const result = await this.playwrightService.getPageInfo();
          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ 페이지 정보 가져오기 실패: ${error}`,
              },
            ],
          };
        }

      case 'playwright_cleanup':
        try {
          await this.playwrightService.cleanup();
          return {
            content: [
              {
                type: 'text',
                text: '🧹 Playwright 브라우저가 정리되었습니다',
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Playwright 정리 실패: ${error}`,
              },
            ],
          };
        }

      default:
        throw new Error(`알 수 없는 도구: ${toolName}`);
    }
  }

  private safeCalculate(expression: string): number {
    // 간단한 수학 표현식만 허용 (보안)
    const cleanExpression = expression.replace(/[^0-9+\-*/().\s]/g, '');
    if (cleanExpression !== expression) {
      throw new Error('허용되지 않는 문자가 포함되어 있습니다');
    }
    
    // 간단한 계산만 허용
    const result = Function(`"use strict"; return (${cleanExpression})`)();
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('유효하지 않은 계산 결과입니다');
    }
    
    return result;
  }

  // HTTP 기반 서버이므로 별도의 start/stop 메서드 불필요
  
  // Playwright 브라우저 정리
  async cleanup(): Promise<void> {
    await this.playwrightService.cleanup();
  }
}
