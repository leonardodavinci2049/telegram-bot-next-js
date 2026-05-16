/**
 * Cache configuration for Next.js 16 'use cache' directive
 * Defines cache tags for granular cache invalidation with cacheTag()
 *
 * Cache profiles are defined in next.config.ts:
 * - "hours": 1 hour cache (logs)
 * - "frequent": 5 minutes cache (promo links)
 */

// Cache tags for granular invalidation with cacheTag()
export const CACHE_TAGS = {
  // Promo link dynamic tag generators
  promoLinksByClient: (clientId: string) => `promo-links-client-${clientId}`,
  promoLinksByApp: (clientId: string, appId: string) =>
    `promo-links-client-${clientId}-app-${appId}`,
  promoLinksByType: (clientId: string, typeId: string) =>
    `promo-links-client-${clientId}-type-${typeId}`,
  promoLinksByAppAndType: (clientId: string, appId: string, typeId: string) =>
    `promo-links-client-${clientId}-app-${appId}-type-${typeId}`,

  // Static tags
  promoLinks: "promo-links",
  logLogins: "log-logins",
  logOperations: "log-operations",
} as const;

// Cache life profiles (matching next.config.ts cacheLife)
export const CACHE_PROFILES = {
  hours: "hours", // 1 hour - logs
  frequent: "frequent", // 5 minutes - promo links
} as const;

// Type helpers
export type CacheTagKey = keyof typeof CACHE_TAGS;
export type CacheProfile = keyof typeof CACHE_PROFILES;
