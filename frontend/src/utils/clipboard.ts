import { Alert, Platform, Share } from 'react-native';

export async function copyToClipboard(text: string, successLabel = 'Copied'): Promise<void> {
  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    Alert.alert(successLabel);
    return;
  }
  try {
    await Share.share({ message: text });
  } catch {
    Alert.alert(successLabel);
  }
}

export function exportTextPlaceholder(title: string, body: string, isRTL: boolean): void {
  Alert.alert(
    title,
    isRTL ? 'سيتم تصدير المحادثة كملف PDF/CSV في الإصدار القادم.\n\n' + body.slice(0, 200) + '…' : 'Conversation export as PDF/CSV coming in the next release.\n\n' + body.slice(0, 200) + '…'
  );
}
