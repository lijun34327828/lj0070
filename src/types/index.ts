import type { DataSourceOption } from '@shared/index';

export const componentTypes = [
  { value: 'line', label: '折线图', icon: 'TrendingUp' },
  { value: 'pie', label: '环形图', icon: 'PieChart' },
  { value: 'bar', label: '柱状图', icon: 'BarChart3' },
  { value: 'card', label: '数据卡片', icon: 'CreditCard' },
  { value: 'text', label: '文本标题', icon: 'Type' }
] as const;

export const dataSourceOptions: DataSourceOption[] = [
  {
    value: 'overview',
    label: '资产概览',
    dimensions: [
      { value: 'totalAssets', label: '总资产' },
      { value: 'yearGrowth', label: '年度增长率' },
      { value: 'monthGrowth', label: '月度增长率' },
      { value: 'riskLevel', label: '风险等级' }
    ]
  },
  {
    value: 'categories',
    label: '资产分类',
    dimensions: [
      { value: 'name', label: '类别名称' },
      { value: 'value', label: '资产价值' },
      { value: 'percentage', label: '占比' }
    ]
  },
  {
    value: 'trend',
    label: '资产趋势',
    dimensions: [
      { value: 'date', label: '日期' },
      { value: 'value', label: '资产总值' },
      { value: 'growth', label: '增长率' }
    ]
  },
  {
    value: 'income',
    label: '投资收益',
    dimensions: [
      { value: 'category', label: '收益类别' },
      { value: 'income', label: '收益金额' },
      { value: 'rate', label: '收益率' }
    ]
  },
  {
    value: 'allocation',
    label: '资产配置',
    dimensions: [
      { value: 'type', label: '资产类型' },
      { value: 'current', label: '当前配置' },
      { value: 'target', label: '目标配置' }
    ]
  },
  {
    value: 'monthly-income',
    label: '月度收支',
    dimensions: [
      { value: 'month', label: '月份' },
      { value: 'income', label: '收入' },
      { value: 'expense', label: '支出' }
    ]
  },
  {
    value: 'holding-period',
    label: '持有周期',
    dimensions: [
      { value: 'name', label: '周期' },
      { value: 'value', label: '占比' }
    ]
  },
  {
    value: 'risk-return',
    label: '风险收益',
    dimensions: [
      { value: 'product', label: '产品' },
      { value: 'risk', label: '风险系数' },
      { value: 'return', label: '预期收益' }
    ]
  }
];

export function getDataSourceLabel(value: string): string {
  const ds = dataSourceOptions.find(d => d.value === value);
  return ds?.label || value;
}

export function getDimensionLabel(dataSource: string, dimension: string): string {
  const ds = dataSourceOptions.find(d => d.value === dataSource);
  const dim = ds?.dimensions.find(d => d.value === dimension);
  return dim?.label || dimension;
}

export const defaultColors = {
  minimal: ['#1e3a5f', '#c9a962', '#8c9bab', '#4a7c59', '#d4a574', '#6b5b95'],
  luxury: ['#d4af37', '#722f37', '#c9b896', '#8b4513', '#daa520', '#cd853f']
};
