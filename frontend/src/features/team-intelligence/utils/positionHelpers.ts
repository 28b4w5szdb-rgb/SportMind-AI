import type { PositionGroupId } from '../types';

const GROUP_PATTERNS: Array<{ id: PositionGroupId; patterns: RegExp[] }> = [
  { id: 'goalkeeper', patterns: [/goal/i, /keeper/i, /gk/i, /حارس/] },
  { id: 'defender', patterns: [/defend/i, /back/i, /cb/i, /lb/i, /rb/i, /مداف/i] },
  { id: 'midfielder', patterns: [/mid/i, /wing/i, /cm/i, /dm/i, /am/i, /وسط/] },
  { id: 'forward', patterns: [/forward/i, /striker/i, /winger/i, /cf/i, /fw/i, /مهاج/] },
];

export function resolvePositionGroup(position: string): PositionGroupId {
  const p = position.trim();
  for (const group of GROUP_PATTERNS) {
    if (group.patterns.some((rx) => rx.test(p))) return group.id;
  }
  return 'midfielder';
}

export const POSITION_GROUPS: PositionGroupId[] = ['defender', 'midfielder', 'forward', 'goalkeeper'];

export function positionGroupLabelKey(id: PositionGroupId): string {
  return `teamIntelligence.positions.${id}`;
}
