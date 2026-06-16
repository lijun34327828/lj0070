import { useRef, useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { LineChart, PieChart, BarChart, DataCard, TextBlock } from '../charts';
import type { CanvasComponent, ThemeConfig } from '@shared/index';
import { useCanvasStore } from '@/store/useCanvasStore';

interface CanvasProps {
  theme: ThemeConfig;
  dragState: { isDragging: boolean; position: { x: number; y: number } };
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onComponentMouseDown: (e: React.MouseEvent, id: string) => void;
}

export function Canvas({ 
  theme, 
  dragState, 
  onDragOver, 
  onDrop, 
  onComponentMouseDown 
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const components = useCanvasStore(state => state.components);
  const selectedId = useCanvasStore(state => state.selectedId);
  const selectComponent = useCanvasStore(state => state.selectComponent);
  const removeComponent = useCanvasStore(state => state.removeComponent);
  const resizeComponent = useCanvasStore(state => state.resizeComponent);
  
  const [resizing, setResizing] = useState<{
    id: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const renderChart = useCallback((component: CanvasComponent) => {
    switch (component.type) {
      case 'line':
        return <LineChart component={component} theme={theme} />;
      case 'pie':
        return <PieChart component={component} theme={theme} />;
      case 'bar':
        return <BarChart component={component} theme={theme} />;
      case 'card':
        return <DataCard component={component} theme={theme} />;
      case 'text':
        return <TextBlock component={component} theme={theme} />;
      default:
        return null;
    }
  }, [theme]);

  const handleResizeStart = useCallback((e: React.MouseEvent, component: CanvasComponent) => {
    e.stopPropagation();
    setResizing({
      id: component.id,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: component.width,
      startHeight: component.height
    });
  }, []);

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizing.startX;
      const deltaY = e.clientY - resizing.startY;
      resizeComponent(
        resizing.id,
        resizing.startWidth + deltaX,
        resizing.startHeight + deltaY
      );
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, resizeComponent]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      selectComponent(null);
    }
  };

  const isMinimal = theme.name === 'minimal';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div 
        className="flex-1 relative overflow-auto"
        style={{ background: theme.colors.background }}
      >
        <div
          ref={canvasRef}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={handleCanvasClick}
          className="relative min-h-[1200px] min-w-[900px] transition-all duration-500"
          style={{
            backgroundImage: isMinimal 
              ? `linear-gradient(${theme.colors.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.grid} 1px, transparent 1px)`
              : `radial-gradient(circle at 20% 30%, rgba(212,175,55,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(114,47,55,0.1) 0%, transparent 50%)`,
            backgroundSize: isMinimal ? '20px 20px' : 'auto',
            backgroundPosition: 'center center'
          }}
        >
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="text-center p-8 rounded-xl"
                style={{
                  background: isMinimal ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)',
                  border: `2px dashed ${isMinimal ? '#dee2e6' : 'rgba(212,175,55,0.3)'}`
                }}
              >
                <div 
                  className="text-2xl mb-3 font-semibold"
                  style={{ 
                    color: isMinimal ? '#495057' : '#c9b896',
                    fontFamily: theme.typography.headingFont
                  }}
                >
                  从左侧拖拽组件到此处
                </div>
                <p 
                  className="text-sm"
                  style={{ color: isMinimal ? '#adb5bd' : '#8c7853' }}
                >
                  开始创建您的资产汇报页面
                </p>
              </div>
            </div>
          )}

          {dragState.isDragging && (
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: dragState.position.x - 100,
                top: dragState.position.y - 80,
                width: 200,
                height: 160,
                border: `2px dashed ${isMinimal ? '#1e3a5f' : '#d4af37'}`,
                background: isMinimal ? 'rgba(30,58,95,0.1)' : 'rgba(212,175,55,0.1)',
                borderRadius: theme.borderRadius.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isMinimal ? '#1e3a5f' : '#d4af37',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              放置组件
            </div>
          )}

          {components.map((component) => {
            const isSelected = selectedId === component.id;
            return (
              <div
                key={component.id}
                onMouseDown={(e) => onComponentMouseDown(e, component.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  selectComponent(component.id);
                }}
                className={`absolute transition-all ${isSelected ? 'z-20' : 'z-10'}`}
                style={{
                  left: component.x,
                  top: component.y,
                  width: component.width,
                  height: component.height,
                  cursor: 'move',
                  transition: resizing?.id === component.id ? 'none' : 'box-shadow 0.2s',
                  boxShadow: isSelected 
                    ? (isMinimal 
                        ? '0 0 0 2px #1e3a5f, 0 8px 24px rgba(30,58,95,0.2)' 
                        : '0 0 0 2px #d4af37, 0 8px 24px rgba(212,175,55,0.3)')
                    : theme.shadows.sm,
                  borderRadius: component.config.borderRadius,
                  overflow: 'hidden',
                  background: isMinimal ? '#ffffff' : 'rgba(255,255,255,0.02)',
                  border: theme.name === 'luxury' 
                    ? `1px solid ${isSelected ? '#d4af37' : 'rgba(212,175,55,0.2)'}`
                    : isSelected 
                      ? 'none' 
                      : `1px solid ${theme.colors.border}`,
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                {renderChart(component)}

                {isSelected && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeComponent(component.id);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center z-30 transition-transform hover:scale-110"
                      style={{
                        background: isMinimal ? '#dc2626' : '#ef4444',
                        color: '#ffffff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      <X size={14} />
                    </button>

                    <div
                      onMouseDown={(e) => handleResizeStart(e, component)}
                      className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-30"
                      style={{
                        borderRight: `3px solid ${isMinimal ? '#1e3a5f' : '#d4af37'}`,
                        borderBottom: `3px solid ${isMinimal ? '#1e3a5f' : '#d4af37'}`,
                        borderBottomRightRadius: component.config.borderRadius
                      }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
