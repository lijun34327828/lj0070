import { useEffect, useState } from 'react';
import { fetchDataSource } from '@/utils/api';
import type { CanvasComponent, ThemeConfig } from '@shared/index';

interface DataCardProps {
  component: CanvasComponent;
  theme: ThemeConfig;
}

export function DataCard({ component, theme }: DataCardProps) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchDataSource(component.dataBinding.dataSource);
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [component.dataBinding.dataSource]);

  const formatValue = (value: unknown): string => {
    if (typeof value === 'number') {
      if (value >= 10000000) {
        return (value / 10000000).toFixed(2) + '千万';
      }
      if (value >= 10000) {
        return (value / 10000).toFixed(2) + '万';
      }
      return value.toLocaleString();
    }
    return String(value || '-');
  };

  const displayValue = data && typeof data === 'object' && !Array.isArray(data)
    ? (data as Record<string, unknown>)[component.dataBinding.dimension]
    : null;

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center p-4"
      style={{
        background: theme.colors.cardBg,
        borderRadius: component.config.borderRadius,
        border: theme.name === 'luxury' 
          ? `1px solid ${theme.colors.border}`
          : 'none',
        boxShadow: theme.shadows.md
      }}
    >
      {loading ? (
        <div className="animate-pulse" style={{ color: theme.colors.textSecondary }}>
          加载中...
        </div>
      ) : (
        <>
          {component.config.showTitle && (
            <div
              className="mb-2"
              style={{
                color: theme.colors.textSecondary,
                fontFamily: component.config.fontFamily,
                fontSize: component.config.fontSize - 2
              }}
            >
              {component.config.title}
            </div>
          )}
          <div
            className="font-bold"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.typography.headingFont,
              fontSize: component.config.fontSize + 12
            }}
          >
              {formatValue(displayValue)}
            </div>
        </>
      )}
    </div>
  );
}
