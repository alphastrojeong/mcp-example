# MCP Playwright Client

Model Context Protocol (MCP) 클라이언트를 사용하여 Playwright 도구와 상호작용하는 프로젝트입니다.

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 모드로 실행
```bash
npm run dev
```

### 3. 빌드 후 실행
```bash
npm run build
npm start
```

## 프로젝트 구조

```
├── src/
│   └── index.ts          # 메인 클라이언트 코드
├── dist/                 # 빌드된 JavaScript 파일들
├── package.json          # 프로젝트 설정 및 의존성
├── tsconfig.json         # TypeScript 설정
└── README.md            # 이 파일
```

## 코드 설명

이 클라이언트는 다음과 같은 작업을 수행합니다:

1. **MCP 서버 연결**: `http://localhost:529`에서 실행 중인 MCP 서버에 연결
2. **클라이언트 초기화**: MCP 프로토콜을 통해 클라이언트 초기화
3. **도구 목록 조회**: 사용 가능한 도구들의 목록을 가져옴
4. **Playwright 도구 호출**: `page.goto` 도구를 사용하여 웹페이지로 이동

## 주의사항

- MCP 서버가 `http://localhost:529`에서 실행 중이어야 합니다
- 인증이 필요한 경우 `headers` 객체에 적절한 인증 정보를 추가하세요
- Playwright 도구가 서버에서 사용 가능해야 합니다

## 스크립트 명령어

- `npm run dev`: TypeScript 파일을 직접 실행 (개발용)
- `npm run build`: TypeScript를 JavaScript로 컴파일
- `npm start`: 컴파일된 JavaScript 파일 실행
- `npm run clean`: 빌드된 파일들 삭제
