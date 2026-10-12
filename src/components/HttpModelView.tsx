import React, { useState } from 'react';
import { 
  Plus, 
  HelpCircle, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  Link2,
  FileCode,
  Check
} from 'lucide-react';
import { HttpModelItem } from '../types.ts';
import { initialHttpModels } from '../mockData.ts';

interface HttpModelViewProps {
  isDarkMode?: boolean;
}

export const HttpModelView: React.FC<HttpModelViewProps> = ({ isDarkMode = false }) => {
  const [activeTab, setActiveTab] = useState<'manage' | 'config'>('manage');
  const [models, setModels] = useState<HttpModelItem[]>(initialHttpModels);
  const [isEmptyMock, setIsEmptyMock] = useState(false);
  const [selectedModel, setSelectedModel] = useState<HttpModelItem | null>(null);

  const displayedList = isEmptyMock ? [] : models;

  return (
    <div className="space-y-4">
      {/* Tabs matching Image 1: 模型管理 / 模型配置 */}
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'manage'
              ? 'border-[#1677ff] text-[#1677ff]'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          模型管理
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'config'
              ? 'border-[#1677ff] text-[#1677ff]'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          模型配置
        </button>
      </div>

      {activeTab === 'manage' ? (
        <div className="space-y-3">
          {/* Action row matching Image 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('config')}
                className="h-8 px-3.5 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded text-xs font-medium flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>添加模型</span>
              </button>

              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>

              <span className="text-xs text-gray-500">
                共 <strong className="text-gray-900 dark:text-white font-mono">{displayedList.length}</strong> 个协议模型
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-8 px-3 rounded border border-gray-300 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1b2533]"
              >
                业务字段
              </button>
              <button
                type="button"
                className="h-8 w-8 rounded border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center bg-white dark:bg-[#1b2533]"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsEmptyMock(!isEmptyMock)}
                className="h-8 px-2.5 rounded border border-gray-200 dark:border-gray-700 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 bg-white dark:bg-[#1b2533]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isEmptyMock ? '恢复数据' : '清空测试空状态'}</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div
            className={`rounded border shadow-2xs overflow-hidden ${
              isDarkMode
                ? 'bg-[#1b2533] border-gray-800'
                : 'bg-white border-gray-200'
            }`}
          >
            <div
              className={`h-10 px-4 flex items-center justify-between border-b ${
                isDarkMode
                  ? 'bg-[#1f2c3d] border-gray-800 text-gray-200'
                  : 'bg-[#fafbfc] border-gray-200 text-gray-800'
              }`}
            >
              <h3 className="font-semibold text-xs">HTTP模型列表</h3>
              <span className="text-xs text-gray-400 font-mono">
                共 {displayedList.length} 条模型记录
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead
                  className={`border-b text-gray-600 dark:text-gray-300 ${
                    isDarkMode ? 'bg-[#223042] border-gray-700' : 'bg-[#fafbfc] border-gray-200'
                  }`}
                >
                  <tr>
                    <th className="px-4 py-2.5 font-medium w-16">模型ID</th>
                    <th className="px-4 py-2.5 font-medium min-w-[120px]">名称</th>
                    <th className="px-4 py-2.5 font-medium min-w-[100px]">方法</th>
                    <th className="px-4 py-2.5 font-medium min-w-[140px]">路径规则</th>
                    <th className="px-4 py-2.5 font-medium min-w-[180px]">请求体参数</th>
                    <th className="px-4 py-2.5 font-medium min-w-[180px]">返回体参数</th>
                    <th className="px-4 py-2.5 font-medium min-w-[150px]">创建时间</th>
                    <th className="px-4 py-2.5 font-medium text-center min-w-[110px]">功能号</th>
                    <th className="px-4 py-2.5 font-medium text-center min-w-[100px]">配置</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {displayedList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    displayedList.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#f5f8ff] dark:hover:bg-[#223042] transition-colors`}
                      >
                        <td className="px-4 py-3 font-mono font-medium text-gray-700 dark:text-gray-300">
                          {item.modelId}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-[11px]">
                          {item.method}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-[11px]">
                          {item.pathRule}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-[11px] truncate max-w-xs">
                          {item.reqBodyParam}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-[11px] truncate max-w-xs">
                          {item.resBodyParam}
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">
                          {item.createdAt}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded bg-[#1677ff] hover:bg-[#4096ff] text-white text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                          >
                            <span>功能号关联</span>
                            {item.funcCodeCount > 0 && (
                              <span className="w-3.5 h-3.5 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                                {item.funcCodeCount}
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5 text-xs">
                            <button
                              type="button"
                              onClick={() => setSelectedModel(item)}
                              className="text-[#1677ff] hover:underline"
                            >
                              编辑
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              type="button"
                              onClick={() =>
                                setModels(models.filter((m) => m.id !== item.id))
                              }
                              className="text-red-500 hover:underline"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom pagination */}
            <div
              className={`h-11 px-4 flex items-center justify-between border-t text-xs select-none ${
                isDarkMode
                  ? 'bg-[#1f2c3d] border-gray-800 text-gray-400'
                  : 'bg-[#fafbfc] border-gray-200 text-gray-500'
              }`}
            >
              <div>共 {displayedList.length} 条</div>
              <div className="flex items-center gap-2">
                <select className="h-6 px-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#182230]">
                  <option>15条/页</option>
                  <option>30条/页</option>
                </select>
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 dark:border-gray-700">
                    &lt;
                  </button>
                  <button className="w-6 h-6 flex items-center justify-center rounded bg-[#1677ff] text-white font-mono">
                    1
                  </button>
                  <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 dark:border-gray-700">
                    &gt;
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <span>跳至</span>
                  <input
                    type="text"
                    defaultValue="1"
                    className="w-8 h-6 text-center text-xs font-mono rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#182230]"
                  />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`p-6 rounded-lg border ${
            isDarkMode ? 'bg-[#1b2533] border-gray-800' : 'bg-white border-gray-200'
          }`}
        >
          <h4 className="text-sm font-semibold mb-3">HTTP模型快速配置</h4>
          <p className="text-xs text-gray-500 mb-4">
            配置HTTP路径正则表达式、请求方法（GET/POST）与键值分隔规则。
          </p>
          <div className="space-y-3 max-w-lg">
            <div>
              <label className="text-xs text-gray-600 block mb-1">模型名称</label>
              <input
                type="text"
                placeholder="请输入HTTP模型名称"
                className="w-full h-8 px-3 text-xs rounded border border-gray-300"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">路径规则</label>
              <input
                type="text"
                placeholder=".*"
                defaultValue=".*"
                className="w-full h-8 px-3 text-xs rounded border border-gray-300 font-mono"
              />
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className="h-8 px-4 bg-[#1677ff] text-white rounded text-xs font-medium"
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
