import React, { useState } from 'react';
import { 
  Plus, 
  RotateCcw, 
  Search, 
  FileText,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Filter,
  Columns3,
  Edit,
  Trash2
} from 'lucide-react';
import { TcpFixedLengthModel } from '../types.ts';
import { InlineModelEditor } from './InlineModelEditor.tsx';

interface TcpFixedLengthModelManagementProps {
  models: TcpFixedLengthModel[];
  onAddModel: () => void;
  onEditModel: (model: TcpFixedLengthModel) => void;
  onDeleteModel: (id: string) => void;
  onUpdateModel: (model: TcpFixedLengthModel) => void;
  onSelectColumnParameter: (model: TcpFixedLengthModel, section: 'request' | 'response' | 'all') => void;
  onSwitchToConfig: () => void;
  isDarkMode?: boolean;
}

export const TcpFixedLengthModelManagement: React.FC<TcpFixedLengthModelManagementProps> = ({
  models,
  onAddModel,
  onEditModel,
  onDeleteModel,
  onUpdateModel,
  onSelectColumnParameter,
  onSwitchToConfig,
  isDarkMode = false,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPage, setJumpPage] = useState<string>('1');
  const [isEmptyMock, setIsEmptyMock] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [batchMenuOpen, setBatchMenuOpen] = useState(false);

  // Expanded row ID for Image 2 style inline dropdown expansion!
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Filter models
  const displayedModels = isEmptyMock
    ? []
    : models.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const totalCount = displayedModels.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Pagination slice
  const startIndex = (currentPage - 1) * pageSize;
  const pageModels = displayedModels.slice(startIndex, startIndex + pageSize);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(pageModels.map((m) => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  const handleJump = () => {
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Toggle inline expansion for a row (Clicking 编辑 triggers this directly!)
  const handleToggleExpandRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const handleSaveInline = (updated: TcpFixedLengthModel) => {
    onUpdateModel(updated);
    setExpandedRowId(null); // Collapse after save or keep updated
  };

  return (
    <div className="space-y-3 bg-transparent text-gray-800">
      {/* 1. Top Tabs & Actions Header (Light theme, matching Image 1 & 4) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        {/* Top button-tabs matching Image 4 (e.g. [自定义TCP] button-tab style) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="h-8 px-4 text-xs font-medium rounded border border-[#1677ff] text-[#1677ff] bg-white shadow-2xs cursor-default"
          >
            模型管理
          </button>
          <button
            type="button"
            onClick={onSwitchToConfig}
            className="h-8 px-4 text-xs font-medium rounded border border-gray-200 text-gray-700 bg-white hover:border-gray-300 hover:text-[#1677ff] transition-colors cursor-pointer"
          >
            模型配置
          </button>
        </div>

        {/* Top Right Action Bar (Image 4 buttons: + 新增应用, 批量操作 ▾, Filter icon, Column icon) */}
        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              placeholder="搜索模型名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-44 pl-7 pr-3 text-xs rounded border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:border-[#1677ff] focus:outline-none transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2.5" />
          </div>

          {/* + 添加模型 (Primary blue button) */}
          <button
            type="button"
            onClick={onAddModel}
            className="h-8 px-3.5 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded text-xs font-medium flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>添加模型</span>
          </button>

          {/* 批量操作 Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setBatchMenuOpen(!batchMenuOpen)}
              className="h-8 px-3 bg-white border border-gray-300 text-gray-700 hover:border-gray-400 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>批量操作</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {batchMenuOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg py-1 z-40 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    selectedIds.forEach((id) => onDeleteModel(id));
                    setSelectedIds([]);
                    setBatchMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600"
                >
                  批量删除选中
                </button>
              </div>
            )}
          </div>

          {/* Filter button */}
          <button
            type="button"
            title="筛选"
            className="h-8 w-8 bg-white border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>

          {/* Column config button */}
          <button
            type="button"
            title="列设置"
            className="h-8 w-8 bg-white border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
          >
            <Columns3 className="w-3.5 h-3.5" />
          </button>

          {/* Toggle empty state for testing Image 2 empty state */}
          <button
            type="button"
            onClick={() => setIsEmptyMock(!isEmptyMock)}
            className={`h-8 px-2.5 rounded border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              isEmptyMock
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800'
            }`}
            title="还原图2中的暂无数据空状态与列表数据切换"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isEmptyMock ? '恢复模拟数据' : '清空测试空状态'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Table Card (Pure Light Theme matching Image 1, Image 2 & Image 4) */}
      <div className="bg-white rounded border border-gray-200 shadow-2xs overflow-hidden">
        {/* Table Title Bar */}
        <div className="h-10 px-4 flex items-center justify-between border-b border-gray-200 bg-[#f8fafc]">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-xs text-gray-800">
              TCP定长模型列表
            </h3>
            <span className="text-[11px] text-gray-400">
              （点击操作栏「编辑」即可展开对应行的配置项下拉表单，配置属性与模型配置相同）
            </span>
          </div>

          <div className="text-xs text-gray-500 font-mono">
            共 {totalCount} 个协议模型
          </div>
        </div>

        {/* Multi-tier Table (Image 2 structure + Image 4 style dividers + ONLY Edit and Delete) */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              {/* Row 1 of Table Header */}
              <tr className="bg-[#fafbfc] border-b border-gray-200 text-gray-600">
                <th rowSpan={2} className="w-10 px-3 py-2 text-center border-r border-gray-200">
                  <input
                    type="checkbox"
                    checked={
                      pageModels.length > 0 &&
                      pageModels.every((m) => selectedIds.includes(m.id))
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded text-[#1677ff] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th rowSpan={2} className="w-16 px-2 py-2 text-center text-gray-500 border-r border-gray-200 font-normal">
                  <div className="flex items-center justify-center gap-1">
                    <GripVertical className="w-3 h-3 text-gray-300" />
                    <span>序号</span>
                  </div>
                </th>
                <th rowSpan={2} className="px-4 py-2 font-medium border-r border-gray-200 min-w-[200px]">
                  名称
                </th>
                {/* Colspan 2: 请求参数 */}
                <th colSpan={2} className="px-4 py-1.5 font-medium text-center border-r border-b border-gray-200 bg-blue-50/50 text-[#1677ff]">
                  请求参数
                </th>
                {/* Colspan 2: 响应参数 */}
                <th colSpan={2} className="px-4 py-1.5 font-medium text-center border-r border-b border-gray-200 bg-emerald-50/50 text-emerald-600">
                  响应参数
                </th>
                <th rowSpan={2} className="px-4 py-2 font-medium border-r border-gray-200 min-w-[160px]">
                  创建时间
                </th>
                {/* 操作列：用户特别要求“只保留编辑与删除” */}
                <th rowSpan={2} className="px-4 py-2 font-medium text-center min-w-[120px]">
                  操作
                </th>
              </tr>

              {/* Row 2 of Table Header (Sub columns for 请求/响应参数) */}
              <tr className="bg-[#fafbfc] border-b border-gray-200 text-gray-500">
                <th className="px-3 py-1.5 font-normal text-center border-r border-gray-200 w-24">
                  偏移
                </th>
                <th className="px-3 py-1.5 font-normal text-center border-r border-gray-200 w-24">
                  长度
                </th>
                <th className="px-3 py-1.5 font-normal text-center border-r border-gray-200 w-24">
                  偏移
                </th>
                <th className="px-3 py-1.5 font-normal text-center border-r border-gray-200 w-24">
                  长度
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {/* Empty State matching Image 2 */}
              {pageModels.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-400 font-normal">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium">暂无数据</div>
                      <p className="text-xs text-gray-400">
                        当前模型配置库为空，可点击右上角「恢复模拟数据」或「添加模型」
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsEmptyMock(false)}
                        className="text-xs text-[#1677ff] hover:underline mt-1 font-medium cursor-pointer"
                      >
                        点击加载模拟数据
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                pageModels.map((model, idx) => {
                  const isChecked = selectedIds.includes(model.id);
                  const isExpanded = expandedRowId === model.id;
                  return (
                    <React.Fragment key={model.id}>
                      {/* Normal Table Row */}
                      <tr
                        className={`group transition-colors ${
                          isExpanded
                            ? 'bg-blue-50/30'
                            : isChecked
                            ? 'bg-blue-50/40'
                            : 'hover:bg-[#f5f8ff]'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-3 py-3 text-center border-r border-gray-100">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleSelectOne(model.id, e.target.checked)}
                            className="rounded text-[#1677ff] focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* 序号 + 展开折叠箭头 (Image 2 style) */}
                        <td className="px-2 py-3 text-center text-gray-400 border-r border-gray-100 font-mono">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleToggleExpandRow(model.id)}
                              className="text-gray-400 hover:text-[#1677ff] p-0.5 cursor-pointer"
                              title={isExpanded ? '收起配置' : '点击展开配置'}
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-[#1677ff]" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <span>{startIndex + idx + 1}</span>
                          </div>
                        </td>

                        {/* 名称 (Clickable) */}
                        <td className="px-4 py-3 border-r border-gray-100">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleExpandRow(model.id)}
                              className="font-medium text-gray-900 hover:text-[#1677ff] text-left cursor-pointer group-hover:underline"
                              title="点击展开当前模型配置"
                            >
                              <span>{model.name}</span>
                            </button>
                            {model.useRelField && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 shrink-0 font-normal">
                                已关联
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 请求参数: 偏移 */}
                        <td
                          onClick={() => onSelectColumnParameter(model, 'request')}
                          className="px-3 py-3 text-center font-mono tabular-nums text-gray-700 border-r border-gray-100 cursor-pointer hover:bg-blue-50/80 hover:text-[#1677ff]"
                          title="点击查看参数详情"
                        >
                          <span className="inline-block px-2.5 py-0.5 rounded bg-gray-50 font-semibold">
                            {model.requestOffset}
                          </span>
                        </td>

                        {/* 请求参数: 长度 */}
                        <td
                          onClick={() => onSelectColumnParameter(model, 'request')}
                          className="px-3 py-3 text-center font-mono tabular-nums text-gray-700 border-r border-gray-100 cursor-pointer hover:bg-blue-50/80 hover:text-[#1677ff]"
                          title="点击查看参数详情"
                        >
                          <span className="inline-block px-2.5 py-0.5 rounded bg-gray-50 font-semibold">
                            {model.requestLength}
                          </span>
                        </td>

                        {/* 响应参数: 偏移 */}
                        <td
                          onClick={() => onSelectColumnParameter(model, 'response')}
                          className="px-3 py-3 text-center font-mono tabular-nums text-gray-700 border-r border-gray-100 cursor-pointer hover:bg-emerald-50/80 hover:text-emerald-600"
                          title="点击查看参数详情"
                        >
                          <span className="inline-block px-2.5 py-0.5 rounded bg-gray-50 font-semibold">
                            {model.responseOffset}
                          </span>
                        </td>

                        {/* 响应参数: 长度 */}
                        <td
                          onClick={() => onSelectColumnParameter(model, 'response')}
                          className="px-3 py-3 text-center font-mono tabular-nums text-gray-700 border-r border-gray-100 cursor-pointer hover:bg-emerald-50/80 hover:text-emerald-600"
                          title="点击查看参数详情"
                        >
                          <span className="inline-block px-2.5 py-0.5 rounded bg-gray-50 font-semibold">
                            {model.responseLength}
                          </span>
                        </td>

                        {/* 创建时间 */}
                        <td className="px-4 py-3 font-mono tabular-nums text-gray-500 border-r border-gray-100 whitespace-nowrap">
                          {model.createdAt}
                        </td>

                        {/* 操作列：严格按照用户要求“只保留编辑与删除” */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2 text-xs">
                            {/* 编辑按钮：点击后当前选择行下拉展开 */}
                            <button
                              type="button"
                              onClick={() => handleToggleExpandRow(model.id)}
                              className={`font-medium hover:underline flex items-center gap-1 cursor-pointer ${
                                isExpanded ? 'text-amber-600 font-semibold' : 'text-[#1677ff]'
                              }`}
                            >
                              <span>{isExpanded ? '收起' : '编辑'}</span>
                            </button>

                            <span className="text-gray-300">|</span>

                            {/* 删除按钮 */}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(model.id)}
                              className="text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Image 2 Inline Expansion Row (下拉展开当前行配置) */}
                      {isExpanded && (
                        <tr>
                          <td
                            colSpan={9}
                            className="p-0 border-l-4 border-l-[#1677ff] bg-[#f8fafc] animate-in fade-in duration-150"
                          >
                            <InlineModelEditor
                              model={model}
                              onSave={handleSaveInline}
                              onCancel={() => setExpandedRowId(null)}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Bottom Pagination Bar (Light theme) */}
        <div className="h-11 px-4 flex items-center justify-between border-t border-gray-200 text-xs select-none bg-[#fafbfc] text-gray-600">
          <div>
            本页记录从 {totalCount > 0 ? startIndex + 1 : 0} 到{' '}
            {Math.min(startIndex + pageSize, totalCount)}, 总数{' '}
            <strong className="text-gray-800 font-mono">{totalCount}</strong> 条
          </div>

          <div className="flex items-center gap-3">
            {/* Page size select */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-6 px-2 text-xs rounded border border-gray-300 bg-white text-gray-700 cursor-pointer"
            >
              <option value={15}>15条/页</option>
              <option value={30}>30条/页</option>
              <option value={50}>50条/页</option>
              <option value={100}>100条/页</option>
            </select>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isCur = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-6 h-6 flex items-center justify-center rounded text-xs font-mono font-medium transition-colors ${
                      isCur
                        ? 'bg-[#1677ff] text-white shadow-2xs'
                        : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>

            {/* Jump to page */}
            <div className="flex items-center gap-1 text-gray-500">
              <span>前往</span>
              <input
                type="text"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJump()}
                className="w-8 h-6 text-center text-xs font-mono rounded border border-gray-300 bg-white text-gray-800"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white p-5 rounded-lg shadow-xl max-w-sm w-full border border-gray-200 animate-in fade-in zoom-in-95 duration-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">确认删除该TCP定长模型？</h4>
            <p className="text-xs text-gray-500 mb-4">
              删除后该定长协议规则将不再参与网络报文解析与业务字段提取，操作不可恢复。
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteModel(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3 py-1.5 text-xs rounded bg-red-600 hover:bg-red-700 text-white font-medium cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
