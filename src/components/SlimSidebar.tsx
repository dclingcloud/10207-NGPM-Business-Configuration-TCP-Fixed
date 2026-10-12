import React from 'react';
import {
  FileText,
  Network,
  Database,
  Users,
  GitBranch,
  Bell,
  LayoutGrid,
  SlidersHorizontal,
  Share2,
  Bot
} from 'lucide-react';

interface SlimSidebarProps {
  activeNav: string;
  onSelectNav: (id: string) => void;
}

export const SlimSidebar: React.FC<SlimSidebarProps> = ({
  activeNav,
  onSelectNav,
}) => {
  const navItems = [
    { id: 'docs', icon: FileText, label: '概览仪表盘' },
    { id: 'network', icon: Network, label: '网络拓扑' },
    { id: 'database', icon: Database, label: '数据存储' },
    { id: 'users', icon: Users, label: '用户管理' },
    { id: 'routes', icon: GitBranch, label: '流量路由' },
    { id: 'alerts', icon: Bell, label: '告警中心', badge: '3' },
    { id: 'apps', icon: LayoutGrid, label: '应用中心' },
    { id: 'config', icon: SlidersHorizontal, label: '功能配置' },
    { id: 'cluster', icon: Share2, label: '节点集群' },
    { id: 'ai', icon: Bot, label: '智能分析' },
  ];

  return (
    <aside className="w-12 bg-[#182230] text-gray-400 flex flex-col items-center py-2 shrink-0 border-r border-[#243247] select-none z-20">
      <div className="flex flex-col items-center gap-1 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectNav(item.id)}
              title={item.label}
              className={`relative w-9 h-9 flex items-center justify-center rounded transition-all group ${
                isActive
                  ? 'bg-[#1677ff] text-white shadow-sm'
                  : 'hover:bg-white/10 hover:text-gray-200 text-gray-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.badge && !isActive && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
