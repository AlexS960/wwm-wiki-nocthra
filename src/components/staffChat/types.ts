export interface StaffMemberView {
  id: string;
  displayName: string;
  username: string;
  role: string;
  roleName: string;
  roleColor: string;
  picture?: string;
}

export interface StaffConversation {
  key: string;
  type: 'dm' | 'group';
  title: string;
  subtitle?: string;
  lastMsg: string;
  ts: number;
  unread: number;
  themeId: string;
  partnerId?: string;
  roomId?: string;
  memberCount?: number;
}
