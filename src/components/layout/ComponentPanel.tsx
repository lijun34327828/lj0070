import { TrendingUp, PieChart, BarChart3, CreditCard, Type } from 'lucide-react';
import type { ComponentType } from '@shared/index';
import { useCanvasStore } from '@/store/useCanvasStore';

interface ComponentItem {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export function ComponentPanel({ onDragStart }: { onDragStart: (e: React.DragEvent, type: ComponentType) => void }) {
  const theme = useCanvasStore(state => state.theme);
  const isMinimal = theme === 'minimal';

  const components: ComponentItem[] = [
    { type: 'line', label: '折线图', icon: <TrendingUp size={20} />, description: '展示趋势变化' },
    { type: 'pie', label: '环形图', icon: <PieChart size={20} />, description: '展示占比分布' },
    { type: 'bar', label: '柱状图', icon: <BarChart3 size={20} />, description: '展示对比数据' },
    { type: 'card', label: '数据卡片', icon: <CreditCard size={20} />, description: '展示关键指标' },
    { type: 'text', label: '文本标题', icon: <Type size={20} />, description: '添加说明文字' }
  ];

  return (
    <div 
      className="w-64 border-r flex flex-col"
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
          style={{ 
            color: isMinimal ? '#1a1a2e' : '#fffff0' 
          }}
        >
          组件库
        </h2>
        <p 
          className="text-xs mt-1"
          style={{ color: isMinimal ? '#6c757d' : '#c9b896' }}
        >
          拖拽组件到右侧画布
        </p>
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <div className="space-y-2">
          {components.map((comp) => (
            <div
              key={comp.type}
              draggable
              onDragStart={(e) => onDragStart(e, comp.type)}
              className="p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02]"
              style={{
                background: isMinimal ? '#f8f9fa' : 'rgba(212,175,55,0.08)',
                border: `1px solid ${isMinimal ? '#e9ecef' : 'rgba(212,175,55,0.2)'}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: isMinimal ? '#1e3a5f' : 'rgba(212,175,55,0.2)',
                    color: isMinimal ? '#ffffff' : '#d4af37'
                  }}
                >
                  {comp.icon}
                </div>
                <div>
                  <div 
                    className="font-medium text-sm"
                    style={{ color: isMinimal ? '#1a1a2e' : '#fffff0' }}
                  >
                    {comp.label}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: isMinimal ? '#6c757d' : '#c9b896' }}
                  >
                    {comp.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div 
          className="mt-6 p-3 rounded-lg"
          style={{
            background: isMinimal ? 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)' : 'linear-gradient(135deg, #722f37 0%, #d4af37 100%)'
          }}
        >
          <h3 className="text-white font-semibold text-sm mb-2">使用提示</h3>
          <ul className="text-white/80 text-xs space-y-1">
            <li>• 拖拽左侧组件到画布</li>
            <li>• 点击组件进行选中</li>
            <li>• 在右侧面板配置样式</li>
            <li>• 切换风格查看效果</li>
            <li>• 双击文本可编辑</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
