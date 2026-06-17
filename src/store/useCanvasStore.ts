import { create } from 'zustand';
import type { CanvasComponent, CanvasState, ThemeName, ComponentType } from '@shared/index';
import { defaultColors } from '@/types';

const MAX_HISTORY_LENGTH = 50;

interface HistorySnapshot {
  components: CanvasComponent[];
  selectedId: string | null;
}

function generateId(): string {
  return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getDefaultConfig(type: ComponentType, theme: ThemeName) {
  const baseConfig = {
    colors: defaultColors[theme],
    fontSize: 14,
    fontFamily: "'Noto Sans SC', sans-serif",
    showLegend: true,
    borderRadius: theme === 'luxury' ? 12 : 4,
    showTitle: true
  };

  switch (type) {
    case 'line':
      return { ...baseConfig, title: '资产趋势折线图' };
    case 'pie':
      return { ...baseConfig, title: '资产配置环形图' };
    case 'bar':
      return { ...baseConfig, title: '投资收益柱状图' };
    case 'card':
      return { ...baseConfig, title: '数据卡片' };
    case 'text':
      return { ...baseConfig, title: '双击编辑文本', fontSize: 24 };
    default:
      return { ...baseConfig, title: '组件' };
  }
}

function getDefaultSize(type: ComponentType) {
  switch (type) {
    case 'card':
      return { width: 200, height: 120 };
    case 'text':
      return { width: 300, height: 60 };
    default:
      return { width: 400, height: 280 };
  }
}

interface CanvasStore extends CanvasState {
  history: HistorySnapshot[];
  historyIndex: number;
  isContinuousChange: boolean;
  canUndo: boolean;
  canRedo: boolean;
  setTheme: (theme: ThemeName) => void;
  addComponent: (type: ComponentType, x: number, y: number) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (id: string, x: number, y: number) => void;
  resizeComponent: (id: string, width: number, height: number) => void;
  updateComponentConfig: (id: string, config: Partial<CanvasComponent['config']>) => void;
  updateDataBinding: (id: string, binding: Partial<CanvasComponent['dataBinding']>) => void;
  clearAll: () => void;
  beginContinuousChange: () => void;
  endContinuousChange: () => void;
  undo: () => void;
  redo: () => void;
}

function createSnapshot(state: CanvasState): HistorySnapshot {
  return {
    components: JSON.parse(JSON.stringify(state.components)),
    selectedId: state.selectedId
  };
}

function pushHistory(
  set: (partial: Partial<CanvasStore>) => void,
  get: () => CanvasStore
) {
  const state = get();
  if (state.isContinuousChange) return;

  const snapshot = createSnapshot(state);
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  
  if (newHistory.length > 0) {
    const lastSnapshot = newHistory[newHistory.length - 1];
    if (JSON.stringify(lastSnapshot) === JSON.stringify(snapshot)) {
      return;
    }
  }

  newHistory.push(snapshot);
  if (newHistory.length > MAX_HISTORY_LENGTH) {
    newHistory.shift();
  }

  set({
    history: newHistory,
    historyIndex: newHistory.length - 1
  });
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  components: [],
  selectedId: null,
  theme: 'minimal',
  history: [{ components: [], selectedId: null }],
  historyIndex: 0,
  isContinuousChange: false,
  get canUndo() {
    return get().historyIndex > 0;
  },
  get canRedo() {
    return get().historyIndex < get().history.length - 1;
  },

  beginContinuousChange: () => {
    set({ isContinuousChange: true });
  },

  endContinuousChange: () => {
    set({ isContinuousChange: false });
    pushHistory(set, get);
  },

  undo: () => {
    const state = get();
    if (state.historyIndex <= 0) return;

    const newIndex = state.historyIndex - 1;
    const snapshot = state.history[newIndex];
    set({
      components: JSON.parse(JSON.stringify(snapshot.components)),
      selectedId: snapshot.selectedId,
      historyIndex: newIndex
    });
  },

  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1) return;

    const newIndex = state.historyIndex + 1;
    const snapshot = state.history[newIndex];
    set({
      components: JSON.parse(JSON.stringify(snapshot.components)),
      selectedId: snapshot.selectedId,
      historyIndex: newIndex
    });
  },

  setTheme: (theme: ThemeName) => {
    set({ theme });
    const components = get().components;
    const updatedComponents = components.map(comp => ({
      ...comp,
      config: {
        ...comp.config,
        colors: defaultColors[theme],
        borderRadius: theme === 'luxury' ? 12 : 4
      }
    }));
    set({ components: updatedComponents });
    pushHistory(set, get);
  },

  addComponent: (type: ComponentType, x: number, y: number) => {
    const theme = get().theme;
    const size = getDefaultSize(type);
    const newComponent: CanvasComponent = {
      id: generateId(),
      type,
      x,
      y,
      ...size,
      config: getDefaultConfig(type, theme),
      dataBinding: {
        dataSource: type === 'line' ? 'trend' : type === 'pie' ? 'categories' : type === 'bar' ? 'income' : 'overview',
        dimension: type === 'line' ? 'value' : type === 'pie' ? 'value' : type === 'bar' ? 'income' : 'totalAssets',
        aggregation: 'sum'
      }
    };
    set(state => ({
      components: [...state.components, newComponent],
      selectedId: newComponent.id
    }));
    pushHistory(set, get);
  },

  removeComponent: (id: string) => {
    set(state => ({
      components: state.components.filter(c => c.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId
    }));
    pushHistory(set, get);
  },

  updateComponent: (id: string, updates: Partial<CanvasComponent>) => {
    set(state => ({
      components: state.components.map(c =>
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  },

  selectComponent: (id: string | null) => {
    set({ selectedId: id });
  },

  moveComponent: (id: string, x: number, y: number) => {
    set(state => ({
      components: state.components.map(c =>
        c.id === id ? { ...c, x: Math.max(0, x), y: Math.max(0, y) } : c
      )
    }));
  },

  resizeComponent: (id: string, width: number, height: number) => {
    set(state => ({
      components: state.components.map(c =>
        c.id === id ? { ...c, width: Math.max(100, width), height: Math.max(60, height) } : c
      )
    }));
  },

  updateComponentConfig: (id: string, config: Partial<CanvasComponent['config']>) => {
    set(state => ({
      components: state.components.map(c =>
        c.id === id ? { ...c, config: { ...c.config, ...config } } : c
      )
    }));
    pushHistory(set, get);
  },

  updateDataBinding: (id: string, binding: Partial<CanvasComponent['dataBinding']>) => {
    set(state => ({
      components: state.components.map(c =>
        c.id === id ? { ...c, dataBinding: { ...c.dataBinding, ...binding } } : c
      )
    }));
    pushHistory(set, get);
  },

  clearAll: () => {
    set({ components: [], selectedId: null });
    pushHistory(set, get);
  }
}));
