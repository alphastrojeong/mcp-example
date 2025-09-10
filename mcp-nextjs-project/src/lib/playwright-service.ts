import { chromium, Browser, BrowserContext, Page } from 'playwright';

export interface PlaywrightAction {
  type: 'navigate' | 'click' | 'type' | 'screenshot' | 'getText' | 'waitFor' | 'evaluate';
  selector?: string;
  url?: string;
  text?: string;
  timeout?: number;
  expression?: string;
}

export class PlaywrightService {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  async initialize(): Promise<void> {
    try {
      this.browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 }
      });
      this.page = await this.context.newPage();
      console.log('🎭 Playwright 브라우저가 초기화되었습니다');
    } catch (error) {
      console.error('Playwright 초기화 실패:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.context) {
        await this.context.close();
        this.context = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      console.log('🧹 Playwright 브라우저가 정리되었습니다');
    } catch (error) {
      console.error('Playwright 정리 실패:', error);
    }
  }

  async navigate(url: string): Promise<string> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      await this.page.goto(url, { waitUntil: 'networkidle' });
      const title = await this.page.title();
      return `✅ 페이지로 이동했습니다: ${url}\n📄 페이지 제목: ${title}`;
    } catch (error) {
      throw new Error(`페이지 이동 실패: ${error}`);
    }
  }

  async click(selector: string): Promise<string> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      await this.page.click(selector);
      return `🖱️ 요소를 클릭했습니다: ${selector}`;
    } catch (error) {
      throw new Error(`클릭 실패: ${error}`);
    }
  }

  async type(selector: string, text: string): Promise<string> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      await this.page.fill(selector, text);
      return `⌨️ 텍스트를 입력했습니다: "${text}" (선택자: ${selector})`;
    } catch (error) {
      throw new Error(`텍스트 입력 실패: ${error}`);
    }
  }

  async screenshot(): Promise<string> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      const screenshot = await this.page.screenshot({ 
        type: 'png',
        fullPage: true 
      });
      const base64 = screenshot.toString('base64');
      return `📸 스크린샷을 찍었습니다 (Base64): data:image/png;base64,${base64}`;
    } catch (error) {
      throw new Error(`스크린샷 실패: ${error}`);
    }
  }

  async getText(selector: string): Promise<string> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      const text = await this.page.textContent(selector);
      return `📝 텍스트 내용: ${text || '텍스트를 찾을 수 없습니다'}`;
    } catch (error) {
      throw new Error(`텍스트 가져오기 실패: ${error}`);
    }
  }

  async waitFor(selector: string, timeout: number = 5000): Promise<string> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      await this.page.waitForSelector(selector, { timeout });
      return `⏳ 요소가 나타날 때까지 대기했습니다: ${selector}`;
    } catch (error) {
      throw new Error(`대기 실패: ${error}`);
    }
  }

  async evaluate(expression: string): Promise<string> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      const result = await this.page.evaluate(expression);
      return `🔍 JavaScript 실행 결과: ${JSON.stringify(result)}`;
    } catch (error) {
      throw new Error(`JavaScript 실행 실패: ${error}`);
    }
  }

  async getPageInfo(): Promise<string> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      const url = this.page.url();
      const title = await this.page.title();
      return `📄 현재 페이지 정보:\nURL: ${url}\n제목: ${title}`;
    } catch (error) {
      throw new Error(`페이지 정보 가져오기 실패: ${error}`);
    }
  }

  isInitialized(): boolean {
    return this.browser !== null && this.context !== null && this.page !== null;
  }
}
