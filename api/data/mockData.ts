import type { AssetOverview, AssetCategory, AssetTrendItem, InvestmentIncome, AssetAllocation } from '@shared/index';

export const assetOverview: AssetOverview = {
  totalAssets: 12856000,
  yearGrowth: 12.8,
  monthGrowth: 2.3,
  riskLevel: '中低风险'
};

export const assetCategories: AssetCategory[] = [
  { name: '股票投资', value: 4500000, percentage: 35 },
  { name: '债券基金', value: 3200000, percentage: 25 },
  { name: '银行理财', value: 1800000, percentage: 14 },
  { name: '房产投资', value: 2000000, percentage: 16 },
  { name: '现金及等价物', value: 800000, percentage: 6 },
  { name: '另类投资', value: 556000, percentage: 4 }
];

export const assetTrend12m: AssetTrendItem[] = [
  { date: '2025-07', value: 10800000, growth: 1.2 },
  { date: '2025-08', value: 10950000, growth: 1.4 },
  { date: '2025-09', value: 10750000, growth: -1.8 },
  { date: '2025-10', value: 11100000, growth: 3.3 },
  { date: '2025-11', value: 11450000, growth: 3.2 },
  { date: '2025-12', value: 11200000, growth: -2.2 },
  { date: '2026-01', value: 11600000, growth: 3.6 },
  { date: '2026-02', value: 11850000, growth: 2.2 },
  { date: '2026-03', value: 12100000, growth: 2.1 },
  { date: '2026-04', value: 12350000, growth: 2.1 },
  { date: '2026-05', value: 12560000, growth: 1.7 },
  { date: '2026-06', value: 12856000, growth: 2.3 }
];

export const investmentIncome: InvestmentIncome[] = [
  { category: '股息收入', income: 185000, rate: 4.1 },
  { category: '债券利息', income: 128000, rate: 4.0 },
  { category: '基金分红', income: 95000, rate: 3.0 },
  { category: '房产租金', income: 156000, rate: 7.8 },
  { category: '理财收益', income: 72000, rate: 4.0 },
  { category: '资本利得', income: 320000, rate: 7.1 }
];

export const assetAllocation: AssetAllocation[] = [
  { type: '股票', current: 35, target: 40 },
  { type: '债券', current: 25, target: 25 },
  { type: '现金', current: 12, target: 10 },
  { type: '房产', current: 16, target: 15 },
  { type: '另类', current: 12, target: 10 }
];

export const monthlyIncomeData = [
  { month: '1月', income: 78000, expense: 45000 },
  { month: '2月', income: 85000, expense: 52000 },
  { month: '3月', income: 92000, expense: 48000 },
  { month: '4月', income: 88000, expense: 55000 },
  { month: '5月', income: 95000, expense: 42000 },
  { month: '6月', income: 102000, expense: 60000 }
];

export const holdingPeriodData = [
  { name: '短期 (<1年)', value: 25 },
  { name: '中期 (1-3年)', value: 45 },
  { name: '长期 (3-5年)', value: 20 },
  { name: '超长期 (>5年)', value: 10 }
];

export const riskReturnData = [
  { product: '货币基金', risk: 1, return: 2.5 },
  { product: '债券基金', risk: 2, return: 4.0 },
  { product: '混合基金', risk: 4, return: 6.5 },
  { product: '股票基金', risk: 6, return: 10.0 },
  { product: '个股投资', risk: 8, return: 15.0 },
  { product: '另类投资', risk: 7, return: 12.0 }
];
