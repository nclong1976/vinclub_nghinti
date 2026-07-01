// ============================================================
// src/components/UserCSKH.tsx
// Wrapper — chuyển sang hệ thống Live Chat mới
// ============================================================

import UserChatView from './chat/UserChatView';

export default function UserCSKH({ onBack, onNavigateToAdmin }: {
  onBack: () => void;
  onNavigateToAdmin?: () => void;
}) {
  return <UserChatView onBack={onBack} />;
}
