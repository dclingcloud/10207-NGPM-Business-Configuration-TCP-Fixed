import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Check
} from 'lucide-react';
import { 
  TcpFixedLengthModel, 
  MessagePair, 
  BusinessField, 
  ErrCodeItem,
  FieldDataType,
  FieldNumberType 
} from '../types.ts';

interface InlineModelEditorProps {
  model: TcpFixedLengthModel;
  onSave: (updated: TcpFixedLengthModel) => void;
  onCancel: () => void;
}

export const InlineModelEditor: React.FC<InlineModelEditorProps> = ({
  model,
  onSave,
  onCancel,
}) => {
  // Local state initialized with model's values
  const [modelName, setModelName] = useState(model.name);
  const [requestOffset, setRequestOffset] = useState(model.requestOffset);
  const [requestLength, setRequestLength] = useState(model.requestLength);
  const [responseOffset, setResponseOffset] = useState(model.responseOffset);
  const [responseLength, setResponseLength] = useState(model.responseLength);
  const [errorCodeOffsetLength, setErrorCodeOffsetLength] = useState(model.errorCodeOffsetLength);
  const [useRelField, setUseRelField] = useState(model.useRelField);

  const [errCodes, setErrCodes] = useState<ErrCodeItem[]>(
    model.errCodes.length > 0
      ? model.errCodes
      : [{ id: 'ec-1', name: '', code: '' }]
  );

  const [messagePairs, setMessagePairs] = useState<MessagePair[]>(
    model.messagePairs.length > 0
      ? model.messagePairs
      : [
          {
            id: 'mp-1',
            requestName: '',
            responseName: '',
            requestRelOffset: '',
            relLength: '',
            requestContent: '',
            responseContent: '',
            responseRelOffset: '',
            errorCodeOffset: '',
            collapsed: false,
            requestFields: [],
            responseFields: [],
          },
        ]
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Options from user's Image 1 (字段数据类型)
  const dataTypeOptions: FieldDataType[] = [
    '二进制',
    '小端整型',
    '大端整型',
    '字符串',
  ];

  // Options from user's Image 2 & 3 (普通号 / 业务标识类型)
  const numberTypeOptions: FieldNumberType[] = [
    '普通号',
    '功能号',
    '追踪号',
    '渠道号',
    '子渠道号',
    '子功能号',
    '统计号1',
    '统计号2',
    '统计号3',
    '返回码',
  ];

  // Error Code management
  const handleAddErrCode = () => {
    setErrCodes([
      ...errCodes,
      { id: `ec-${Date.now()}-${Math.random()}`, name: '', code: '' },
    ]);
  };

  const handleRemoveErrCode = (id: string) => {
    setErrCodes(errCodes.filter((item) => item.id !== id));
  };

  const handleUpdateErrCode = (id: string, field: 'name' | 'code', val: string) => {
    setErrCodes(
      errCodes.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  // Message Pair management
  const handleAddMessagePair = () => {
    setMessagePairs([
      ...messagePairs,
      {
        id: `mp-${Date.now()}`,
        requestName: '',
        responseName: '',
        requestRelOffset: '',
        relLength: '',
        requestContent: '',
        responseContent: '',
        responseRelOffset: '',
        errorCodeOffset: '',
        collapsed: false,
        requestFields: [
          {
            id: `rf-${Date.now()}`,
            name: '',
            offset: '',
            length: '',
            dataType: '二进制',
            numberType: '普通号',
          },
        ],
        responseFields: [
          {
            id: `sf-${Date.now()}`,
            name: '',
            offset: '',
            length: '',
            dataType: '二进制',
            numberType: '普通号',
          },
        ],
      },
    ]);
  };

  const handleRemoveMessagePair = (id: string) => {
    if (messagePairs.length <= 1) {
      handleClearMessagePair(id);
      return;
    }
    setMessagePairs(messagePairs.filter((p) => p.id !== id));
  };

  const handleClearMessagePair = (id: string) => {
    setMessagePairs(
      messagePairs.map((p) =>
        p.id === id
          ? {
              ...p,
              requestName: '',
              responseName: '',
              requestRelOffset: '',
              relLength: '',
              requestContent: '',
              responseContent: '',
              responseRelOffset: '',
              errorCodeOffset: '',
              requestFields: [],
              responseFields: [],
            }
          : p
      )
    );
  };

  const handleUpdateMessagePair = (
    id: string,
    field: keyof MessagePair,
    val: any
  ) => {
    setMessagePairs(
      messagePairs.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  // Business Field management
  const handleAddBusinessField = (
    pairId: string,
    type: 'requestFields' | 'responseFields'
  ) => {
    setMessagePairs(
      messagePairs.map((p) => {
        if (p.id !== pairId) return p;
        const newField: BusinessField = {
          id: `bf-${Date.now()}-${Math.random()}`,
          name: '',
          offset: '',
          length: '',
          dataType: '二进制',
          numberType: '普通号',
        };
        return {
          ...p,
          [type]: [...p[type], newField],
        };
      })
    );
  };

  const handleRemoveBusinessField = (
    pairId: string,
    type: 'requestFields' | 'responseFields',
    fieldId: string
  ) => {
    setMessagePairs(
      messagePairs.map((p) => {
        if (p.id !== pairId) return p;
        return {
          ...p,
          [type]: p[type].filter((f) => f.id !== fieldId),
        };
      })
    );
  };

  const handleUpdateBusinessField = (
    pairId: string,
    type: 'requestFields' | 'responseFields',
    fieldId: string,
    key: keyof BusinessField,
    val: any
  ) => {
    setMessagePairs(
      messagePairs.map((p) => {
        if (p.id !== pairId) return p;
        return {
          ...p,
          [type]: p[type].map((f) => (f.id === fieldId ? { ...f, [key]: val } : f)),
        };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!modelName.trim()) {
      newErrors.modelName = '请输入模型名称';
    }
    if (!requestOffset.trim()) {
      newErrors.requestOffset = '请输入请求偏移';
    }
    if (!requestLength.trim()) {
      newErrors.requestLength = '请输入请求长度';
    }
    if (!responseOffset.trim()) {
      newErrors.responseOffset = '请输入响应偏移';
    }
    if (!responseLength.trim()) {
      newErrors.responseLength = '请输入响应长度';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...model,
      name: modelName,
      requestOffset,
      requestLength,
      responseOffset,
      responseLength,
      errorCodeOffsetLength: errorCodeOffsetLength || '0',
      useRelField,
      errCodes: errCodes.filter((c) => c.name.trim() || c.code.trim()),
      messagePairs,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-[#f8fafc] border-t border-b border-gray-200 space-y-5 text-xs text-gray-800"
    >
      {/* Row 1: 模型名称 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
        <div className="w-24 font-medium text-gray-700 shrink-0">模型名称</div>
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <input
            type="text"
            placeholder="请输入模型名称"
            value={modelName}
            onChange={(e) => {
              setModelName(e.target.value);
              if (errors.modelName) setErrors({ ...errors, modelName: '' });
            }}
            className={`w-full h-8 px-3 text-xs rounded border bg-white text-gray-800 placeholder-gray-400 focus:border-[#1677ff] focus:outline-none transition-colors ${
              errors.modelName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.modelName && (
            <span className="text-[11px] text-red-500 whitespace-nowrap">
              {errors.modelName}
            </span>
          )}
        </div>
      </div>

      {/* Row 2: 请求参数 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
        <div className="w-24 font-medium text-gray-700 shrink-0">请求参数</div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              <span className="text-red-500 mr-0.5">*</span>偏移
            </span>
            <input
              type="text"
              value={requestOffset}
              onChange={(e) => {
                setRequestOffset(e.target.value);
                if (errors.requestOffset) setErrors({ ...errors, requestOffset: '' });
              }}
              className="w-28 h-8 px-2.5 text-xs rounded border border-gray-300 bg-white font-mono text-gray-800 focus:border-[#1677ff] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              <span className="text-red-500 mr-0.5">*</span>长度
            </span>
            <input
              type="text"
              value={requestLength}
              onChange={(e) => {
                setRequestLength(e.target.value);
                if (errors.requestLength) setErrors({ ...errors, requestLength: '' });
              }}
              className="w-28 h-8 px-2.5 text-xs rounded border border-gray-300 bg-white font-mono text-gray-800 focus:border-[#1677ff] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Row 3: 响应参数 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
        <div className="w-24 font-medium text-gray-700 shrink-0">响应参数</div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              <span className="text-red-500 mr-0.5">*</span>偏移
            </span>
            <input
              type="text"
              value={responseOffset}
              onChange={(e) => {
                setResponseOffset(e.target.value);
                if (errors.responseOffset) setErrors({ ...errors, responseOffset: '' });
              }}
              className="w-28 h-8 px-2.5 text-xs rounded border border-gray-300 bg-white font-mono text-gray-800 focus:border-[#1677ff] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              <span className="text-red-500 mr-0.5">*</span>长度
            </span>
            <input
              type="text"
              value={responseLength}
              onChange={(e) => {
                setResponseLength(e.target.value);
                if (errors.responseLength) setErrors({ ...errors, responseLength: '' });
              }}
              className="w-28 h-8 px-2.5 text-xs rounded border border-gray-300 bg-white font-mono text-gray-800 focus:border-[#1677ff] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Row 4: 错误代码偏移 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
        <div className="w-24 font-medium text-gray-700 shrink-0">错误代码偏移</div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">长度</span>
          <input
            type="text"
            value={errorCodeOffsetLength}
            onChange={(e) => setErrorCodeOffsetLength(e.target.value)}
            className="w-28 h-8 px-2.5 text-xs rounded border border-gray-300 bg-white font-mono text-gray-800 focus:border-[#1677ff] focus:outline-none"
          />
        </div>
      </div>

      {/* Row 5: 关联 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
        <div className="w-24 font-medium text-gray-700 shrink-0">关联</div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={useRelField}
            onChange={(e) => setUseRelField(e.target.checked)}
            className="w-4 h-4 rounded text-[#1677ff] focus:ring-0 cursor-pointer"
          />
          <span className="text-gray-700">是否使用关联字段</span>
        </label>
      </div>

      {/* Row 6: errCode */}
      <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-6 pt-3 border-t border-gray-200/80">
        <div className="w-24 font-medium text-gray-700 shrink-0 pt-1.5">errCode</div>
        <div className="flex-1 space-y-2.5">
          {errCodes.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">响应错误代码名称</span>
                <input
                  type="text"
                  placeholder="如: 系统响应超时"
                  value={item.name}
                  onChange={(e) =>
                    handleUpdateErrCode(item.id, 'name', e.target.value)
                  }
                  className="w-44 h-8 px-2.5 text-xs rounded border border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500">响应错误代码</span>
                <input
                  type="text"
                  placeholder="如: E9999"
                  value={item.code}
                  onChange={(e) =>
                    handleUpdateErrCode(item.id, 'code', e.target.value)
                  }
                  className="w-44 h-8 px-2.5 text-xs rounded border border-gray-300 bg-white font-mono text-gray-800 focus:border-[#1677ff] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveErrCode(item.id)}
                className="h-8 px-2.5 text-xs rounded border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 flex items-center gap-1 transition-colors bg-white cursor-pointer"
                title="删除"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除</span>
              </button>
            </div>
          ))}

          <div>
            <button
              type="button"
              onClick={handleAddErrCode}
              className="h-7 px-3 text-xs rounded border border-gray-300 text-gray-700 hover:border-[#1677ff] hover:text-[#1677ff] flex items-center gap-1 transition-colors bg-white cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 7: messagePair (Image 2 style grouped sub-panel) */}
      <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-6 pt-3 border-t border-gray-200/80">
        <div className="w-24 font-medium text-gray-700 shrink-0 pt-1.5">messagePair</div>
        <div className="flex-1 space-y-4">
          {messagePairs.map((pair, pIdx) => (
            <div
              key={pair.id}
              className="bg-white rounded-md border border-gray-200 shadow-2xs overflow-hidden"
            >
              {/* Header: ∨ 参数  [清空] */}
              <div className="h-9 px-4 flex items-center justify-between border-b border-gray-200 bg-[#f4f6f8] text-gray-700">
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateMessagePair(pair.id, 'collapsed', !pair.collapsed)
                  }
                  className="flex items-center gap-1.5 font-medium text-xs hover:text-[#1677ff] cursor-pointer"
                >
                  {pair.collapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  )}
                  <span>参数 {messagePairs.length > 1 ? `#${pIdx + 1}` : ''}</span>
                  {pair.requestName && (
                    <span className="text-gray-400 font-normal">
                      ({pair.requestName})
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleClearMessagePair(pair.id)}
                    className="px-2 py-0.5 text-xs text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded cursor-pointer"
                  >
                    清空
                  </button>
                  {messagePairs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMessagePair(pair.id)}
                      className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                      title="删除此组"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {!pair.collapsed && (
                <div className="p-4 space-y-4">
                  {/* Row 1 of pair */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <div className="text-gray-600 mb-1">
                        <span className="text-red-500 mr-0.5">*</span>请求名称
                      </div>
                      <input
                        type="text"
                        placeholder="请输入请求名称"
                        value={pair.requestName}
                        onChange={(e) =>
                          handleUpdateMessagePair(pair.id, 'requestName', e.target.value)
                        }
                        className="w-full h-8 px-2.5 text-xs rounded border border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="text-gray-600 mb-1">
                        <span className="text-red-500 mr-0.5">*</span>响应名称
                      </div>
                      <input
                        type="text"
                        placeholder="请输入响应名称"
                        value={pair.responseName}
                        onChange={(e) =>
                          handleUpdateMessagePair(pair.id, 'responseName', e.target.value)
                        }
                        className="w-full h-8 px-2.5 text-xs rounded border border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="text-gray-600 mb-1">请求关联字段偏移</div>
                      <input
                        type="text"
                        placeholder="16"
                        value={pair.requestRelOffset}
                        onChange={(e) =>
                          handleUpdateMessagePair(
                            pair.id,
                            'requestRelOffset',
                            e.target.value
                          )
                        }
                        className="w-full h-8 px-2.5 text-xs rounded border font-mono border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="text-gray-600 mb-1">关联字段长度</div>
                      <input
                        type="text"
                        placeholder="32"
                        value={pair.relLength}
                        onChange={(e) =>
                          handleUpdateMessagePair(pair.id, 'relLength', e.target.value)
                        }
                        className="w-full h-8 px-2.5 text-xs rounded border font-mono border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 2 of pair */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <div className="text-gray-600 mb-1">
                        <span className="text-red-500 mr-0.5">*</span>请求内容
                      </div>
                      <input
                        type="text"
                        placeholder="请输入请求内容"
                        value={pair.requestContent}
                        onChange={(e) =>
                          handleUpdateMessagePair(
                            pair.id,
                            'requestContent',
                            e.target.value
                          )
                        }
                        className="w-full h-8 px-2.5 text-xs rounded border border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="text-gray-600 mb-1">
                        <span className="text-red-500 mr-0.5">*</span>响应内容
                      </div>
                      <input
                        type="text"
                        placeholder="请输入响应内容"
                        value={pair.responseContent}
                        onChange={(e) =>
                          handleUpdateMessagePair(
                            pair.id,
                            'responseContent',
                            e.target.value
                          )
                        }
                        className="w-full h-8 px-2.5 text-xs rounded border border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="text-gray-600 mb-1">响应关联字段偏移</div>
                      <input
                        type="text"
                        placeholder="16"
                        value={pair.responseRelOffset}
                        onChange={(e) =>
                          handleUpdateMessagePair(
                            pair.id,
                            'responseRelOffset',
                            e.target.value
                          )
                        }
                        className="w-full h-8 px-2.5 text-xs rounded border font-mono border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="text-gray-600 mb-1">错误代码偏移</div>
                      <input
                        type="text"
                        placeholder="48"
                        value={pair.errorCodeOffset}
                        onChange={(e) =>
                          handleUpdateMessagePair(
                            pair.id,
                            'errorCodeOffset',
                            e.target.value
                          )
                        }
                        className="w-full h-8 px-2.5 text-xs rounded border font-mono border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Sub-block 1: 请求业务字段 */}
                  <div className="p-3 bg-[#f8fafc] rounded border border-gray-200">
                    <div className="flex items-center gap-1.5 font-medium text-xs text-blue-600 mb-3">
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>请求业务字段</span>
                    </div>

                    <div className="space-y-2">
                      {pair.requestFields.map((field) => (
                        <div
                          key={field.id}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <span className="text-gray-500">名称</span>
                          <input
                            type="text"
                            placeholder="业务字段名"
                            value={field.name}
                            onChange={(e) =>
                              handleUpdateBusinessField(
                                pair.id,
                                'requestFields',
                                field.id,
                                'name',
                                e.target.value
                              )
                            }
                            className="w-32 h-7 px-2 text-xs rounded border border-gray-300 bg-white text-gray-800"
                          />

                          <span className="text-gray-500">偏移</span>
                          <input
                            type="text"
                            placeholder="0"
                            value={field.offset}
                            onChange={(e) =>
                              handleUpdateBusinessField(
                                pair.id,
                                'requestFields',
                                field.id,
                                'offset',
                                e.target.value
                              )
                            }
                            className="w-20 h-7 px-2 text-xs rounded border font-mono border-gray-300 bg-white text-gray-800"
                          />

                          <span className="text-gray-500">长度</span>
                          <input
                            type="text"
                            placeholder="16"
                            value={field.length}
                            onChange={(e) =>
                              handleUpdateBusinessField(
                                pair.id,
                                'requestFields',
                                field.id,
                                'length',
                                e.target.value
                              )
                            }
                            className="w-20 h-7 px-2 text-xs rounded border font-mono border-gray-300 bg-white text-gray-800"
                          />

                          {/* 图1下拉：二进制、小端整型、大端整型、字符串 */}
                          <span className="text-gray-500">字段数据类型</span>
                          <select
                            value={field.dataType}
                            onChange={(e) =>
                              handleUpdateBusinessField(
                                pair.id,
                                'requestFields',
                                field.id,
                                'dataType',
                                e.target.value as FieldDataType
                              )
                            }
                            className="h-7 px-2 text-xs rounded border border-gray-300 bg-white text-gray-800 cursor-pointer"
                          >
                            {dataTypeOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>

                          {/* 图2、3下拉：普通号、功能号、追踪号、渠道号、子渠道号、子功能号、统计号1、统计号2、统计号3、返回码 */}
                          <select
                            value={field.numberType}
                            onChange={(e) =>
                              handleUpdateBusinessField(
                                pair.id,
                                'requestFields',
                                field.id,
                                'numberType',
                                e.target.value as FieldNumberType
                              )
                            }
                            className="h-7 px-2 text-xs rounded border border-gray-300 bg-white text-gray-800 cursor-pointer"
                          >
                            {numberTypeOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveBusinessField(
                                pair.id,
                                'requestFields',
                                field.id
                              )
                            }
                            className="h-7 px-2 text-xs rounded border border-gray-200 text-gray-500 hover:text-red-500 flex items-center gap-1 bg-white cursor-pointer"
                            title="删除"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>删除</span>
                          </button>
                        </div>
                      ))}

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleAddBusinessField(pair.id, 'requestFields')
                          }
                          className="h-7 px-2.5 text-xs rounded border border-gray-300 text-gray-700 hover:border-[#1677ff] hover:text-[#1677ff] flex items-center gap-1 transition-colors bg-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>添加</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sub-block 2: 响应业务字段 */}
                  <div className="p-3 bg-[#f8fafc] rounded border border-gray-200">
                    <div className="flex items-center gap-1.5 font-medium text-xs text-emerald-600 mb-3">
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>响应业务字段</span>
                    </div>

                    <div className="space-y-2">
                      {pair.responseFields.map((field) => (
                        <div
                          key={field.id}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <span className="text-gray-500">名称</span>
                          <input
                            type="text"
                            placeholder="业务字段名"
                            value={field.name}
                            onChange={(e) =>
                              handleUpdateBusinessField(
                                pair.id,
                                'responseFields',
                                field.id,
                                'name',
                                e.target.value
                              )
                            }
                            className="w-32 h-7 px-2 text-xs rounded border border-gray-300 bg-white text-gray-800"
                          />

                          <span className="text-gray-500">偏移</span>
                          <input
                            type="text"
                            placeholder="0"
                            value={field.offset}
                            onChange={(e) =>
                              handleUpdateBusinessField(
                                pair.id,
                                'responseFields',
                                field.id,
                                'offset',
                                e.target.value
                              )
                            }
                            className="w-20 h-7 px-2 text-xs rounded border font-mono border-gray-300 bg-white text-gray-800"
                          />

                          <span className="text-gray-500">长度</span>
                          <input
                            type="text"
                            placeholder="16"
                            value={field.length}
                            onChange={(e) =>
                              handleUpdateBusinessField(
                                pair.id,
                                'responseFields',
                                field.id,
                                'length',
                                e.target.value
                              )
                            }
                            className="w-20 h-7 px-2 text-xs rounded border font-mono border-gray-300 bg-white text-gray-800"
                          />

                          {/* 图1下拉：二进制、小端整型、大端整型、字符串 */}
                          <span className="text-gray-500">字段数据类型</span>
                          <select
                            value={field.dataType}
                            onChange={(e) =>
                              handleUpdateBusinessField(
                                pair.id,
                                'responseFields',
                                field.id,
                                'dataType',
                                e.target.value as FieldDataType
                              )
                            }
                            className="h-7 px-2 text-xs rounded border border-gray-300 bg-white text-gray-800 cursor-pointer"
                          >
                            {dataTypeOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>

                          {/* 图2、3下拉：普通号、功能号、追踪号、渠道号、子渠道号、子功能号、统计号1、统计号2、统计号3、返回码 */}
                          <select
                            value={field.numberType}
                            onChange={(e) =>
                              handleUpdateBusinessField(
                                pair.id,
                                'responseFields',
                                field.id,
                                'numberType',
                                e.target.value as FieldNumberType
                              )
                            }
                            className="h-7 px-2 text-xs rounded border border-gray-300 bg-white text-gray-800 cursor-pointer"
                          >
                            {numberTypeOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveBusinessField(
                                pair.id,
                                'responseFields',
                                field.id
                              )
                            }
                            className="h-7 px-2 text-xs rounded border border-gray-200 text-gray-500 hover:text-red-500 flex items-center gap-1 bg-white cursor-pointer"
                            title="删除"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>删除</span>
                          </button>
                        </div>
                      ))}

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleAddBusinessField(pair.id, 'responseFields')
                          }
                          className="h-7 px-2.5 text-xs rounded border border-gray-300 text-gray-700 hover:border-[#1677ff] hover:text-[#1677ff] flex items-center gap-1 transition-colors bg-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>添加</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div>
            <button
              type="button"
              onClick={handleAddMessagePair}
              className="h-7 px-3 text-xs rounded border border-gray-300 text-gray-700 hover:border-[#1677ff] hover:text-[#1677ff] flex items-center gap-1 transition-colors bg-white cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar: 保存修改 (Image 2 style) */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="h-8 px-4 rounded text-xs border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        >
          取消收起
        </button>

        <button
          type="submit"
          className="h-8 px-5 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>保存修改</span>
        </button>
      </div>
    </form>
  );
};
