export interface AssetOverview {
  totalAssets: number;
  yearGrowth: number;
  monthGrowth: number;
  riskLevel: string;
}

export interface AssetCategory {
  name: string;
  value: number;
  percentage: number;
}

export interface AssetTrendItem {
  date: string;
  value: number;
  growth: number;
}

export interface InvestmentIncome {
  category: string;
  income: number;
  rate: number;
}

export interface AssetAllocation {
  type: string;
  current: number;
  target: number;
}

export type ThemeName = 'minimal' | 'luxury';

export interface ThemeConfig {
  name: ThemeName;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    grid: string;
    chartColors: string[];
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export type ComponentType = 'line' | 'pie' | 'bar' | 'text' | 'card';

export interface DataBinding {
  dataSource: string;
  dimension: string;
  aggregation: 'sum' | 'avg' | 'count';
}

export interface ComponentConfig {
  title: string;
  colors: string[];
  fontSize: number;
  fontFamily: string;
  showLegend: boolean;
  borderRadius: number;
  showTitle: boolean;
}

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  config: ComponentConfig;
  dataBinding: DataBinding;
}

export interface CanvasState {
  components: CanvasComponent[];
  selectedId: string | null;
  theme: ThemeName;
}

export interface DataSourceOption {
  value: string;
  label: string;
  dimensions: { value: string; label: string }[];
}
