import React from 'react';

import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme } from '@/src/core/theme';

interface WorkspaceSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function WorkspaceSectionHeader({ title, subtitle, action }: WorkspaceSectionHeaderProps) {
  const theme = useTheme();

  return (
    <SectionHeader
      title={title}
      subtitle={subtitle}
      action={action}
      titleSize="h5"
      style={{ marginTop: theme.spacing[6], marginBottom: theme.spacing[4] }}
    />
  );
}
