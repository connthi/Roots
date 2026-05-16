const STORAGE_KEY = 'roots_profile';

/**
 * @returns {object | null}
 */
export function loadProfile() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * @param {object} patch
 */
export function saveProfile(patch) {
  const existing = loadProfile() ?? {};
  const next = { ...existing, ...patch };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function hasPersonalityQuiz() {
  const data = loadProfile();
  return Boolean(data?.archetype?.code);
}

export function hasDeepDive() {
  const data = loadProfile();
  return Boolean(data?.deepDive);
}

export function clearProfile() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem('roots_deep_dive_dismissed');
}

export function getArchetypeProfile(data) {
  const result = data?.archetype;
  if (!result?.code) return null;
  const meta = result.archetype ?? {};
  return {
    code: result.code,
    name: meta.name ?? result.name,
    vibe: meta.vibe,
    traits: meta.traits,
  };
}
