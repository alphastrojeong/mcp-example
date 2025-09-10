'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import ToolsList from '@/components/ToolsList';

interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export default function Home() {
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools');
        const data = await response.json();
        setTools(data.tools || []);
      } catch (error) {
        console.error('도구 목록 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            MCP Study Project
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Model Context Protocol을 활용한 OpenAI 클라이언트 데모
          </p>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 채팅 인터페이스 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                💬 AI 채팅
              </h2>
              <ChatInterface />
            </div>
          </div>

          {/* 도구 목록 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                🛠️ 사용 가능한 도구
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <ToolsList tools={tools} />
              )}
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            📚 프로젝트 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                MCP (Model Context Protocol)
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI 모델이 외부 도구와 안전하게 상호작용할 수 있도록 하는 프로토콜입니다.
                이 프로젝트에서는 날씨 조회, 계산기, 시간 조회 등의 도구를 제공합니다.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                사용 방법
              </h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• "서울 날씨 알려줘" - 날씨 정보 조회</li>
                <li>• "2+2 계산해줘" - 수학 계산</li>
                <li>• "지금 몇 시야?" - 현재 시간 조회</li>
                <li>• 자연어로 자유롭게 대화</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
