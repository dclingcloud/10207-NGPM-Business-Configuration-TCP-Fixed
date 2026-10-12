import React, { useState } from 'react';
import { 
  Search, 
  Maximize2, 
  Minimize2, 
  ChevronDown, 
  ChevronRight,
  Sun,
  Moon,
  HelpCircle,
  Bell,
  Check
} from 'lucide-react';

interface TopHeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  searchKeyword: string;
  onSearchChange: (val: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  searchKeyword,
  onSearchChange,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <header className="h-12 bg-[#182230] text-gray-200 flex items-center justify-between px-3 select-none border-b border-[#243247] shrink-0 z-30">
      {/* Left Logo & App Name */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 pr-2">
          <div className="w-6 h-6 bg-[#1677ff] rounded flex items-center justify-center font-bold text-white text-xs shadow-sm">
            N
          </div>
          <span className="font-bold text-sm tracking-wide text-white">NGPM</span>
          <button 
            type="button"
            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors ml-1"
            title="导航折叠"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="搜索配置"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-7 w-48 bg-[#243247]/80 hover:bg-[#243247] focus:bg-[#243247] text-xs text-gray-200 placeholder-gray-400 pl-7 pr-3 rounded border border-transparent focus:border-[#1677ff] focus:outline-none transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2" />
        </div>

        {/* Theme Mode Toggle (Light/Dark Console) */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={isDarkMode ? '切换至亮色模式 (参考图4/5)' : '切换至暗色模式 (参考图2/3)'}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-300 hover:text-white rounded hover:bg-white/10 transition-colors"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">亮色</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">暗色</span>
            </>
          )}
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-white rounded hover:bg-white/10 transition-colors"
          title={isFullscreen ? '退出全屏' : '全屏'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Help button */}
        <button
          type="button"
          onClick={() => setShowHelpModal(true)}
          className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-white rounded hover:bg-white/10 transition-colors"
          title="系统帮助"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 pl-2 py-1 text-xs text-gray-200 hover:text-white cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-[#1677ff] flex items-center justify-center text-[10px] text-white font-medium">
              行
            </div>
            <span className="text-xs">admin</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-[#1e293b] border border-gray-700 rounded shadow-lg py-1 text-xs text-gray-200 z-50">
              <div className="px-3 py-1.5 border-b border-gray-700/60 font-medium text-gray-400">
                超级管理员
              </div>
              <button 
                type="button" 
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-white/10"
              >
                个人中心
              </button>
              <button 
                type="button" 
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-white/10"
              >
                权限设置
              </button>
              <div className="border-t border-gray-700/60 my-1"></div>
              <button 
                type="button" 
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-red-500/20 text-red-400"
              >
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white text-gray-800 rounded-lg shadow-xl w-full max-w-md p-5 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-semibold text-gray-900 mb-2">NGPM 协议模型配置说明</h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              本系统用于网络性能管理(NGPM)多协议报文解析。支持通过设定请求参数与响应参数的偏移量与长度，快速提取报文关键业务字段与错误代码。
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded p-3 text-xs text-blue-800 mb-4 space-y-1">
              <div className="font-semibold">操作指引：</div>
              <div>• <strong>TCP定长模型管理</strong>：支持查看、筛选、删除与启用/停用。点击表格列即可弹出对应参数的详细视图。</div>
              <div>• <strong>TCP定长模型配置</strong>：配置报文头、错误码、messagePair与业务字段，点击保存添加立即生效。</div>
              <div>• <strong>清空空状态测试</strong>：可一键切换为图2中的无数据状态。</div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 bg-[#1677ff] text-white text-xs font-medium rounded hover:bg-[#4096ff] transition-colors"
              >
                了解并关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
