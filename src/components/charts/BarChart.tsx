import { useEffect, useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { fetchDataSource } from '@/utils/api';
import type { CanvasComponent, ThemeConfig } from '@shared/index';

interface BarChartProps {
  component: CanvasComponent;
  theme: ThemeConfig;
}

export function BarChart({ component, theme }: BarChartProps) {
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

    const isDoubleSeries = component.dataBinding.dataSource === 'allocation' || 
                          component.dataBinding.dataSource === 'monthly-income';

    const series: EChartsOption['series'] = isDoubleSeries 
      ? [
          {
            name: '当前',
            type: 'bar',
            barWidth: theme.name === 'luxury' ? 12 : 16,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: colors[0] },
                  { offset: 1, color: colors[0] + '80' }
                ]
              },
              borderRadius: [theme.name === 'luxury' ? 6 : 4, theme.name === 'luxury' ? 6 : 4, 0, 0]
            },
            data: chartData.map((item: Record<string, unknown>) => item.current || item.income || 0)
          },
          {
            name: component.dataBinding.dataSource === 'allocation' ? '目标' : '支出',
            type: 'bar',
            barWidth: theme.name === 'luxury' ? 12 : 16,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: colors[1] },
                  { offset: 1, color: colors[1] + '80' }
                ]
              },
              borderRadius: [theme.name === 'luxury' ? 6 : 4, theme.name === 'luxury' ? 6 : 4, 0, 0]
            },
            data: chartData.map((item: Record<string, unknown>) => item.target || item.expense || 0)
          }
        ]
      : [
          {
            name: '数值',
            type: 'bar',
            barWidth: theme.name === 'luxury' ? 20 : 24,
            itemStyle: {
              color: (params: unknown) => {
                const p = params as { dataIndex: number };
                const colorIndex = p.dataIndex % colors.length;
                return {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: colors[colorIndex] },
                    { offset: 1, color: colors[colorIndex] + '80' }
                  ]
                };
              },
              borderRadius: [theme.name === 'luxury' ? 8 : 4, theme.name === 'luxury' ? 8 : 4, 0, 0]
            },
            emphasis: {
              itemStyle: {
                shadowBlur: theme.name === 'luxury' ? 15 : 8,
                shadowColor: 'rgba(0,0,0,0.3)'
              }
            },
            data: chartData.map((item: Record<string, unknown>) => item.income || item.value || item.rate || 0)
          }
        ];

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
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: theme.name === 'luxury' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)',
        borderColor: theme.colors.border,
        borderWidth: 1,
        textStyle: {
          color: theme.colors.text
        }
      },
      legend: component.config.showLegend && isDoubleSeries ? {
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
        bottom: component.config.showLegend && isDoubleSeries ? 50 : 30,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.map((item: Record<string, unknown>) => 
          item.category || item.type || item.name || item.month || ''
        ),
        axisLine: {
          lineStyle: {
            color: theme.colors.border
          }
        },
        axisLabel: {
          color: theme.colors.textSecondary,
          fontFamily: component.config.fontFamily,
          fontSize: component.config.fontSize - 2,
          interval: 0,
          rotate: chartData.length > 5 ? 30 : 0
        },
        axisTick: {
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
      series,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      animationDelay: (idx: number) => idx * 100
    };
  }, [data, component.config, component.dataBinding, theme]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse" style={{ color: theme.colors.textSecondary }}>
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
