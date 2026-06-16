import { useRef, useEffect } from 'react';
import { Toolbar } from '@/components/layout/Toolbar';
import { ComponentPanel } from '@/components/layout/ComponentPanel';
import { Canvas } from '@/components/layout/Canvas';
import { ConfigPanel } from '@/components/layout/ConfigPanel';
import { useDragDrop } from '@/hooks/useDragDrop';
import { useCanvasStore } from '@/store/useCanvasStore';
import { getTheme, applyThemeVars } from '@/utils/theme';

export function Editor() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const themeName = useCanvasStore(state => state.theme);
  const theme = getTheme(themeName);
  
  const {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleComponentMouseDown
  } = useDragDrop(canvasRef);

  useEffect(() => {
    applyThemeVars(theme);
  }, [theme]);

  return (
    <div 
      className="h-screen flex flex-col overflow-hidden transition-all duration-500"
      style={{ fontFamily: theme.typography.bodyFont }}
    >
      <Toolbar />
      
      <div className="flex-1 flex overflow-hidden">
        <ComponentPanel onDragStart={handleDragStart} />
        
        <div 
          ref={canvasRef}
          className="flex-1 relative"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        >
          <Canvas
            theme={theme}
            dragState={dragState}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onComponentMouseDown={handleComponentMouseDown}
          />
        </div>
        
        <ConfigPanel theme={theme} />
      </div>
    </div>
  );
}
