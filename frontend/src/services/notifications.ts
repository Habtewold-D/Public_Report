import axios from 'axios';

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'new_issue' | 'status_update' | string;
  issue_id: number;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function listNotifications() {
  const res = await axios.get<{ data: NotificationItem[] }>('/notifications');
  return res.data.data;
}

export async function markNotificationRead(id: number) {
  await axios.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead() {
  await axios.post('/notifications/read-all');
}
