import React from 'react';

import { LabKnowledgePremiumPanel } from './lab/LabKnowledgePremiumPanel';
import type { TestDefinition } from '../types';

interface TestKnowledgePanelProps {
  definition: TestDefinition;
}

/** @deprecated Use LabKnowledgePremiumPanel — kept for backward compatibility. */
export function TestKnowledgePanel({ definition }: TestKnowledgePanelProps) {
  return <LabKnowledgePremiumPanel definition={definition} />;
}
