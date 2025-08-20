import Echo, { type Channel } from 'laravel-echo';
import Pusher from 'pusher-js';

let echo: Echo<Channel> | null = null;

export function initEcho(token: string) {
  if (echo) return echo;
  (window as any).Pusher = Pusher;
  // Enable verbose Pusher logs for debugging
  try { (Pusher as unknown as { logToConsole?: boolean }).logToConsole = true; } catch {}

  const key = import.meta.env.VITE_PUSHER_APP_KEY as string;
  const cluster = (import.meta.env.VITE_PUSHER_APP_CLUSTER as string) || 'mt1';
  const host = (import.meta.env.VITE_PUSHER_HOST as string) || undefined;
  const port = (import.meta.env.VITE_PUSHER_PORT as string) || undefined;
  const forceTLSRaw = (import.meta.env.VITE_PUSHER_FORCE_TLS as string | boolean | undefined) ?? 'true';
  const forceTLS = forceTLSRaw === 'false' ? false : Boolean(forceTLSRaw);

  // Debug env
  // eslint-disable-next-line no-console
  console.debug('[echo:init] env', { key: !!key, cluster, host, port, forceTLS });

  const baseOptions: Record<string, unknown> = {
    broadcaster: 'pusher',
    key,
    cluster,
    forceTLS,
    enabledTransports: ['ws', 'wss'],
    // Use a custom authorizer with Bearer token to avoid CSRF 419s
    authorizer: (channel: Channel) => {
      return {
        authorize: (socketId: string, callback: (error: boolean, data: unknown) => void) => {
          // eslint-disable-next-line no-console
          console.debug('[echo:authorize] channel', channel.name, 'socket', socketId);
          const body = new URLSearchParams({
            channel_name: channel.name,
            socket_id: socketId,
          });
          fetch('http://127.0.0.1:8000/broadcasting/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              'Accept': 'application/json',
              'X-Socket-Id': socketId,
              Authorization: `Bearer ${token}`,
            },
            body: body.toString(),
          })
            .then(async (res) => {
              if (!res.ok) {
                const text = await res.text().catch(() => '');
                // eslint-disable-next-line no-console
                console.error('[echo:authorize] failed', res.status, text);
                throw new Error('Auth failed');
              }
              const data = await res.json();
              // eslint-disable-next-line no-console
              console.debug('[echo:authorize] success');
              callback(false, data);
            })
            .catch((err) => callback(true, err));
        },
      } as unknown as { authorize: (socketId: string, callback: (error: boolean, data: unknown) => void) => void };
    },
  };

  // Only set wsHost/ports if a custom host is provided. If not, let Pusher default to cluster hosts.
  if (host) {
    baseOptions.wsHost = host;
    if (port) {
      const p = Number(port);
      baseOptions.wsPort = p;
      baseOptions.wssPort = p;
    }
  }

  // eslint-disable-next-line no-console
  console.debug('[echo:init] options', baseOptions);
  echo = new Echo<Channel>(baseOptions as unknown as any);

  return echo;
}

export function getEcho(): Echo<Channel> | null {
  return echo;
}

export function disconnectEcho() {
  if (echo) {
    try {
      echo.disconnect();
    } catch (_e) {
      // ignore
    }
    echo = null;
  }
}
