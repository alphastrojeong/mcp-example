# MCP Study Project

Model Context Protocol (MCP)을 활용한 OpenAI 클라이언트 데모 프로젝트입니다.

## 🚀 프로젝트 개요

이 프로젝트는 MCP (Model Context Protocol)를 사용하여 AI 모델이 외부 도구와 안전하게 상호작용할 수 있는 방법을 보여주는 학습용 데모입니다.

### 주요 기능

- **MCP 서버**: 날씨 조회, 계산기, 시간 조회 등의 도구 제공
- **MCP 클라이언트**: OpenAI API와 연동하여 도구 사용
- **웹 인터페이스**: 사용자 친화적인 채팅 UI
- **실시간 도구 목록**: 사용 가능한 도구들을 실시간으로 표시

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-3.5-turbo
- **Protocol**: Model Context Protocol (MCP)
- **SDK**: @modelcontextprotocol/sdk

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# MCP Server Configuration
MCP_SERVER_URL=http://localhost:3001
```

### 3. 개발 서버 실행

```bash
npm run dev
```

MCP 서버는 Next.js 애플리케이션 내부에 통합되어 있어 별도로 실행할 필요가 없습니다.

### 4. 브라우저에서 확인

http://localhost:3000 에서 애플리케이션을 확인할 수 있습니다.

## 🎯 사용 방법

### 사용 가능한 도구

1. **날씨 조회** (`get_weather`)
   - 예시: "서울 날씨 알려줘"
   - 기능: 지정된 도시의 날씨 정보 제공

2. **계산기** (`calculate`)
   - 예시: "2+2 계산해줘", "10*5는 얼마야?"
   - 기능: 간단한 수학 계산 수행

3. **시간 조회** (`get_time`)
   - 예시: "지금 몇 시야?"
   - 기능: 현재 시간 정보 제공

### 채팅 사용법

1. 웹 인터페이스의 채팅창에 자연어로 메시지를 입력하세요
2. AI가 요청을 분석하고 적절한 도구를 사용합니다
3. 도구 실행 결과를 바탕으로 친근한 응답을 제공합니다

## 📁 프로젝트 구조

```
mcp-nextjs-project/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts          # 채팅 API
│   │   │   └── tools/route.ts         # 도구 목록 API
│   │   ├── page.tsx                   # 메인 페이지
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ChatInterface.tsx          # 채팅 UI 컴포넌트
│   │   └── ToolsList.tsx              # 도구 목록 컴포넌트
│   └── lib/
│       ├── mcp-client.ts              # MCP 클라이언트
│       └── mcp-server.ts              # MCP 서버
├── .env.example                       # 환경변수 예시
└── README.md
```

## 🔧 개발 가이드

### 새로운 도구 추가하기

1. `src/lib/mcp-server.ts`에서 도구 정의 추가:

```typescript
{
  name: 'your_tool_name',
  description: '도구 설명',
  inputSchema: {
    type: 'object',
    properties: {
      // 입력 파라미터 정의
    },
    required: ['필수_파라미터'],
  },
}
```

2. 도구 실행 로직 추가:

```typescript
case 'your_tool_name':
  return {
    content: [
      {
        type: 'text',
        text: '도구 실행 결과',
      },
    ],
  };
```

### MCP 프로토콜 이해하기

MCP는 AI 모델이 외부 도구와 안전하게 상호작용할 수 있도록 하는 표준 프로토콜입니다:

- **서버**: 도구를 제공하고 실행하는 역할
- **클라이언트**: AI 모델과 서버 사이의 중재 역할
- **도구**: 실제 기능을 수행하는 단위

## 🐛 문제 해결

### 일반적인 문제들

1. **MCP 서버 연결 실패**
   - MCP 서버는 Next.js 애플리케이션 내부에 통합되어 있습니다
   - 별도의 서버 실행이 필요하지 않습니다

2. **OpenAI API 오류**
   - API 키가 올바르게 설정되었는지 확인하세요
   - API 키에 충분한 크레딧이 있는지 확인하세요

3. **도구 실행 실패**
   - 도구 입력 파라미터가 올바른지 확인하세요
   - 서버 로그를 확인하여 오류 메시지를 확인하세요

## 📚 학습 자료

- [Model Context Protocol 공식 문서](https://modelcontextprotocol.io/)
- [OpenAI API 문서](https://platform.openai.com/docs)
- [Next.js 문서](https://nextjs.org/docs)

## 🤝 기여하기

이 프로젝트는 학습 목적으로 만들어졌습니다. 새로운 도구나 기능을 추가하여 MCP의 다양한 활용 방법을 탐색해보세요!

## 📄 라이선스

MIT License