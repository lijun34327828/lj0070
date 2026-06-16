import { Settings, Palette, Type, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { ColorPicker } from '../common/ColorPicker';
import { useCanvasStore } from '@/store/useCanvasStore';
import { dataSourceOptions, getDataSourceLabel, getDimensionLabel } from '@/types';
import type { ThemeConfig } from '@shared/index';

interface ConfigPanelProps {
  theme: ThemeConfig;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function ConfigSection({ title, icon, children, defaultOpen = true }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-500" />
        ) : (
          <ChevronDown size={16} className="text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-3 pb-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function ConfigPanel({ theme }: ConfigPanelProps) {
  const selectedId = useCanvasStore(state => state.selectedId);
  const selectedComponent = useCanvasStore(state => 
    state.components.find(c => c.id === selectedId)
  );
  const updateComponentConfig = useCanvasStore(state => state.updateComponentConfig);
  const updateDataBinding = useCanvasStore(state => state.updateDataBinding);
  const updateComponent = useCanvasStore(state => state.updateComponent);

  const isMinimal = theme.name === 'minimal';

  if (!selectedComponent) {
    return (
      <div 
        className="w-72 border-l flex flex-col"
        style={{
          background: isMinimal ? '#ffffff' : '#150808',
          borderColor: isMinimal ? '#e9ecef' : 'rgba(212,175,55,0.2)'
        }}
      >
        <div 
          className="p-4 border-b"
          style={{ borderColor: isMinimal ? '#e9ecef' : 'rgba(212,175,55,0.2)' }}
        >
          <h2 
            className="text-sm font-semibold"
            style={{ color: isMinimal ? '#1a1a2e' : '#fffff0' }}
          >
            属性配置
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Settings 
              size={48} 
              className="mx-auto mb-3" 
              style={{ color: isMinimal ? '#adb5bd' : '#c9b896' }} 
            />
            <p 
              className="text-sm"
              style={{ color: isMinimal ? '#6c757d' : '#c9b896' }}
            >
              选择画布中的组件
            </p>
            <p 
              className="text-xs mt-1"
              style={{ color: isMinimal ? '#adb5bd' : '#8c7853' }}
            >
              查看和编辑组件属性
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentDataSource = dataSourceOptions.find(
    d => d.value === selectedComponent.dataBinding.dataSource
  );

  const panelBg = isMinimal ? '#ffffff' : '#150808';
  const panelBorder = isMinimal ? '#e9ecef' : 'rgba(212,175,55,0.2)';
  const inputBg = isMinimal ? '#f8f9fa' : 'rgba(255,255,255,0.05)';
  const inputBorder = isMinimal ? '#dee2e6' : 'rgba(212,175,55,0.3)';
  const textColor = isMinimal ? '#1a1a2e' : '#fffff0';
  const textSecondary = isMinimal ? '#6c757d' : '#c9b896';

  return (
    <div 
      className="w-72 border-l flex flex-col overflow-hidden"
      style={{ background: panelBg, borderColor: panelBorder }}
    >
      <div 
        className="p-4 border-b"
        style={{ borderColor: panelBorder }}
      >
        <h2 
          className="text-sm font-semibold"
          style={{ color: textColor }}
        >
          属性配置
        </h2>
        <p 
          className="text-xs mt-1"
          style={{ color: textSecondary }}
        >
          {getDataSourceLabel(selectedComponent.dataBinding.dataSource)} · 
          {selectedComponent.type.toUpperCase()}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ConfigSection 
          title="数据绑定" 
          icon={<Database size={16} style={{ color: textSecondary }} />}
        >
          <div>
            <label 
              className="block text-xs mb-1.5"
              style={{ color: textSecondary }}
            >
              数据源
            </label>
            <select
              value={selectedComponent.dataBinding.dataSource}
              onChange={(e) => {
                const newValue = e.target.value;
                const ds = dataSourceOptions.find(d => d.value === newValue);
                updateDataBinding(selectedComponent.id, {
                  dataSource: newValue,
                  dimension: ds?.dimensions[0]?.value || ''
                });
              }}
              className="w-full px-2.5 py-2 text-xs rounded border transition-colors focus:outline-none"
              style={{ 
                background: inputBg, 
                borderColor: inputBorder, 
                color: textColor 
              }}
            >
              {dataSourceOptions.map(ds => (
                <option key={ds.value} value={ds.value}>
                  {ds.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label 
              className="block text-xs mb-1.5"
              style={{ color: textSecondary }}
            >
              数据维度
            </label>
            <select
              value={selectedComponent.dataBinding.dimension}
              onChange={(e) => updateDataBinding(selectedComponent.id, {
                dimension: e.target.value
              })}
              className="w-full px-2.5 py-2 text-xs rounded border transition-colors focus:outline-none"
              style={{ 
                background: inputBg, 
                borderColor: inputBorder, 
                color: textColor 
              }}
            >
              {currentDataSource?.dimensions.map(dim => (
                <option key={dim.value} value={dim.value}>
                  {dim.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label 
              className="block text-xs mb-1.5"
              style={{ color: textSecondary }}
            >
              聚合方式
            </label>
            <select
              value={selectedComponent.dataBinding.aggregation}
              onChange={(e) => updateDataBinding(selectedComponent.id, {
                aggregation: e.target.value as 'sum' | 'avg' | 'count'
              })}
              className="w-full px-2.5 py-2 text-xs rounded border transition-colors focus:outline-none"
              style={{ 
                background: inputBg, 
                borderColor: inputBorder, 
                color: textColor 
              }}
            >
              <option value="sum">求和 (Sum)</option>
              <option value="avg">平均值 (Avg)</option>
              <option value="count">计数 (Count)</option>
            </select>
          </div>
        </ConfigSection>

        <ConfigSection 
          title="图表配色" 
          icon={<Palette size={16} style={{ color: textSecondary }} />}
        >
          <div className="space-y-2">
            {selectedComponent.config.colors.map((color, index) => (
              <ColorPicker
                key={index}
                label={`颜色 ${index + 1}`}
                value={color}
                onChange={(newColor) => {
                  const newColors = [...selectedComponent.config.colors];
                  newColors[index] = newColor;
                  updateComponentConfig(selectedComponent.id, { colors: newColors });
                }}
              />
            ))}
          </div>
          <button
            onClick={() => {
              if (selectedComponent.config.colors.length < 12) {
                const newColors = [...selectedComponent.config.colors, '#666666'];
                updateComponentConfig(selectedComponent.id, { colors: newColors });
              }
            }}
            className="w-full py-1.5 text-xs rounded border border-dashed transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            style={{ borderColor: inputBorder, color: textSecondary }}
          >
            + 添加颜色
          </button>
          {selectedComponent.config.colors.length > 1 && (
            <button
              onClick={() => {
                const newColors = selectedComponent.config.colors.slice(0, -1);
                updateComponentConfig(selectedComponent.id, { colors: newColors });
              }}
              className="w-full py-1.5 text-xs rounded border transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
              style={{ borderColor: '#fecaca', color: '#dc2626' }}
            >
              - 移除最后一个
            </button>
          )}
        </ConfigSection>

        <ConfigSection 
          title="文字排版" 
          icon={<Type size={16} style={{ color: textSecondary }} />}
        >
          <div>
            <label 
              className="block text-xs mb-1.5"
              style={{ color: textSecondary }}
            >
              标题
            </label>
            <input
              type="text"
              value={selectedComponent.config.title}
              onChange={(e) => updateComponentConfig(selectedComponent.id, {
                title: e.target.value
              })}
              className="w-full px-2.5 py-2 text-xs rounded border transition-colors focus:outline-none"
              style={{ 
                background: inputBg, 
                borderColor: inputBorder, 
                color: textColor 
              }}
            />
          </div>

          <div>
            <label 
              className="block text-xs mb-1.5"
              style={{ color: textSecondary }}
            >
              字体大小: {selectedComponent.config.fontSize}px
            </label>
            <input
              type="range"
              min="10"
              max="48"
              value={selectedComponent.config.fontSize}
              onChange={(e) => updateComponentConfig(selectedComponent.id, {
                fontSize: parseInt(e.target.value)
              })}
              className="w-full"
            />
          </div>

          <div>
            <label 
              className="block text-xs mb-1.5"
              style={{ color: textSecondary }}
            >
              圆角: {selectedComponent.config.borderRadius}px
            </label>
            <input
              type="range"
              min="0"
              max="24"
              value={selectedComponent.config.borderRadius}
              onChange={(e) => updateComponentConfig(selectedComponent.id, {
                borderRadius: parseInt(e.target.value)
              })}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <label 
              className="text-xs"
              style={{ color: textSecondary }}
            >
              显示标题
            </label>
            <button
              onClick={() => updateComponentConfig(selectedComponent.id, {
                showTitle: !selectedComponent.config.showTitle
              })}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                selectedComponent.config.showTitle 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div 
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  selectedComponent.config.showTitle ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label 
              className="text-xs"
              style={{ color: textSecondary }}
            >
              显示图例
            </label>
            <button
              onClick={() => updateComponentConfig(selectedComponent.id, {
                showLegend: !selectedComponent.config.showLegend
              })}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                selectedComponent.config.showLegend 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div 
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  selectedComponent.config.showLegend ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </ConfigSection>

        <ConfigSection 
          title="位置尺寸" 
          icon={<Settings size={16} style={{ color: textSecondary }} />}
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label 
                className="block text-xs mb-1.5"
                style={{ color: textSecondary }}
              >
                X 坐标
              </label>
              <input
                type="number"
                value={Math.round(selectedComponent.x)}
                onChange={(e) => updateComponent(selectedComponent.id, {
                  x: parseInt(e.target.value) || 0
                })}
                className="w-full px-2.5 py-2 text-xs rounded border transition-colors focus:outline-none"
                style={{ 
                  background: inputBg, 
                  borderColor: inputBorder, 
                  color: textColor 
                }}
              />
            </div>
            <div>
              <label 
                className="block text-xs mb-1.5"
                style={{ color: textSecondary }}
              >
                Y 坐标
              </label>
              <input
                type="number"
                value={Math.round(selectedComponent.y)}
                onChange={(e) => updateComponent(selectedComponent.id, {
                  y: parseInt(e.target.value) || 0
                })}
                className="w-full px-2.5 py-2 text-xs rounded border transition-colors focus:outline-none"
                style={{ 
                  background: inputBg, 
                  borderColor: inputBorder, 
                  color: textColor 
                }}
              />
            </div>
            <div>
              <label 
                className="block text-xs mb-1.5"
                style={{ color: textSecondary }}
              >
                宽度
              </label>
              <input
                type="number"
                value={Math.round(selectedComponent.width)}
                onChange={(e) => updateComponent(selectedComponent.id, {
                  width: parseInt(e.target.value) || 100
                })}
                className="w-full px-2.5 py-2 text-xs rounded border transition-colors focus:outline-none"
                style={{ 
                  background: inputBg, 
                  borderColor: inputBorder, 
                  color: textColor 
                }}
              />
            </div>
            <div>
              <label 
                className="block text-xs mb-1.5"
                style={{ color: textSecondary }}
              >
                高度
              </label>
              <input
                type="number"
                value={Math.round(selectedComponent.height)}
                onChange={(e) => updateComponent(selectedComponent.id, {
                  height: parseInt(e.target.value) || 60
                })}
                className="w-full px-2.5 py-2 text-xs rounded border transition-colors focus:outline-none"
                style={{ 
                  background: inputBg, 
                  borderColor: inputBorder, 
                  color: textColor 
                }}
              />
            </div>
          </div>
        </ConfigSection>
      </div>
    </div>
  );
}
