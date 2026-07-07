/**
 * Reusable report formatting — separate from report generation (Phase 7.3).
 */

import type { BilingualText } from '../../models/common';
import type { ScientificReport, ScientificReportSection } from '../../models/report';
import type { ExportLocaleMode } from '../models/ExportDomain';

export type FormattedBlockType =
  | 'title'
  | 'section_heading'
  | 'paragraph'
  | 'bullet_list'
  | 'metric_card'
  | 'chart_placeholder'
  | 'ssid_block'
  | 'reference_list'
  | 'signature'
  | 'disclaimer';

export interface FormattedExportBlock {
  block_type: FormattedBlockType;
  content: string;
  content_secondary?: string | null;
  order: number;
}

export interface FormattedExportDocument {
  report_id: string;
  title: string;
  subtitle: string;
  locale_mode: ExportLocaleMode;
  blocks: FormattedExportBlock[];
  metric_cards: Array<{ label: string; value: string }>;
  disclaimer: string;
}

function pickText(text: BilingualText, mode: ExportLocaleMode): string {
  if (mode === 'ar') return text.ar;
  if (mode === 'en') return text.en;
  return `${text.en}\n${text.ar}`;
}

function sectionToBlocks(
  section: ScientificReportSection,
  mode: ExportLocaleMode,
  orderStart: number
): FormattedExportBlock[] {
  const blocks: FormattedExportBlock[] = [];
  let order = orderStart;

  blocks.push({
    block_type: 'section_heading',
    content: pickText(section.title, mode),
    order: order++,
  });

  if (section.section_id === 'ssid_interpretation' || section.section_id === 'normative_comparison') {
    blocks.push({
      block_type: 'ssid_block',
      content: pickText(section.body, mode),
      order: order++,
    });
    return blocks;
  }

  if (section.section_id === 'references') {
    blocks.push({
      block_type: 'reference_list',
      content: pickText(section.body, mode),
      order: order++,
    });
    return blocks;
  }

  if (section.section_id === 'signature') {
    blocks.push({
      block_type: 'signature',
      content: pickText(section.body, mode),
      order: order++,
    });
    return blocks;
  }

  if (section.section_id === 'evidence_limitations') {
    blocks.push({
      block_type: 'disclaimer',
      content: pickText(section.body, mode),
      order: order++,
    });
    return blocks;
  }

  if (section.section_id === 'performance_summary' || section.section_id === 'passport_summary') {
    blocks.push({
      block_type: 'metric_card',
      content: pickText(section.body, mode),
      order: order++,
    });
    blocks.push({
      block_type: 'chart_placeholder',
      content: mode === 'ar' ? '[رسم بياني — placeholder]' : '[Chart — placeholder]',
      order: order++,
    });
    return blocks;
  }

  blocks.push({
    block_type: 'paragraph',
    content: pickText(section.body, mode),
    order: order++,
  });

  if (section.bullet_points.length > 0) {
    blocks.push({
      block_type: 'bullet_list',
      content: section.bullet_points.map((bp) => `• ${pickText(bp, mode)}`).join('\n'),
      order: order++,
    });
  }

  return blocks;
}

/** Format scientific report into reusable export blocks. */
export function formatReportForExport(
  report: ScientificReport,
  localeMode: ExportLocaleMode,
  sectionIds?: string[]
): FormattedExportDocument {
  const sections = sectionIds
    ? report.sections.filter((s) => sectionIds.includes(s.section_id) && !s.is_empty)
    : report.sections.filter((s) => !s.is_empty);

  const blocks: FormattedExportBlock[] = [
    {
      block_type: 'title',
      content: pickText(report.title, localeMode),
      order: 0,
    },
  ];

  let order = 1;
  const metricCards: Array<{ label: string; value: string }> = [];

  for (const section of sections) {
    if (section.section_id === 'cover') continue;
    const sectionBlocks = sectionToBlocks(section, localeMode, order);
    blocks.push(...sectionBlocks);
    order += sectionBlocks.length;

    if (section.section_id === 'executive_summary') {
      metricCards.push({
        label: localeMode === 'ar' ? 'مستوى الأدلة' : 'Evidence tier',
        value: report.evidence_summary.primary_tier,
      });
    }
  }

  return {
    report_id: report.report_id,
    title: pickText(report.title, localeMode),
    subtitle: `${report.date_range.from} → ${report.date_range.to}`,
    locale_mode: localeMode,
    blocks,
    metric_cards: metricCards,
    disclaimer: pickText(report.evidence_summary.disclaimer, localeMode),
  };
}
