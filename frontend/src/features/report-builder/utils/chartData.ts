import type { MockReportSections } from '@/src/data/mock/types';
import type { RadarAxis } from '@/src/components/charts/RadarChart';

function parseScoreLines(text?: string): Array<{ label: string; value: number }> {
  if (!text?.trim()) return [];
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const paren = line.match(/\((\d+)\)/);
      const pct = line.match(/(\d+)\s*%/);
      const value = paren ? Number(paren[1]) : pct ? Number(pct[1]) : 50;
      const label = line
        .replace(/\s*\(\d+\)\s*$/, '')
        .replace(/:\s*\d+\s*%.*$/, '')
        .replace(/^•\s*/, '')
        .trim();
      return { label: label || line.slice(0, 24), value: Math.min(100, Math.max(0, value)) };
    });
}

function parseKpiLines(text?: string): Array<{ label: string; value: number }> {
  if (!text?.trim()) return [];
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const pct = line.match(/(\d+)\s*%/);
      const num = line.match(/(\d+)\s*\/\s*(\d+)/);
      const value = pct ? Number(pct[1]) : num ? Math.round((Number(num[1]) / Number(num[2])) * 100) : 50;
      const label = line.split(':')[0]?.replace(/^•\s*/, '').trim() || line.slice(0, 20);
      return { label, value: Math.min(100, Math.max(0, value)) };
    });
}

export interface ReportChartData {
  radarAxes: RadarAxis[];
  barValues: number[];
  barLabels: string[];
}

export function buildReportChartData(
  sections: MockReportSections,
  labels?: { performance: string; recovery: string; load: string }
): ReportChartData {
  const strengths = parseScoreLines(sections.strengths);
  const weaknesses = parseScoreLines(sections.weaknesses);
  const kpis = parseKpiLines(sections.kpi_summary);

  const radarSource =
    strengths.length >= 3
      ? strengths.slice(0, 5)
      : kpis.length >= 3
        ? kpis.slice(0, 5)
        : [...strengths, ...weaknesses].slice(0, 5);

  const fallbackLabels = labels ?? { performance: 'Performance', recovery: 'Recovery', load: 'Load' };

  const radarAxes: RadarAxis[] =
    radarSource.length > 0
      ? radarSource.map((item) => ({ label: item.label, value: item.value, max: 100 }))
      : [
          { label: fallbackLabels.performance, value: 72, max: 100 },
          { label: fallbackLabels.recovery, value: 68, max: 100 },
          { label: fallbackLabels.load, value: 64, max: 100 },
        ];

  const barSource = strengths.length > 0 || weaknesses.length > 0 ? [...strengths, ...weaknesses] : kpis.slice(0, 4);
  const barValues = barSource.map((item) => item.value);
  const barLabels = barSource.map((item) => item.label);

  return { radarAxes, barValues, barLabels };
}
