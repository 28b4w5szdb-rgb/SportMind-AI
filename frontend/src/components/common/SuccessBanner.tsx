import React from 'react';

import { AlertBanner } from './AlertBanner';

interface SuccessBannerProps {
  message: string;
  visible: boolean;
}

export function SuccessBanner({ message, visible }: SuccessBannerProps) {
  return <AlertBanner message={message} variant="success" visible={visible} />;
}
