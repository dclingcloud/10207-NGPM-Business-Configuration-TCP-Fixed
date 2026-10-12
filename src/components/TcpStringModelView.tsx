import React, { useState } from 'react';
import { 
  Plus, 
  HelpCircle, 
  RotateCcw, 
  Search, 
  Edit3, 
  Trash2, 
  Copy,
  Layers,
  Check
} from 'lucide-react';

interface TcpStringModelViewProps {
  isDarkMode?: boolean;
}

export const TcpStringModelView: React.FC<TcpStringModelViewProps> = ({ isDarkMode = false }) => {
  const [activeTab, setActiveTab] = useState<'manage' | 'config'>('manage');
  const [stringModels, setStringModels] = useState([
    {
      id: 's-1',
      name: '核心结算字符串分隔模型',
      delimiter: '| (竖线分隔)',
      startMarker: 'HEAD:',
      endMarker: '##END',
      charset: 'UTF-8',
      createdAt: '2025-06-18 10:20:15',
      enabled: true,
    },
    {
      id: 's-2',
      name: '银企直连KV键值模型',
      delimiter: '; (分号分隔)',
      startMarker: 'REQ_JSON{',
      endMarker: '}END',
      charset: 'GBK',
      createdAt: '2025-07-24 14:45:00',
      enabled: true,
    },
    {
      id: 's-3',
      name: '二代支付报文头字符串模型',
      delimiter: '\\r\\n (回车换行)',
      startMarker: '<?xml',
      endMarker: '</Msg>',
      charset: 'UTF-8',
      createdAt: '2025-09-02 09:12:30',
      enabled: false,
    },
  ]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
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
          {/* Action Row */}
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
                共 <strong className="text-gray-900 dark:text-white font-mono">{stringModels.length}</strong> 个协议模型
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
                className="h-8 w-8 rounded border border-gray-300 dark:border-gray-700 text-gray-500 flex items-center justify-center bg-white dark:bg-[#1b2533]"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div
            className={`rounded border shadow-2xs overflow-hidden ${
              isDarkMode ? 'bg-[#1b2533] border-gray-800' : 'bg-white border-gray-200'
            }`}
          >
            <div
              className={`h-10 px-4 flex items-center justify-between border-b ${
                isDarkMode ? 'bg-[#1f2c3d] border-gray-800 text-gray-200' : 'bg-[#fafbfc] border-gray-200 text-gray-800'
              }`}
            >
              <h3 className="font-semibold text-xs">TCP字符串模型列表</h3>
              <span className="text-xs text-gray-400 font-mono">共 {stringModels.length} 条模型记录</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead
                  className={`border-b text-gray-600 dark:text-gray-300 ${
                    isDarkMode ? 'bg-[#223042] border-gray-700' : 'bg-[#fafbfc] border-gray-200'
                  }`}
                >
                  <tr>
                    <th className="px-4 py-2.5 font-medium">名称</th>
                    <th className="px-4 py-2.5 font-medium">分隔符规则</th>
                    <th className="px-4 py-2.5 font-medium">起始标记</th>
                    <th className="px-4 py-2.5 font-medium">结束标记</th>
                    <th className="px-4 py-2.5 font-medium">字符编码</th>
                    <th className="px-4 py-2.5 font-medium">创建时间</th>
                    <th className="px-4 py-2.5 font-medium text-center">状态</th>
                    <th className="px-4 py-2.5 font-medium text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {stringModels.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f5f8ff] dark:hover:bg-[#223042] transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                      <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-300">{item.delimiter}</td>
                      <td className="px-4 py-3 font-mono text-gray-500">{item.startMarker}</td>
                      <td className="px-4 py-3 font-mono text-gray-500">{item.endMarker}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.charset}</td>
                      <td className="px-4 py-3 font-mono text-gray-500">{item.createdAt}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded ${item.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                          {item.enabled ? '启用中' : '已停用'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setActiveTab('config')}
                            className="text-[#1677ff] hover:underline"
                          >
                            编辑
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            type="button"
                            onClick={() => setStringModels(stringModels.filter((m) => m.id !== item.id))}
                            className="text-red-500 hover:underline"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`p-6 rounded-lg border ${
            isDarkMode ? 'bg-[#1b2533] border-gray-800' : 'bg-white border-gray-200'
          }`}
        >
          <h4 className="text-sm font-semibold mb-3">TCP字符串模型配置</h4>
          <p className="text-xs text-gray-500 mb-4">
            配置TCP流中基于特定字符串分隔符（如竖线、分号、换行符）解析报文字段规则。
          </p>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs text-gray-600 block mb-1">模型名称 *</label>
              <input
                type="text"
                placeholder="请输入字符串模型名称"
                className="w-full h-8 px-3 text-xs rounded border border-gray-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">字段分隔符 *</label>
                <input
                  type="text"
                  placeholder="如: | 或 ,"
                  defaultValue="|"
                  className="w-full h-8 px-3 text-xs rounded border border-gray-300 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">报文编码</label>
                <select className="w-full h-8 px-3 text-xs rounded border border-gray-300 bg-white">
                  <option value="UTF-8">UTF-8</option>
                  <option value="GBK">GBK</option>
                  <option value="ASCII">ASCII</option>
                </select>
              </div>
            </div>
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className="h-8 px-4 bg-[#1677ff] text-white rounded text-xs font-medium"
              >
                保存模型
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className="h-8 px-4 border border-gray-300 text-gray-600 rounded text-xs"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
