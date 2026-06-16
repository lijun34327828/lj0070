import { useEffect, useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { fetchDataSource } from '@/utils/api';
import type { CanvasComponent, ThemeConfig } from '@shared/index';

interface LineChartProps {
  component: CanvasComponent;
  theme: ThemeConfig;
}

export function LineChart({ component, theme }: LineChartProps) {
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

  const option = useMemo<EChartsOption>(() => {
    const chartData = Array.isArray(data) ? data : [];
    const colors = component.config.colors.length > 0 
      ? component.config.colors 
      : theme.colors.chartColors;

    return {
      color: colors,
      backgroundColor: 'transparent',
      title: component.config.showTitle ? {
        text: component.config.title,
        left: 'center',
        top: 10,
        textStyle: {
          color: theme.colors.text,
          fontFamily: component.config.fontFamily,
          fontSize: component.config.fontSize + 2,
          fontWeight: 600
        }
      } : undefined,
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.name === 'luxury' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)',
        borderColor: theme.colors.border,
        borderWidth: 1,
        textStyle: {
          color: theme.colors.text
        },
        formatter: (params: unknown) => {
          const p = params as Array<{ name: string; value: number; seriesName: string; color?: string }>;
          if (!p || p.length === 0) return '';
          let result = `<div style="padding: 4px 8px;">`;
          result += `<div style="font-weight: 600; margin-bottom: 4px;">${p[0].name}</div>`;
          p.forEach(item => {
            result += `<div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color || colors[0]};"></span>
              <span>${item.seriesName}:</span>
              <span style="font-weight: 600;">${typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</span>
            </div>`;
          });
          result += '</div>';
          return result;
        }
      },
      legend: component.config.showLegend ? {
        bottom: 10,
        textStyle: {
          color: theme.colors.textSecondary,
          fontFamily: component.config.fontFamily,
          fontSize: component.config.fontSize - 2
        }
      } : undefined,
      grid: {
        left: '12%',
        right: '6%',
        top: component.config.showTitle ? 60 : 30,
        bottom: component.config.showLegend ? 50 : 30,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.map((item: Record<string, unknown>) => item.date || item.month || item.name),
        axisLine: {
          lineStyle: {
            color: theme.colors.border
          }
        },
        axisLabel: {
          color: theme.colors.textSecondary,
          fontFamily: component.config.fontFamily,
          fontSize: component.config.fontSize - 2
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: theme.colors.textSecondary,
          fontFamily: component.config.fontFamily,
          fontSize: component.config.fontSize - 2,
          formatter: (value: number) => {
            if (value >= 10000) {
              return (value / 10000).toFixed(0) + '万';
            }
            return value.toString();
          }
        },
        splitLine: {
          lineStyle: {
            color: theme.colors.grid,
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '资产总值',
          type: 'line',
          smooth: true,
          symbol: theme.name === 'luxury' ? 'circle' : 'emptyCircle',
          symbolSize: 8,
          lineStyle: {
            width: theme.name === 'luxury' ? 3 : 2,
            shadowColor: colors[0],
            shadowBlur: theme.name === 'luxury' ? 10 : 0
          },
          itemStyle: {
            borderWidth: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: colors[0] + '40' },
                { offset: 1, color: colors[0] + '05' }
              ]
            }
          },
          data: chartData.map((item: Record<string, unknown>) => item.value || item.income || 0)
        }
      ],
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };
  }, [data, component.config, theme]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-gray-400" style={{ color: theme.colors.textSecondary }}>
          加载中...
        </div>
      </div>
    );
  }

  return (
    <ReactECharts
      option={option}
      style={{ width: '100%', height: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
