/**
 * Development-only workspace visibility diagnostics (Phase 6D.3).
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Card } from '@/src/components/common/Card';
import { useTheme, useTypography } from '@/src/core/theme';

import { useAthleteWorkspaceContext } from '../../context/AthleteWorkspaceProvider';

export function WorkspaceVisibilityDiagnostics() {
  if (!__DEV__) return null;

  const theme = useTheme();
  const type = useTypography();
  const ctx = useAthleteWorkspaceContext();
  const { visibilityProfile } = ctx;

  return (
    <Card
      variant="ghost"
      padding="md"
      style={{
        marginTop: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.warning + '60',
        borderStyle: 'dashed',
      }}
    >
      <Text style={[type.captionBold, { color: theme.colors.warning, marginBottom: theme.spacing.sm }]}>
        DEV — Workspace visibility
      </Text>
      <Text style={[type.caption, { color: theme.colors.textSecondary }]}>Role: {visibilityProfile.workspaceRole}</Text>
      <Text style={[type.caption, { color: theme.colors.textSecondary }]}>
        Viewer: {visibilityProfile.viewerRole}
      </Text>
      <Text style={[type.caption, { color: theme.colors.textSecondary }]}>
        Data mode: {ctx.dataMode} · Cloud: {ctx.scientificCloudEnabled ? 'on' : 'off'}
      </Text>
      <Text style={[type.caption, { color: theme.colors.textSecondary }]}>
        Permissions: {visibilityProfile.effectivePermissions.join(', ') || 'none'}
      </Text>
      <Text style={[type.caption, { color: theme.colors.textSecondary }]}>
        Hidden passport sections: {visibilityProfile.hiddenPassportSections}
      </Text>
      <Text style={[type.caption, { color: theme.colors.textSecondary }]}>
        Hidden timeline events: {visibilityProfile.hiddenTimelineEvents}
      </Text>
      <Text style={[type.caption, { color: theme.colors.textSecondary }]}>
        Cloud sessions loaded: {ctx.cloudSessions.length}
      </Text>
    </Card>
  );
}
