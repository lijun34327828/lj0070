import { useState, useCallback, useRef } from 'react';
import type { ComponentType } from '@shared/index';
import { useCanvasStore } from '@/store/useCanvasStore';

interface DragState {
  isDragging: boolean;
  type: ComponentType | null;
  position: { x: number; y: number };
}

export function useDragDrop(canvasRef: React.RefObject<HTMLDivElement>) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    type: null,
    position: { x: 0, y: 0 }
  });
  
  const addComponent = useCanvasStore(state => state.addComponent);
  const moveComponent = useCanvasStore(state => state.moveComponent);
  const beginContinuousChange = useCanvasStore(state => state.beginContinuousChange);
  const endContinuousChange = useCanvasStore(state => state.endContinuousChange);
  
  const movingComponentRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('componentType', type);
    setDragState({
      isDragging: true,
      type,
      position: { x: e.clientX, y: e.clientY }
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragState(prev => ({
        ...prev,
        position: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
      }));
    }
  }, [canvasRef]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    const componentType = e.dataTransfer.getData('componentType') as ComponentType;
    if (!componentType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 100;
    const y = e.clientY - rect.top - 80;

    addComponent(componentType, Math.max(0, x), Math.max(0, y));
    
    setDragState({
      isDragging: false,
      type: null,
      position: { x: 0, y: 0 }
    });
  }, [canvasRef, addComponent]);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      type: null,
      position: { x: 0, y: 0 }
    });
  }, []);

  const handleComponentMouseDown = useCallback((e: React.MouseEvent, componentId: string) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const component = useCanvasStore.getState().components.find(c => c.id === componentId);
    if (!component) return;

    movingComponentRef.current = {
      id: componentId,
      offsetX: e.clientX - rect.left - component.x,
      offsetY: e.clientY - rect.top - component.y
    };

    beginContinuousChange();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!movingComponentRef.current || !canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = moveEvent.clientX - canvasRect.left - movingComponentRef.current.offsetX;
      const newY = moveEvent.clientY - canvasRect.top - movingComponentRef.current.offsetY;
      
      moveComponent(componentId, newX, newY);
    };

    const handleMouseUp = () => {
      movingComponentRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      endContinuousChange();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [canvasRef, moveComponent, beginContinuousChange, endContinuousChange]);

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleComponentMouseDown
  };
}
