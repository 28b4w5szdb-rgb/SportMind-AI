/**
 * Firebase Cloud Messaging placeholder.
 * FCM requires native setup (Phase 6B+) — not wired in v0.9 alpha foundation.
 */

export type CloudMessaging = null;

export function getCloudMessaging(): CloudMessaging {
  return null;
}

export const messagingStatus = {
  supported: false,
  reason: 'FCM integration deferred to Phase 6B (native push setup required).',
} as const;
