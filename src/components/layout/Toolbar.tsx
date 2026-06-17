import { Trash2, LayoutDashboard, Undo2, Redo2 } from 'lucide-react';
import { StyleSwitch } from '../common/StyleSwitch';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useEffect, useCallback } from 'react';

export function Toolbar() {
  const clearAll = useCanvasStore(state => state.clearAll);
  const components = useCanvasStore(state => state.components);
  const theme = useCanvasStore(state => state.theme);
  const setTheme = useCanvasStore(state => state.setTheme);
  const undo = useCanvasStore(state => state.undo);
  const redo = useCanvasStore(state => state.redo);
  const canUndo = useCanvasStore(state => state.canUndo);
  const canRedo = useCanvasStore(state => state.canRedo);

  const isMinimal = theme === 'minimal';

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      } else if (e.key === 'z') {
        e.preventDefault();
        undo();
      }
    }
  }, [undo, redo]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div 
      className="h-14 px-6 flex items-center justify-between border-b"
      style={{
        background: isMinimal ? '#ffffff' : '#1a0a0a',
        borderColor: isMinimal ? '#e9ecef' : 'rgba(212,175,55,0.3)'
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded flex items-center justify-center"
          style={{ background: isMinimal ? '#1e3a5f' : '#d4af37' }}
        >
          <LayoutDashboard size={18} className="text-white" />
        </div>
        <div>
          <h1 
            className="text-lg font-bold"
            style={{ 
              color: isMinimal ? '#1a1a2e' : '#fffff0',
              fontFamily: "'Playfair Display', serif"
            }}
          >
            资产汇报可视化配置
          </h1>
          <p 
            className="text-xs"
            style={{ color: isMinimal ? '#6c757d' : '#c9b896' }}
          >
            拖拽组件 · 自定义布局 · 实时预览
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <StyleSwitch 
          currentTheme={theme} 
          onThemeChange={setTheme} 
        />

        <div 
          className="text-xs px-3 py-1.5 rounded"
          style={{
            background: isMinimal ? '#f8f9fa' : 'rgba(212,175,55,0.1)',
            color: isMinimal ? '#6c757d' : '#c9b896'
          }}
        >
          组件数: {components.length}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="flex items-center gap-1 px-2.5 py-1.5 text-sm rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
            style={{
              background: isMinimal ? '#fff' : 'rgba(255,255,255,0.05)',
              color: isMinimal ? '#495057' : '#c9b896',
              border: `1px solid ${isMinimal ? '#dee2e6' : 'rgba(212,175,55,0.3)'}`,
            }}
            title="撤销 (Ctrl/Cmd+Z)"
          >
            <Undo2 size={14} />
            撤销
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            className="flex items-center gap-1 px-2.5 py-1.5 text-sm rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
            style={{
              background: isMinimal ? '#fff' : 'rgba(255,255,255,0.05)',
              color: isMinimal ? '#495057' : '#c9b896',
              border: `1px solid ${isMinimal ? '#dee2e6' : 'rgba(212,175,55,0.3)'}`,
            }}
            title="重做 (Ctrl/Cmd+Shift+Z)"
          >
            <Redo2 size={14} />
            重做
          </button>
        </div>

        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded transition-all hover:opacity-80"
          style={{
            background: isMinimal ? '#fff' : 'rgba(255,255,255,0.05)',
            color: isMinimal ? '#dc2626' : '#ef4444',
            border: `1px solid ${isMinimal ? '#fee2e2' : 'rgba(239,68,68,0.3)'}`,
          }}
        >
          <Trash2 size={14} />
          清空
        </button>
      </div>
    </div>
  );
}
