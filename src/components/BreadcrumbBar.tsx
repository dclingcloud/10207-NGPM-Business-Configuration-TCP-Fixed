import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  ChevronRight, 
  Calendar, 
  Search, 
  RotateCw,
  Clock
} from 'lucide-react';

interface BreadcrumbBarProps {
  currentModelName: string;
  isDarkMode?: boolean;
  onRefresh?: () => void;
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({
  currentModelName,
  isDarkMode = false,
  onRefresh,
}) => {
  const [timeRange, setTimeRange] = useState('2026-05-13 17:34 ~ 2026-05-13 18:34');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const quickTimes = [
    { label: '最近1小时', val: '2026-05-13 17:34 ~ 2026-05-13 18:34' },
    { label: '最近6小时', val: '2026-05-13 12:34 ~ 2026-05-13 18:34' },
    { label: '最近24小时', val: '2026-05-12 18:34 ~ 2026-05-13 18:34' },
    { label: '最近7天', val: '2026-05-06 18:34 ~ 2026-05-13 18:34' },
  ];

  return (
    <div
      className={`h-11 px-4 flex items-center justify-between border-b text-xs select-none shrink-0 transition-colors ${
        isDarkMode
          ? 'bg-[#182230] border-gray-800 text-gray-300'
          : 'bg-white border-gray-200 text-gray-600'
      }`}
    >
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-1.5 font-normal">
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#1677ff] mr-1" />
        <span className="hover:text-[#1677ff] cursor-pointer">配置</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="hover:text-[#1677ff] cursor-pointer">模型配置</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {currentModelName}
        </span>
      </div>

      {/* Right Controls: Time Range, Search, Refresh */}
      <div className="flex items-center gap-2">
        {/* Time Range Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTimePicker(!showTimePicker)}
            className={`h-7 px-2.5 rounded flex items-center gap-2 border text-xs transition-colors ${
              isDarkMode
                ? 'bg-[#1f2a3d] border-gray-700 text-gray-200 hover:border-gray-500'
                : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 shadow-2xs'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-mono tabular-nums">{timeRange}</span>
            <span className="text-[10px] text-gray-400">▾</span>
          </button>

          {showTimePicker && (
            <div
              className={`absolute right-0 mt-1 w-64 rounded-md shadow-lg border p-2 z-50 text-xs ${
                isDarkMode ? 'bg-[#1f2a3d] border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              <div className="font-medium text-gray-400 mb-1 px-1">快速时间范围</div>
              <div className="space-y-1 mb-2">
                {quickTimes.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setTimeRange(item.val);
                      setShowTimePicker(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between hover:bg-[#1677ff]/10 hover:text-[#1677ff] ${
                      timeRange === item.val ? 'bg-[#1677ff]/15 text-[#1677ff] font-medium' : ''
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[10px] text-gray-400">{item.val.split(' ~ ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Action Button */}
        <button
          type="button"
          onClick={handleRefreshClick}
          className="h-7 w-7 rounded bg-[#1677ff] hover:bg-[#4096ff] text-white flex items-center justify-center transition-colors shadow-2xs"
          title="查询"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Refresh Action Button */}
        <button
          type="button"
          onClick={handleRefreshClick}
          className={`h-7 w-7 rounded border flex items-center justify-center transition-colors ${
            isDarkMode
              ? 'bg-[#1f2a3d] border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700'
              : 'bg-white border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 shadow-2xs'
          }`}
          title="刷新数据"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
