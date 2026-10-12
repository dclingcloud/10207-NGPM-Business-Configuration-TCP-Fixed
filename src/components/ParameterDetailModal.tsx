import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  AlertCircle, 
  ArrowRightLeft, 
  FileCode,
  Tag,
  Hash
} from 'lucide-react';
import { TcpFixedLengthModel } from '../types.ts';

interface ParameterDetailModalProps {
  model: TcpFixedLengthModel | null;
  onClose: () => void;
  onEdit: (model: TcpFixedLengthModel) => void;
  isDarkMode?: boolean;
  highlightSection?: 'request' | 'response' | 'errCode' | 'messagePair' | 'all';
}

export const ParameterDetailModal: React.FC<ParameterDetailModalProps> = ({
  model,
  onClose,
  onEdit,
  isDarkMode = false,
  highlightSection = 'all',
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'messagePairs' | 'errCodes'>(
    highlightSection === 'errCode' ? 'errCodes' : highlightSection === 'messagePair' ? 'messagePairs' : 'summary'
  );

  React.useEffect(() => {
    if (highlightSection === 'errCode') {
      setActiveTab('errCodes');
    } else if (highlightSection === 'messagePair') {
      setActiveTab('messagePairs');
    } else {
      setActiveTab('summary');
    }
  }, [highlightSection]);

  if (!model) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-4xl max-h-[88vh] rounded-lg shadow-2xl flex flex-col overflow-hidden border transition-colors ${
          isDarkMode
            ? 'bg-[#1b2533] border-gray-700 text-gray-200'
            : 'bg-white border-gray-200 text-gray-800'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            isDarkMode ? 'border-gray-800 bg-[#16202c]' : 'border-gray-100 bg-[#f8fafc]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1677ff]/10 text-[#1677ff] flex items-center justify-center font-bold">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  {model.name}
                </h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    model.enabled
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {model.enabled ? '已启用' : '已停用'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                TCP定长模型详细参数解析 · 创建时间: {model.createdAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(model);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded bg-[#1677ff] hover:bg-[#4096ff] text-white flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              进入配置编辑
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex items-center px-6 border-b text-xs font-medium ${
            isDarkMode ? 'border-gray-800 bg-[#192230]' : 'border-gray-200 bg-white'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'summary'
                ? 'border-[#1677ff] text-[#1677ff] font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            报文头与基础参数
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('messagePairs')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'messagePairs'
                ? 'border-[#1677ff] text-[#1677ff] font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>MessagePair 参数对</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full font-mono">
              {model.messagePairs.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('errCodes')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'errCodes'
                ? 'border-[#1677ff] text-[#1677ff] font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>响应错误码映射 (errCode)</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-700 rounded-full font-mono">
              {model.errCodes.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Parameter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Request Parameters Card */}
                <div
                  className={`rounded-lg p-4 border transition-colors ${
                    highlightSection === 'request'
                      ? 'border-[#1677ff] ring-1 ring-[#1677ff]'
                      : isDarkMode
                      ? 'bg-[#202c3d] border-gray-700'
                      : 'bg-[#f8fafc] border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                      <ArrowRightLeft className="w-4 h-4" />
                      请求参数 (Request Parameters)
                    </span>
                    <span className="text-[11px] text-gray-400">定长报文头</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-[#1a2432] p-2.5 rounded border border-gray-200 dark:border-gray-700">
                      <div className="text-gray-400 text-[11px] mb-1">偏移 (Offset)</div>
                      <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {model.requestOffset} 字节
                      </div>
                    </div>
                    <div className="bg-white dark:bg-[#1a2432] p-2.5 rounded border border-gray-200 dark:border-gray-700">
                      <div className="text-gray-400 text-[11px] mb-1">长度 (Length)</div>
                      <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {model.requestLength} 字节
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Parameters Card */}
                <div
                  className={`rounded-lg p-4 border transition-colors ${
                    highlightSection === 'response'
                      ? 'border-[#1677ff] ring-1 ring-[#1677ff]'
                      : isDarkMode
                      ? 'bg-[#202c3d] border-gray-700'
                      : 'bg-[#f8fafc] border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <ArrowRightLeft className="w-4 h-4" />
                      响应参数 (Response Parameters)
                    </span>
                    <span className="text-[11px] text-gray-400">定长报文头</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-[#1a2432] p-2.5 rounded border border-gray-200 dark:border-gray-700">
                      <div className="text-gray-400 text-[11px] mb-1">偏移 (Offset)</div>
                      <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {model.responseOffset} 字节
                      </div>
                    </div>
                    <div className="bg-white dark:bg-[#1a2432] p-2.5 rounded border border-gray-200 dark:border-gray-700">
                      <div className="text-gray-400 text-[11px] mb-1">长度 (Length)</div>
                      <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {model.responseLength} 字节
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offset & Association Settings */}
              <div
                className={`rounded-lg p-4 border ${
                  isDarkMode ? 'bg-[#202c3d] border-gray-700' : 'bg-[#f8fafc] border-gray-200'
                }`}
              >
                <div className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-200">
                  关联规则与错误码偏移配置
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between bg-white dark:bg-[#1a2432] p-3 rounded border border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-200">错误代码偏移长度</div>
                      <div className="text-gray-400 text-[11px]">全局错误码判定字节跨度</div>
                    </div>
                    <span className="font-mono font-bold text-sm bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-2.5 py-1 rounded">
                      {model.errorCodeOffsetLength} 字节
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-[#1a2432] p-3 rounded border border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="font-medium text-gray-700 dark:text-gray-200">关联字段配置</div>
                      <div className="text-gray-400 text-[11px]">是否启用双向报文流水号/关联匹配</div>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded font-medium ${
                        model.useRelField
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {model.useRelField ? '已启用关联字段' : '未启用关联字段'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messagePairs' && (
            <div className="space-y-4">
              {model.messagePairs.map((pair, index) => (
                <div
                  key={pair.id}
                  className={`border rounded-lg p-4 space-y-4 ${
                    isDarkMode ? 'bg-[#202c3d] border-gray-700' : 'bg-[#f8fafc] border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-2.5 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1677ff] text-white flex items-center justify-center text-[10px] font-bold">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                        {pair.requestName} ⇄ {pair.responseName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 font-mono">
                        请求: {pair.requestContent} | 应答: {pair.responseContent}
                      </span>
                    </div>
                  </div>

                  {/* Offset details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="bg-white dark:bg-[#1a2432] p-2 rounded border border-gray-200 dark:border-gray-700">
                      <span className="text-gray-400">请求关联偏移: </span>
                      <span className="font-mono font-semibold">{pair.requestRelOffset}</span>
                    </div>
                    <div className="bg-white dark:bg-[#1a2432] p-2 rounded border border-gray-200 dark:border-gray-700">
                      <span className="text-gray-400">关联字段长度: </span>
                      <span className="font-mono font-semibold">{pair.relLength}</span>
                    </div>
                    <div className="bg-white dark:bg-[#1a2432] p-2 rounded border border-gray-200 dark:border-gray-700">
                      <span className="text-gray-400">响应关联偏移: </span>
                      <span className="font-mono font-semibold">{pair.responseRelOffset}</span>
                    </div>
                    <div className="bg-white dark:bg-[#1a2432] p-2 rounded border border-gray-200 dark:border-gray-700">
                      <span className="text-gray-400">错误代码偏移: </span>
                      <span className="font-mono font-semibold">{pair.errorCodeOffset}</span>
                    </div>
                  </div>

                  {/* Request Business Fields */}
                  <div>
                    <div className="font-medium text-xs text-blue-600 dark:text-blue-400 mb-2">
                      请求业务字段定义 ({pair.requestFields.length} 项)
                    </div>
                    <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
                      <table className="w-full text-left text-xs bg-white dark:bg-[#1a2432]">
                        <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 border-b border-gray-200 dark:border-gray-700">
                          <tr>
                            <th className="py-1.5 px-3">字段名称</th>
                            <th className="py-1.5 px-3">偏移</th>
                            <th className="py-1.5 px-3">长度</th>
                            <th className="py-1.5 px-3">数据类型</th>
                            <th className="py-1.5 px-3">业务标识</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {pair.requestFields.map((f) => (
                            <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <td className="py-1.5 px-3 font-medium text-gray-800 dark:text-gray-200">{f.name}</td>
                              <td className="py-1.5 px-3 font-mono">{f.offset}</td>
                              <td className="py-1.5 px-3 font-mono">{f.length}</td>
                              <td className="py-1.5 px-3">
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 text-[10px]">
                                  {f.dataType}
                                </span>
                              </td>
                              <td className="py-1.5 px-3 text-gray-500">{f.numberType}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Response Business Fields */}
                  <div>
                    <div className="font-medium text-xs text-emerald-600 dark:text-emerald-400 mb-2">
                      响应业务字段定义 ({pair.responseFields.length} 项)
                    </div>
                    <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
                      <table className="w-full text-left text-xs bg-white dark:bg-[#1a2432]">
                        <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 border-b border-gray-200 dark:border-gray-700">
                          <tr>
                            <th className="py-1.5 px-3">字段名称</th>
                            <th className="py-1.5 px-3">偏移</th>
                            <th className="py-1.5 px-3">长度</th>
                            <th className="py-1.5 px-3">数据类型</th>
                            <th className="py-1.5 px-3">业务标识</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {pair.responseFields.map((f) => (
                            <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                              <td className="py-1.5 px-3 font-medium text-gray-800 dark:text-gray-200">{f.name}</td>
                              <td className="py-1.5 px-3 font-mono">{f.offset}</td>
                              <td className="py-1.5 px-3 font-mono">{f.length}</td>
                              <td className="py-1.5 px-3">
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px]">
                                  {f.dataType}
                                </span>
                              </td>
                              <td className="py-1.5 px-3 text-gray-500">{f.numberType}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'errCodes' && (
            <div className="space-y-4">
              <div className="text-gray-500 text-xs">
                配置当响应报文发生异常时的错误码映射关系，系统将按照此代码解析错误状态。
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left text-xs bg-white dark:bg-[#1a2432]">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">序号</th>
                      <th className="py-2.5 px-4 font-semibold">响应错误代码名称</th>
                      <th className="py-2.5 px-4 font-semibold">响应错误代码 (Value)</th>
                      <th className="py-2.5 px-4 font-semibold text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {model.errCodes.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-2 px-4 text-gray-400 font-mono">{idx + 1}</td>
                        <td className="py-2 px-4 font-medium text-gray-800 dark:text-gray-200">
                          {item.name}
                        </td>
                        <td className="py-2 px-4">
                          <code className="bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5 rounded font-mono font-semibold">
                            {item.code}
                          </code>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopy(item.code, item.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 inline-flex items-center gap-1"
                          >
                            {copiedText === item.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500">已复制</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                复制错误码
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-3 flex items-center justify-between border-t ${
            isDarkMode ? 'border-gray-800 bg-[#16202c]' : 'border-gray-100 bg-[#f8fafc]'
          }`}
        >
          <span className="text-xs text-gray-400">
            模型 ID: #{model.id} · 共 {model.messagePairs.length} 组参数对 · {model.errCodes.length} 个错误码
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
          >
            关闭预览
          </button>
        </div>
      </div>
    </div>
  );
};
