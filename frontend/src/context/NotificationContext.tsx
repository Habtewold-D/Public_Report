import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { initEcho, disconnectEcho, getEcho } from '@/lib/echo';
import { listNotifications, markAllNotificationsRead, markNotificationRead, type NotificationItem } from '@/services/notifications';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: listNotifications,
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) setNotifications(data);
  }, [data]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.is_read).length, [notifications]);

  // Echo init + channel subscription (stabilized to avoid resub loops)
  const currentChannelRef = useRef<string | null>(null);
  useEffect(() => {
    if (!user?.id || !role) {
      // Leave any previous channel when logging out
      if (currentChannelRef.current) {
        try { getEcho()?.leave(currentChannelRef.current); } catch {}
        currentChannelRef.current = null;
      }
      disconnectEcho();
      setNotifications([]);
      return;
    }
    const token = localStorage.getItem('civic_token');
    if (!token) return;

    const echo = initEcho(token);
    // Echo.private() automatically prefixes 'private-'
    const nextChannel = role === 'sector' ? `sector.${user.id}` : `user.${user.id}`;

    // If already subscribed to the intended channel, do nothing
    if (currentChannelRef.current === nextChannel) return;

    // Leave previous channel if different
    if (currentChannelRef.current) {
      try { getEcho()?.leave(currentChannelRef.current); } catch {}
    }

    const channel = echo.private(nextChannel);
    currentChannelRef.current = nextChannel;

    const handleIncoming = (payload: { notification?: NotificationItem } | NotificationItem) => {
      const n: NotificationItem = (payload as { notification?: NotificationItem }).notification ?? (payload as NotificationItem);
      setNotifications((prev) => {
        if (prev.some(p => p.id === n.id)) return prev; // dedupe
        return [n, ...prev];
      });
    };

    channel.listen('.new-issue', handleIncoming);
    channel.listen('.status-updated', handleIncoming);

    return () => {
      // Only leave if we are still on this channel when unmounting/changing
      if (currentChannelRef.current === nextChannel) {
        try { getEcho()?.leave(nextChannel); } catch {}
        currentChannelRef.current = null;
      }
    };
  }, [user?.id, role]);

  const markAsRead = useCallback(async (id: number) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n));
    queryClient.setQueryData(['notifications'], (old: unknown) => {
      if (!Array.isArray(old)) return old as unknown;
      return (old as NotificationItem[]).map((n) => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n);
    });
  }, [queryClient]);

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => n.is_read ? n : { ...n, is_read: true, read_at: new Date().toISOString() }));
    queryClient.setQueryData(['notifications'], (old: unknown) => {
      if (!Array.isArray(old)) return old as unknown;
      return (old as NotificationItem[]).map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }));
    });
  }, [queryClient]);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  }), [notifications, unreadCount, isLoading, markAsRead, markAllAsRead]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
