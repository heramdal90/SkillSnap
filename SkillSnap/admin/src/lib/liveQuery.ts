/** Background refresh while the admin tab is open (live operational feel). */
export const LIVE_POLL_MS = 20_000;

/** Use on admin data queries together with queryKey/queryFn. */
export const liveQueryOptions = {
  refetchInterval: LIVE_POLL_MS,
  refetchOnReconnect: true,
} as const;
