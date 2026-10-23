// Title rules (BR1.1 to BR1.3, BR1.15): a pure check, no storage and no network.
// The only place in the app that counts title characters.

export const MAX_TITLE_LENGTH = 200;

// One segmenter for the whole app; it splits text into user-perceived
// characters (an emoji or a letter with an accent counts once).
const segmenter =
  typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function' ? new Intl.Segmenter() : null;

/**
 * Count the visible characters of a text.
 * Uses the browser's text segmenter; falls back to a code point count where it is missing.
 */
export function countVisibleCharacters(text) {
  if (segmenter) {
    return Array.from(segmenter.segment(text)).length;
  }
  return Array.from(text).length;
}

/**
 * Check a title typed by the person.
 * @param {unknown} rawTitle
 * @returns {{ ok: true, title: string } | { ok: false, reason: 'empty' | 'too-long' }}
 */
export function checkTitle(rawTitle) {
  const title = typeof rawTitle === 'string' ? rawTitle.trim() : '';
  if (title.length === 0) {
    return { ok: false, reason: 'empty' };
  }
  if (countVisibleCharacters(title) > MAX_TITLE_LENGTH) {
    return { ok: false, reason: 'too-long' };
  }
  return { ok: true, title };
}
