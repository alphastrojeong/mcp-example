'use client';

interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

interface ToolsListProps {
  tools: MCPTool[];
}

const ToolsList = ({ tools }: ToolsListProps) => {
  const getToolIcon = (toolName: string): string => {
    switch (toolName) {
      case 'get_weather':
        return '🌤️';
      case 'calculate':
        return '🧮';
      case 'get_time':
        return '🕐';
      default:
        return '🔧';
    }
  };

  const getToolExample = (toolName: string): string => {
    switch (toolName) {
      case 'get_weather':
        return '"서울 날씨 알려줘"';
      case 'calculate':
        return '"2+2 계산해줘"';
      case 'get_time':
        return '"지금 몇 시야?"';
      default:
        return '자연어로 요청하세요';
    }
  };

  if (tools.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          사용 가능한 도구가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tools.map((tool) => (
        <div
          key={tool.name}
          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{getToolIcon(tool.name)}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                {tool.name.replace('_', ' ').toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {tool.description}
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  예시: {getToolExample(tool.name)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolsList;
