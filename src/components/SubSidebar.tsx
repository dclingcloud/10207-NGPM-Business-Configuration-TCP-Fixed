import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export type SubMenuType = 
  | 'desensitize'
  | 'smart_baseline'
  | 'node_stats'
  | 'http_model'
  | 'dubbo'
  | 'app_string_pattern'
  | 'unionpay'
  | 'unionpay_atm'
  | 'second_gen_pay'
  | 'tcp_string_model'
  | 'tcp_fixed_model';

interface SubSidebarProps {
  selectedMenu: SubMenuType;
  onSelectMenu: (menu: SubMenuType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  tcpFixedCount?: number;
  httpCount?: number;
  isDarkMode?: boolean;
}

export const SubSidebar: React.FC<SubSidebarProps> = ({
  selectedMenu,
  onSelectMenu,
  isCollapsed,
  onToggleCollapse,
  tcpFixedCount = 6,
  httpCount = 7,
  isDarkMode = false,
}) => {
  const [manageExpanded, setManageExpanded] = useState(true);
  const [modelConfigExpanded, setModelConfigExpanded] = useState(true);

  if (isCollapsed) {
    return (
      <div className={`w-8 border-r flex flex-col items-center py-3 select-none transition-all ${
        isDarkMode ? 'bg-[#1e293b] border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-500'
      }`}>
        <button
          type="button"
          onClick={onToggleCollapse}
          title="展开侧边栏"
          className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside
      className={`w-48 shrink-0 border-r flex flex-col select-none transition-all ${
        isDarkMode ? 'bg-[#1a2333] border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-700'
      }`}
    >
      {/* Header */}
      <div className={`h-11 px-4 flex items-center justify-between border-b text-xs font-semibold ${
        isDarkMode ? 'border-gray-800 text-gray-200' : 'border-gray-100 text-gray-800'
      }`}>
        <span>功能配置</span>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600"
          title="收起"
        >
          <PanelLeftClose className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Nav Menu Content */}
      <div className="flex-1 overflow-y-auto py-2 text-xs">
        {/* Section 1: 管理 */}
        <div>
          <button
            type="button"
            onClick={() => setManageExpanded(!manageExpanded)}
            className={`w-full px-4 py-2 flex items-center justify-between text-xs font-medium ${
              isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>管理</span>
            {manageExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {manageExpanded && (
            <div className="space-y-0.5">
              {[
                { id: 'desensitize', label: '脱敏配置' },
                { id: 'smart_baseline', label: '智能基线' },
                { id: 'node_stats', label: '节点统计' },
              ].map((item) => {
                const isActive = selectedMenu === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectMenu(item.id as SubMenuType)}
                    className={`w-full text-left pl-8 pr-4 py-1.5 text-xs transition-colors ${
                      isActive
                        ? isDarkMode
                          ? 'bg-[#1677ff]/20 text-[#4096ff] font-medium border-r-2 border-[#1677ff]'
                          : 'bg-[#e6f4ff] text-[#1677ff] font-medium border-r-2 border-[#1677ff]'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800/60'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: 模型配置 */}
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setModelConfigExpanded(!modelConfigExpanded)}
            className={`w-full px-4 py-2 flex items-center justify-between text-xs font-medium ${
              isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>模型配置</span>
            {modelConfigExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {modelConfigExpanded && (
            <div className="space-y-0.5">
              {[
                { id: 'http_model', label: 'HTTP模型', badge: httpCount },
                { id: 'dubbo', label: 'DUBBO' },
                { id: 'app_string_pattern', label: 'App String Pattern' },
                { id: 'unionpay', label: '银联' },
                { id: 'unionpay_atm', label: 'UnionPay ATM' },
                { id: 'second_gen_pay', label: '二代支付' },
                { id: 'tcp_string_model', label: 'TCP字符串模型' },
                { id: 'tcp_fixed_model', label: 'TCP定长模型', badge: tcpFixedCount },
              ].map((item) => {
                const isActive = selectedMenu === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectMenu(item.id as SubMenuType)}
                    className={`w-full flex items-center justify-between text-left pl-8 pr-4 py-1.5 text-xs transition-colors ${
                      isActive
                        ? isDarkMode
                          ? 'bg-[#1677ff]/20 text-[#4096ff] font-medium border-r-2 border-[#1677ff]'
                          : 'bg-[#e6f4ff] text-[#1677ff] font-medium border-r-2 border-[#1677ff]'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800/60'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? 'bg-[#1677ff] text-white'
                            : isDarkMode
                            ? 'bg-gray-800 text-gray-400'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
