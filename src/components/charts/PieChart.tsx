import { useEffect, useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { fetchDataSource } from '@/utils/api';
import type { CanvasComponent, ThemeConfig } from '@shared/index';

interface PieChartProps {
  component: CanvasComponent;
  theme: ThemeConfig;
}

export function PieChart({ component, theme }: PieChartProps) {
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

    const pieData = chartData.map((item: Record<string, unknown>, index: number) => ({
      value: (item.value || item.percentage || 0) as number,
      name: (item.name || item.type || `项目${index + 1}`) as string,
      itemStyle: {
        color: colors[index % colors.length]
      }
    }));

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
        trigger: 'item',
        backgroundColor: theme.name === 'luxury' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)',
        borderColor: theme.colors.border,
        borderWidth: 1,
        textStyle: {
          color: theme.colors.text
        },
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number; percent: number };
          return `<div style="padding: 4px 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${p.name}</div>
            <div>数值: <span style="font-weight: 600;">${p.value.toLocaleString()}</span></div>
            <div>占比: <span style="font-weight: 600;">${p.percent}%</span></div>
          </div>`;
        }
      },
      legend: component.config.showLegend ? {
        orient: theme.name === 'luxury' ? 'vertical' : 'horizontal',
        right: theme.name === 'luxury' ? 10 : 'center',
        top: theme.name === 'luxury' ? 'center' : 'bottom',
        textStyle: {
          color: theme.colors.textSecondary,
          fontFamily: component.config.fontFamily,
          fontSize: component.config.fontSize - 2
        },
        itemWidth: 12,
        itemHeight: 12,
        padding: [10, 20]
      } : undefined,
      series: [
        {
          name: component.config.title,
          type: 'pie',
          radius: theme.name === 'luxury' ? ['45%', '70%'] : ['50%', '75%'],
          center: theme.name === 'luxury' ? ['35%', '55%'] : ['50%', component.config.showTitle ? '55%' : '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: theme.name === 'luxury' ? 8 : 4,
            borderColor: theme.name === 'luxury' ? theme.colors.cardBg : '#fff',
            borderWidth: theme.name === 'luxury' ? 3 : 2
          },
          label: {
            show: true,
            position: theme.name === 'luxury' ? 'outside' : 'outside',
            formatter: '{b}\n{d}%',
            color: theme.colors.text,
            fontFamily: component.config.fontFamily,
            fontSize: component.config.fontSize - 2,
            lineHeight: 16
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 10,
            lineStyle: {
              color: theme.colors.border,
              width: 1
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: theme.name === 'luxury' ? 20 : 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            scale: true,
            scaleSize: 10
          },
          data: pieData
        }
      ],
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };
  }, [data, component.config, theme]);

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
