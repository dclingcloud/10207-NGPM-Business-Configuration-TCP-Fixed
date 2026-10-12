import React, { useState } from 'react';
import { TopHeader } from './components/TopHeader.tsx';
import { SlimSidebar } from './components/SlimSidebar.tsx';
import { SubSidebar, SubMenuType } from './components/SubSidebar.tsx';
import { BreadcrumbBar } from './components/BreadcrumbBar.tsx';
import { TcpFixedLengthModelManagement } from './components/TcpFixedLengthModelManagement.tsx';
import { TcpFixedLengthModelConfig } from './components/TcpFixedLengthModelConfig.tsx';
import { ParameterDetailModal } from './components/ParameterDetailModal.tsx';
import { HttpModelView } from './components/HttpModelView.tsx';
import { TcpStringModelView } from './components/TcpStringModelView.tsx';
import { initialTcpFixedModels } from './mockData.ts';
import { TcpFixedLengthModel } from './types.ts';
import { CheckCircle2, Info } from 'lucide-react';

export default function App() {
  // Navigation & Theme States
  const [activeSlimNav, setActiveSlimNav] = useState('config'); // Sliders icon
  const [selectedSubMenu, setSelectedSubMenu] = useState<SubMenuType>('tcp_fixed_model'); // DEFAULT: TCP定长模型!
  const [isSubSidebarCollapsed, setIsSubSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default clean enterprise light mode (ref Image 4/5)
  const [searchKeyword, setSearchKeyword] = useState('');

  // TCP Fixed-Length Model Tab: 'manage' (模型管理, default) vs 'config' (模型配置)
  const [tcpFixedTab, setTcpFixedTab] = useState<'manage' | 'config'>('manage');

  // Models State
  const [tcpFixedModels, setTcpFixedModels] = useState<TcpFixedLengthModel[]>(initialTcpFixedModels);
  const [editingModel, setEditingModel] = useState<TcpFixedLengthModel | null>(null);

  // Parameter Detail Modal States
  const [inspectingModel, setInspectingModel] = useState<TcpFixedLengthModel | null>(null);
  const [inspectingSection, setInspectingSection] = useState<'request' | 'response' | 'all'>('all');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Model actions
  const handleAddModel = () => {
    setEditingModel(null);
    setTcpFixedTab('config');
  };

  const handleEditModel = (model: TcpFixedLengthModel) => {
    setEditingModel(model);
    setTcpFixedTab('config');
  };

  const handleDeleteModel = (id: string) => {
    setTcpFixedModels((prev) => prev.filter((m) => m.id !== id));
    showToast('TCP定长模型已删除');
  };

  const handleToggleStatus = (id: string) => {
    setTcpFixedModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
    const target = tcpFixedModels.find((m) => m.id === id);
    if (target) {
      showToast(`模型「${target.name}」已${target.enabled ? '停用' : '启用'}`);
    }
  };

  const handleDuplicateModel = (model: TcpFixedLengthModel) => {
    const duplicated: TcpFixedLengthModel = {
      ...model,
      id: `${Date.now()}`,
      name: `${model.name}_副本`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setTcpFixedModels((prev) => [duplicated, ...prev]);
    showToast(`已复制创建「${duplicated.name}」`);
  };

  const handleSaveModel = (model: TcpFixedLengthModel) => {
    if (editingModel) {
      // update
      setTcpFixedModels((prev) =>
        prev.map((m) => (m.id === model.id ? model : m))
      );
      showToast(`模型「${model.name}」配置已成功保存更新`);
    } else {
      // create
      setTcpFixedModels((prev) => [model, ...prev]);
      showToast(`TCP定长模型「${model.name}」已成功添加`);
    }
    setEditingModel(null);
    setTcpFixedTab('manage'); // Switch back to management tab
  };

  const handleOpenParameterInspector = (
    model: TcpFixedLengthModel,
    section: 'request' | 'response' | 'all'
  ) => {
    setInspectingModel(model);
    setInspectingSection(section);
  };

  // Get current active title for breadcrumb
  const getSubMenuLabel = (key: SubMenuType) => {
    switch (key) {
      case 'tcp_fixed_model':
        return 'TCP定长模型';
      case 'tcp_string_model':
        return 'TCP字符串模型';
      case 'http_model':
        return 'HTTP模型';
      case 'dubbo':
        return 'DUBBO';
      case 'app_string_pattern':
        return 'App String Pattern';
      case 'unionpay':
        return '银联';
      case 'unionpay_atm':
        return 'UnionPay ATM';
      case 'second_gen_pay':
        return '二代支付';
      case 'desensitize':
        return '脱敏配置';
      case 'smart_baseline':
        return '智能基线';
      case 'node_stats':
        return '节点统计';
      default:
        return '模型配置';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased text-gray-900 transition-colors ${
        isDarkMode ? 'dark bg-[#141c28] text-gray-100' : 'bg-[#f4f6fa] text-gray-800'
      }`}
    >
      {/* 1. Top Navbar matching Image 1 */}
      <TopHeader
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
      />

      {/* Main Layout Area: Slim Sidebar + Secondary Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Leftmost Dark Icon Bar (Slim Sidebar) */}
        <SlimSidebar
          activeNav={activeSlimNav}
          onSelectNav={setActiveSlimNav}
        />

        {/* Secondary Sub Sidebar (功能配置, with TCP定长模型 default selected) */}
        <SubSidebar
          selectedMenu={selectedSubMenu}
          onSelectMenu={(menu) => {
            setSelectedSubMenu(menu);
            if (menu === 'tcp_fixed_model') {
              setTcpFixedTab('manage');
            }
          }}
          isCollapsed={isSubSidebarCollapsed}
          onToggleCollapse={() => setIsSubSidebarCollapsed(!isSubSidebarCollapsed)}
          tcpFixedCount={tcpFixedModels.length}
          httpCount={7}
          isDarkMode={isDarkMode}
        />

        {/* Main Workspace Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Breadcrumb & Actions Bar */}
          <BreadcrumbBar
            currentModelName={getSubMenuLabel(selectedSubMenu)}
            isDarkMode={isDarkMode}
            onRefresh={() => showToast('数据已刷新')}
          />

          {/* Content Body */}
          <main className="flex-1 p-4 md:p-6">
            {/* View 1: TCP定长模型 (DEFAULT VIEW) */}
            {selectedSubMenu === 'tcp_fixed_model' && (
              <div>
                {/* Tab 1 Content: 模型管理 (Image 2 list with Image 4 button tabs and style) */}
                {tcpFixedTab === 'manage' && (
                  <TcpFixedLengthModelManagement
                    models={tcpFixedModels}
                    onAddModel={handleAddModel}
                    onEditModel={handleEditModel}
                    onDeleteModel={handleDeleteModel}
                    onUpdateModel={(updated) => {
                      setTcpFixedModels((prev) =>
                        prev.map((m) => (m.id === updated.id ? updated : m))
                      );
                      showToast(`模型「${updated.name}」配置已成功修改`);
                    }}
                    onSelectColumnParameter={handleOpenParameterInspector}
                    onSwitchToConfig={() => setTcpFixedTab('config')}
                    isDarkMode={isDarkMode}
                  />
                )}

                {/* Tab 2 Content: 模型配置 (Image 3 form with Image 5 style) */}
                {tcpFixedTab === 'config' && (
                  <TcpFixedLengthModelConfig
                    initialModel={editingModel}
                    onSave={handleSaveModel}
                    onCancel={() => {
                      setEditingModel(null);
                      setTcpFixedTab('manage');
                    }}
                    onSwitchToManage={() => {
                      setEditingModel(null);
                      setTcpFixedTab('manage');
                    }}
                    isDarkMode={isDarkMode}
                  />
                )}
              </div>
            )}

            {/* View 2: TCP字符串模型 (Newly added) */}
            {selectedSubMenu === 'tcp_string_model' && (
              <TcpStringModelView isDarkMode={isDarkMode} />
            )}

            {/* View 3: HTTP模型 (Image 1 original) */}
            {selectedSubMenu === 'http_model' && (
              <HttpModelView isDarkMode={isDarkMode} />
            )}

            {/* Other models placeholder */}
            {selectedSubMenu !== 'tcp_fixed_model' &&
              selectedSubMenu !== 'tcp_string_model' &&
              selectedSubMenu !== 'http_model' && (
                <div
                  className={`p-12 text-center rounded-lg border ${
                    isDarkMode
                      ? 'bg-[#1b2533] border-gray-800 text-gray-400'
                      : 'bg-white border-gray-200 text-gray-500'
                  }`}
                >
                  <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <h4 className="text-sm font-semibold mb-1">
                    {getSubMenuLabel(selectedSubMenu)} 模块
                  </h4>
                  <p className="text-xs">
                    当前选中的协议模型模块已就绪，可随时切换回「TCP定长模型」或「TCP字符串模型」进行参数管理。
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubMenu('tcp_fixed_model');
                      setTcpFixedTab('manage');
                    }}
                    className="mt-4 px-4 py-1.5 bg-[#1677ff] text-white text-xs font-medium rounded hover:bg-[#4096ff] transition-colors"
                  >
                    返回 TCP定长模型
                  </button>
                </div>
              )}
          </main>
        </div>
      </div>

      {/* Parameter Details Slide-over / Modal (Shown on table column/row click) */}
      <ParameterDetailModal
        model={inspectingModel}
        onClose={() => setInspectingModel(null)}
        onEdit={(m) => {
          setInspectingModel(null);
          handleEditModel(m);
        }}
        isDarkMode={isDarkMode}
        highlightSection={inspectingSection}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#182230] text-white px-4 py-2.5 rounded shadow-xl text-xs border border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
