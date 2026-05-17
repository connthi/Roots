import { patchProgress } from './api.js';
import { loadProfile, saveProfile } from './profileSession.js';

/**
 * Merge local session profile into DB and optionally hydrate session from server profile.
 */
export async function syncProgressToServer(onboarding_step, localPatch = {}) {
  const merged = { ...loadProfile(), ...localPatch };
  saveProfile(merged);
  try {
    await patchProgress(onboarding_step, merged);
  } catch (err) {
    console.warn('[syncProgress]', err.message);
  }
  return merged;
}

export function hydrateSessionFromServer(serverProfile) {
  if (!serverProfile || typeof serverProfile !== 'object') return;
  const existing = loadProfile() ?? {};
  saveProfile({ ...serverProfile, ...existing });
}

export function getOnboardingRoute(step) {
  switch (step) {
    case 'personality':
      return '/survey';
    case 'deep_dive':
      return '/deep-dive';
    case 'complete':
      return '/dashboard';
    default:
      return '/home';
  }
}
