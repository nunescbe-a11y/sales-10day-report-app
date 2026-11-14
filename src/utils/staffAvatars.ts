import { DEFAULT_AVATARS, AVATAR_YAZHINI, AVATAR_NAVEENA, AVATAR_JANANI } from './staffAvatarsData';

export { DEFAULT_AVATARS, AVATAR_YAZHINI, AVATAR_NAVEENA, AVATAR_JANANI };

/**
 * Returns the profile photo for any staff member by matching their name, ID, or username.
 * Guaranteed to return an embedded high-resolution Base64 data URI for Yazhini, Naveena, and Janani
 * with ZERO network requests, ZERO 404 errors, and full offline resilience.
 */
export function getStaffAvatarUrl(
  nameOrId?: string | null,
  reps?: Array<{ name?: string; id?: string; username?: string; displayName?: string; avatarUrl?: string }>
): string | undefined {
  if (!nameOrId) return undefined;
  const clean = nameOrId.toLowerCase().trim();

  // 1. Direct match to 100% reliable embedded Base64 portraits
  if (clean.includes('yazhini')) return AVATAR_YAZHINI;
  if (clean.includes('naveena')) return AVATAR_NAVEENA;
  if (clean.includes('janani')) return AVATAR_JANANI;

  // 2. Check dynamic reps list (e.g. if an admin added a new staff member with a custom uploaded photo)
  if (reps && reps.length > 0) {
    const matched = reps.find((r) => {
      const rName = r.name?.toLowerCase().trim() || '';
      const rId = r.id?.toLowerCase().trim() || '';
      const rUser = r.username?.toLowerCase().trim() || '';
      const rDisp = r.displayName?.toLowerCase().trim() || '';
      return (
        clean === rName ||
        clean === rId ||
        clean === rUser ||
        clean === rDisp ||
        clean.includes(rName) ||
        rName.includes(clean)
      );
    });

    if (matched?.avatarUrl && matched.avatarUrl.startsWith('data:image')) {
      return matched.avatarUrl;
    }
  }

  // 3. Fallback scan of DEFAULT_AVATARS keys
  for (const [key, url] of Object.entries(DEFAULT_AVATARS)) {
    if (clean.includes(key)) {
      return url;
    }
  }

  return undefined;
}
