/**
 * backend/src/validators/titleValidator.js
 *
 * Title validation rules mirroring the frontend specification (BR-3).
 * Enforces boundary input validation: trimmed title between 1 and 200 characters.
 */

export const MIN_TITLE_LENGTH = 1;
export const MAX_TITLE_LENGTH = 200;

// Grapheme cluster segmenter for counting user-perceived visible characters
const segmenter =
  typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter()
    : null;

/**
 * Counts visible characters (grapheme clusters) of text.
 * Falls back to Array.from (code points) if Intl.Segmenter is not available.
 * @param {string} text
 * @returns {number}
 */
export function countVisibleCharacters(text) {
  if (typeof text !== 'string') {
    return 0;
  }
  if (segmenter) {
    return Array.from(segmenter.segment(text)).length;
  }
  return Array.from(text).length;
}

/**
 * Validates a task title against boundary rules (BR-3):
 * 1. Must be a string.
 * 2. Trimmed length must be at least 1 character.
 * 3. Trimmed length must not exceed 200 visible characters.
 *
 * @param {unknown} rawTitle
 * @returns {{ valid: true, ok: true, title: string } | { valid: false, ok: false, error: string, reason: 'empty' | 'too-long' | 'invalid-type' }}
 */
export function validateTitle(rawTitle) {
  if (typeof rawTitle !== 'string') {
    return {
      valid: false,
      ok: false,
      error: 'Title is required and must be a string',
      reason: 'empty',
    };
  }

  const title = rawTitle.trim();

  if (title.length === 0) {
    return {
      valid: false,
      ok: false,
      error: 'Title cannot be empty',
      reason: 'empty',
    };
  }

  const visibleLength = countVisibleCharacters(title);

  if (visibleLength > MAX_TITLE_LENGTH) {
    return {
      valid: false,
      ok: false,
      error: `Title cannot exceed ${MAX_TITLE_LENGTH} characters`,
      reason: 'too-long',
    };
  }

  return {
    valid: true,
    ok: true,
    title,
  };
}

// Alias to mirror frontend titleRules.checkTitle interface
export const checkTitle = validateTitle;

/**
 * Express middleware for validating task title in request body.
 * Responds with 400 and an error payload if invalid (BR-3, BR-4).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function validateTitleMiddleware(req, res, next) {
  const result = validateTitle(req.body?.title);

  if (!result.valid) {
    return res.status(400).json({
      error: result.error,
      reason: result.reason,
    });
  }

  // Normalize trimmed title on req.body for downstream services
  req.body.title = result.title;
  req.validatedTitle = result.title;
  next();
}

export const titleValidatorMiddleware = validateTitleMiddleware;
