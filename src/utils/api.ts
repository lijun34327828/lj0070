import type {
  AssetOverview,
  AssetCategory,
  AssetTrendItem,
  InvestmentIncome,
  AssetAllocation
} from '@shared/index';

const BASE_URL = '/api/assets';

async function fetchApi<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(endpoint, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

export const assetApi = {
  getOverview: (): Promise<AssetOverview> => 
    fetchApi<AssetOverview>(`${BASE_URL}/overview`),
    
  getCategories: (): Promise<AssetCategory[]> => 
    fetchApi<AssetCategory[]>(`${BASE_URL}/categories`),
    
  getTrend: (period: '3m' | '6m' | '12m' = '12m'): Promise<AssetTrendItem[]> => 
    fetchApi<AssetTrendItem[]>(`${BASE_URL}/trend`, { period }),
    
  getIncome: (): Promise<InvestmentIncome[]> => 
    fetchApi<InvestmentIncome[]>(`${BASE_URL}/income`),
    
  getAllocation: (): Promise<AssetAllocation[]> => 
    fetchApi<AssetAllocation[]>(`${BASE_URL}/allocation`),
    
  getMonthlyIncome: (): Promise<{ month: string; income: number; expense: number }[]> => 
    fetchApi(`${BASE_URL}/monthly-income`),
    
  getHoldingPeriod: (): Promise<{ name: string; value: number }[]> => 
    fetchApi(`${BASE_URL}/holding-period`),
    
  getRiskReturn: (): Promise<{ product: string; risk: number; return: number }[]> => 
    fetchApi(`${BASE_URL}/risk-return`)
};

export const dataSourceMap: Record<string, () => Promise<unknown>> = {
  'overview': assetApi.getOverview,
  'categories': assetApi.getCategories,
  'trend': () => assetApi.getTrend('12m'),
  'income': assetApi.getIncome,
  'allocation': assetApi.getAllocation,
  'monthly-income': assetApi.getMonthlyIncome,
  'holding-period': assetApi.getHoldingPeriod,
  'risk-return': assetApi.getRiskReturn
};

export async function fetchDataSource(dataSource: string): Promise<unknown> {
  const fetcher = dataSourceMap[dataSource];
  if (fetcher) {
    return fetcher();
  }
  throw new Error(`Unknown data source: ${dataSource}`);
}
