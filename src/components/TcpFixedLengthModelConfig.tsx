import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Check, 
  Sparkles
} from 'lucide-react';
import { 
  TcpFixedLengthModel, 
  MessagePair, 
  BusinessField, 
  ErrCodeItem,
  FieldDataType,
  FieldNumberType 
} from '../types.ts';

interface TcpFixedLengthModelConfigProps {
  initialModel?: TcpFixedLengthModel | null;
  onSave: (model: TcpFixedLengthModel) => void;
  onCancel: () => void;
  onSwitchToManage: () => void;
  isDarkMode?: boolean;
}

export const TcpFixedLengthModelConfig: React.FC<TcpFixedLengthModelConfigProps> = ({
  initialModel,
  onSave,
  onCancel,
  onSwitchToManage,
}) => {
  // Form States
  const [modelName, setModelName] = useState('');
  const [requestOffset, setRequestOffset] = useState('');
  const [requestLength, setRequestLength] = useState('');
  const [responseOffset, setResponseOffset] = useState('');
  const [responseLength, setResponseLength] = useState('');
  const [errorCodeOffsetLength, setErrorCodeOffsetLength] = useState('');
  const [useRelField, setUseRelField] = useState(false);

  // errCode items
  const [errCodes, setErrCodes] = useState<ErrCodeItem[]>([
    { id: 'ec-default-1', name: '', code: '' },
    { id: 'ec-default-2', name: '', code: '' },
  ]);

  // messagePair items
  const [messagePairs, setMessagePairs] = useState<MessagePair[]>([
    {
      id: 'mp-default-1',
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
          id: 'rf-init-1',
          name: '',
          offset: '',
          length: '',
          dataType: '二进制',
          numberType: '普通号',
        },
      ],
      responseFields: [
        {
          id: 'sf-init-1',
          name: '',
          offset: '',
          length: '',
          dataType: '二进制',
          numberType: '普通号',
        },
      ],
    },
  ]);

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

  useEffect(() => {
    if (initialModel) {
      setModelName(initialModel.name);
      setRequestOffset(initialModel.requestOffset);
      setRequestLength(initialModel.requestLength);
      setResponseOffset(initialModel.responseOffset);
      setResponseLength(initialModel.responseLength);
      setErrorCodeOffsetLength(initialModel.errorCodeOffsetLength);
      setUseRelField(initialModel.useRelField);
      setErrCodes(
        initialModel.errCodes.length > 0
          ? initialModel.errCodes
          : [{ id: 'ec-1', name: '', code: '' }]
      );
      setMessagePairs(
        initialModel.messagePairs.length > 0
          ? initialModel.messagePairs
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
    }
  }, [initialModel]);

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

  const handleAutoFillExample = () => {
    setModelName('快捷定长清算协议模型');
    setRequestOffset('0');
    setRequestLength('128');
    setResponseOffset('0');
    setResponseLength('128');
    setErrorCodeOffsetLength('6');
    setUseRelField(true);
    setErrCodes([
      { id: 'ec-ex-1', name: '系统响应超时', code: 'E9999' },
      { id: 'ec-ex-2', name: '渠道校验不一致', code: 'E1005' },
    ]);
    setMessagePairs([
      {
        id: 'mp-ex-1',
        requestName: '实时清算请求',
        responseName: '实时清算应答',
        requestRelOffset: '16',
        relLength: '32',
        requestContent: 'REQ_CLR_001',
        responseContent: 'RES_CLR_001',
        responseRelOffset: '16',
        errorCodeOffset: '48',
        collapsed: false,
        requestFields: [
          { id: 'rf-ex-1', name: '清算流水号', offset: '0', length: '16', dataType: '字符串', numberType: '追踪号' },
          { id: 'rf-ex-2', name: '付款人账号', offset: '16', length: '19', dataType: '字符串', numberType: '普通号' },
        ],
        responseFields: [
          { id: 'sf-ex-1', name: '核心返回状态', offset: '0', length: '6', dataType: '字符串', numberType: '返回码' },
        ],
      },
    ]);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!modelName.trim()) {
      newErrors.modelName = '请输入模型名称';
    }
    if (!requestOffset.trim()) {
      newErrors.requestOffset = '请输入请求参数偏移';
    }
    if (!requestLength.trim()) {
      newErrors.requestLength = '请输入请求参数长度';
    }
    if (!responseOffset.trim()) {
      newErrors.responseOffset = '请输入响应参数偏移';
    }
    if (!responseLength.trim()) {
      newErrors.responseLength = '请输入响应参数长度';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const savedModel: TcpFixedLengthModel = {
      id: initialModel ? initialModel.id : `${Date.now()}`,
      name: modelName,
      requestOffset,
      requestLength,
      responseOffset,
      responseLength,
      errorCodeOffsetLength: errorCodeOffsetLength || '0',
      useRelField,
      errCodes: errCodes.filter((c) => c.name.trim() || c.code.trim()),
      messagePairs,
      createdAt: initialModel ? initialModel.createdAt : new Date().toISOString().replace('T', ' ').substring(0, 19),
      enabled: initialModel ? initialModel.enabled : true,
    };

    onSave(savedModel);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-12 select-none text-gray-800">
      {/* 1. 浅色Tab切换交互 (严格对齐模型管理按钮与模型配置按钮) */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onSwitchToManage}
            className="h-8 px-4 text-xs font-medium rounded border border-gray-200 text-gray-700 bg-white hover:border-gray-300 hover:text-[#1677ff] transition-colors cursor-pointer"
          >
            模型管理
          </button>
          <button
            type="button"
            className="h-8 px-4 text-xs font-medium rounded border border-[#1677ff] text-[#1677ff] bg-white shadow-2xs cursor-default"
          >
            模型配置
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoFillExample}
            className="text-xs text-[#1677ff] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            快速填入标准定长示例
          </button>
        </div>
      </div>

      {/* 2. 纯浅色系配置容器 (彻底去除深色系，全浅白底灰边) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-2xs">
        
        {/* Field 1: 模型名称 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
          <div className="w-28 text-xs font-medium text-gray-700 shrink-0">
            模型名称
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <span className="text-xs text-gray-600 whitespace-nowrap">
              <span className="text-red-500 mr-0.5">*</span>名称
            </span>
            <div className="flex-1">
              <input
                type="text"
                placeholder="请输入模型名称"
                value={modelName}
                onChange={(e) => {
                  setModelName(e.target.value);
                  if (errors.modelName) setErrors({ ...errors, modelName: '' });
                }}
                className={`w-full h-8 px-3 text-xs rounded border transition-colors bg-white text-gray-800 placeholder-gray-400 focus:border-[#1677ff] focus:outline-none ${
                  errors.modelName
                    ? 'border-red-500 ring-1 ring-red-400'
                    : 'border-gray-300'
                }`}
              />
              {errors.modelName && (
                <div className="text-[11px] text-red-500 mt-1">{errors.modelName}</div>
              )}
            </div>
          </div>
        </div>

        {/* Field 2: 请求参数 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
          <div className="w-28 text-xs font-medium text-gray-700 shrink-0">
            请求参数
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 whitespace-nowrap">
                <span className="text-red-500 mr-0.5">*</span>偏移
              </span>
              <input
                type="text"
                placeholder="0"
                value={requestOffset}
                onChange={(e) => {
                  setRequestOffset(e.target.value);
                  if (errors.requestOffset) setErrors({ ...errors, requestOffset: '' });
                }}
                className={`w-32 h-8 px-3 text-xs rounded border font-mono bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none ${
                  errors.requestOffset ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 whitespace-nowrap">
                <span className="text-red-500 mr-0.5">*</span>长度
              </span>
              <input
                type="text"
                placeholder="128"
                value={requestLength}
                onChange={(e) => {
                  setRequestLength(e.target.value);
                  if (errors.requestLength) setErrors({ ...errors, requestLength: '' });
                }}
                className={`w-32 h-8 px-3 text-xs rounded border font-mono bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none ${
                  errors.requestLength ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Field 3: 响应参数 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
          <div className="w-28 text-xs font-medium text-gray-700 shrink-0">
            响应参数
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 whitespace-nowrap">
                <span className="text-red-500 mr-0.5">*</span>偏移
              </span>
              <input
                type="text"
                placeholder="0"
                value={responseOffset}
                onChange={(e) => {
                  setResponseOffset(e.target.value);
                  if (errors.responseOffset) setErrors({ ...errors, responseOffset: '' });
                }}
                className={`w-32 h-8 px-3 text-xs rounded border font-mono bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none ${
                  errors.responseOffset ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 whitespace-nowrap">
                <span className="text-red-500 mr-0.5">*</span>长度
              </span>
              <input
                type="text"
                placeholder="128"
                value={responseLength}
                onChange={(e) => {
                  setResponseLength(e.target.value);
                  if (errors.responseLength) setErrors({ ...errors, responseLength: '' });
                }}
                className={`w-32 h-8 px-3 text-xs rounded border font-mono bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none ${
                  errors.responseLength ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Field 4: 错误代码偏移 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
          <div className="w-28 text-xs font-medium text-gray-700 shrink-0">
            错误代码偏移
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 whitespace-nowrap">
              长度
            </span>
            <input
              type="text"
              placeholder="6"
              value={errorCodeOffsetLength}
              onChange={(e) => setErrorCodeOffsetLength(e.target.value)}
              className="w-32 h-8 px-3 text-xs rounded border font-mono bg-white border-gray-300 text-gray-800 focus:border-[#1677ff] focus:outline-none"
            />
          </div>
        </div>

        {/* Field 5: 关联 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
          <div className="w-28 text-xs font-medium text-gray-700 shrink-0">
            关联
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              是否使用关联字段
            </span>
            <input
              type="checkbox"
              checked={useRelField}
              onChange={(e) => setUseRelField(e.target.checked)}
              className="w-4 h-4 rounded text-[#1677ff] focus:ring-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Field 6: errCode */}
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-6 pt-3 border-t border-gray-100">
          <div className="w-28 text-xs font-medium text-gray-700 shrink-0 pt-1.5">
            errCode
          </div>
          <div className="flex-1 space-y-3">
            {errCodes.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    响应错误代码名称
                  </span>
                  <input
                    type="text"
                    placeholder="如: 系统响应超时"
                    value={item.name}
                    onChange={(e) =>
                      handleUpdateErrCode(item.id, 'name', e.target.value)
                    }
                    className="w-48 h-8 px-3 text-xs rounded border border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    响应错误代码
                  </span>
                  <input
                    type="text"
                    placeholder="如: E9999"
                    value={item.code}
                    onChange={(e) =>
                      handleUpdateErrCode(item.id, 'code', e.target.value)
                    }
                    className="w-48 h-8 px-3 text-xs rounded border font-mono border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveErrCode(item.id)}
                  className="h-8 px-2.5 text-xs rounded border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 flex items-center gap-1 transition-colors bg-white cursor-pointer"
                  title="删除此行"
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

        {/* Field 7: messagePair (纯浅色系容器) */}
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-6 pt-3 border-t border-gray-100">
          <div className="w-28 text-xs font-medium text-gray-700 shrink-0 pt-1.5">
            messagePair
          </div>
          <div className="flex-1 space-y-4">
            {messagePairs.map((pair, pairIndex) => (
              <div
                key={pair.id}
                className="bg-[#f8fafc] rounded-md border border-gray-200 overflow-hidden"
              >
                {/* Header: ∨ 参数  [清空] */}
                <div className="h-9 px-4 flex items-center justify-between border-b border-gray-200 bg-[#f1f5f9] text-gray-700">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateMessagePair(pair.id, 'collapsed', !pair.collapsed)
                    }
                    className="flex items-center gap-1.5 font-medium text-xs hover:text-[#1677ff] cursor-pointer"
                  >
                    {pair.collapsed ? (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                    <span>参数 {messagePairs.length > 1 ? `#${pairIndex + 1}` : ''}</span>
                    {pair.requestName && (
                      <span className="text-[11px] text-gray-400 font-normal">
                        ({pair.requestName})
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleClearMessagePair(pair.id)}
                      className="px-2.5 py-0.5 text-xs text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded cursor-pointer"
                    >
                      清空
                    </button>
                    {messagePairs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMessagePair(pair.id)}
                        className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                        title="删除整组"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {!pair.collapsed && (
                  <div className="p-4 space-y-4">
                    {/* Row 1 of messagePair */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">
                          <span className="text-red-500 mr-0.5">*</span>请求名称
                        </div>
                        <input
                          type="text"
                          placeholder="请输入请求名称"
                          value={pair.requestName}
                          onChange={(e) =>
                            handleUpdateMessagePair(
                              pair.id,
                              'requestName',
                              e.target.value
                            )
                          }
                          className="w-full h-8 px-2.5 text-xs rounded border border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="text-xs text-gray-600 mb-1">
                          <span className="text-red-500 mr-0.5">*</span>响应名称
                        </div>
                        <input
                          type="text"
                          placeholder="请输入响应名称"
                          value={pair.responseName}
                          onChange={(e) =>
                            handleUpdateMessagePair(
                              pair.id,
                              'responseName',
                              e.target.value
                            )
                          }
                          className="w-full h-8 px-2.5 text-xs rounded border border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="text-xs text-gray-600 mb-1">
                          请求关联字段偏移
                        </div>
                        <input
                          type="text"
                          placeholder="如: 16"
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
                        <div className="text-xs text-gray-600 mb-1">
                          关联字段长度
                        </div>
                        <input
                          type="text"
                          placeholder="如: 32"
                          value={pair.relLength}
                          onChange={(e) =>
                            handleUpdateMessagePair(
                              pair.id,
                              'relLength',
                              e.target.value
                            )
                          }
                          className="w-full h-8 px-2.5 text-xs rounded border font-mono border-gray-300 bg-white text-gray-800 focus:border-[#1677ff] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Row 2 of messagePair */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">
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
                        <div className="text-xs text-gray-600 mb-1">
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
                        <div className="text-xs text-gray-600 mb-1">
                          响应关联字段偏移
                        </div>
                        <input
                          type="text"
                          placeholder="如: 16"
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
                        <div className="text-xs text-gray-600 mb-1">
                          错误代码偏移
                        </div>
                        <input
                          type="text"
                          placeholder="如: 48"
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
                    <div className="p-3.5 bg-white rounded border border-gray-200">
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
                            <span className="text-xs text-gray-500">名称</span>
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

                            <span className="text-xs text-gray-500">偏移</span>
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

                            <span className="text-xs text-gray-500">长度</span>
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
                            <span className="text-xs text-gray-500">字段数据类型</span>
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
                              title="删除此字段"
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
                    <div className="p-3.5 bg-white rounded border border-gray-200">
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
                            <span className="text-xs text-gray-500">名称</span>
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

                            <span className="text-xs text-gray-500">偏移</span>
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

                            <span className="text-xs text-gray-500">长度</span>
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
                            <span className="text-xs text-gray-500">字段数据类型</span>
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
                              title="删除此字段"
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
      </div>

      {/* Bottom Action Bar: 保存添加 */}
      <div className="flex items-center justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-8 px-4 rounded text-xs border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        >
          取消返回
        </button>

        <button
          type="submit"
          className="h-8 px-6 bg-[#1677ff] hover:bg-[#4096ff] text-white rounded text-xs font-medium shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>保存添加</span>
        </button>
      </div>
    </form>
  );
};
