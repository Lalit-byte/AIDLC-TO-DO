import { describe, it, expect, vi } from 'vitest';
import {
  validateTitle,
  checkTitle,
  countVisibleCharacters,
  validateTitleMiddleware,
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
} from '../src/validators/titleValidator.js';

describe('titleValidator.validateTitle (BR-3)', () => {
  it('accepts a normal title and returns it trimmed', () => {
    const result = validateTitle('  Buy groceries  ');
    expect(result).toEqual({
      valid: true,
      ok: true,
      title: 'Buy groceries',
    });
  });

  it('preserves checkTitle as an alias for frontend parity', () => {
    const result = checkTitle('Walk the dog');
    expect(result).toEqual({
      valid: true,
      ok: true,
      title: 'Walk the dog',
    });
  });

  it('preserves internal whitespace between words', () => {
    const result = validateTitle('Read   chapter   1');
    expect(result).toEqual({
      valid: true,
      ok: true,
      title: 'Read   chapter   1',
    });
  });

  it('rejects an empty string', () => {
    const result = validateTitle('');
    expect(result.valid).toBe(false);
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('empty');
    expect(result.error).toBe('Title cannot be empty');
  });

  it('rejects whitespace-only strings (spaces, tabs, newlines)', () => {
    const result = validateTitle('   \t\n  ');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('empty');
    expect(result.error).toBe('Title cannot be empty');
  });

  it('rejects non-string values (undefined, null, numbers, objects)', () => {
    expect(validateTitle(undefined)).toEqual({
      valid: false,
      ok: false,
      error: 'Title is required and must be a string',
      reason: 'empty',
    });

    expect(validateTitle(null)).toEqual({
      valid: false,
      ok: false,
      error: 'Title is required and must be a string',
      reason: 'empty',
    });

    expect(validateTitle(123)).toEqual({
      valid: false,
      ok: false,
      error: 'Title is required and must be a string',
      reason: 'empty',
    });

    expect(validateTitle({})).toEqual({
      valid: false,
      ok: false,
      error: 'Title is required and must be a string',
      reason: 'empty',
    });

    expect(validateTitle(['task'])).toEqual({
      valid: false,
      ok: false,
      error: 'Title is required and must be a string',
      reason: 'empty',
    });
  });

  describe('boundary length rules (1-200 chars)', () => {
    it('accepts a title of minimum length (1 char)', () => {
      const result = validateTitle('A');
      expect(result.valid).toBe(true);
      expect(result.title).toBe('A');
    });

    it('accepts a title of exactly 200 characters', () => {
      const title = 'x'.repeat(MAX_TITLE_LENGTH);
      const result = validateTitle(title);
      expect(result.valid).toBe(true);
      expect(result.title).toBe(title);
    });

    it('rejects a title of 201 characters', () => {
      const title = 'x'.repeat(MAX_TITLE_LENGTH + 1);
      const result = validateTitle(title);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('too-long');
      expect(result.error).toBe(`Title cannot exceed ${MAX_TITLE_LENGTH} characters`);
    });

    it('evaluates character count AFTER trimming whitespace', () => {
      const title200 = 'x'.repeat(200);
      const paddedTitle = `   ${title200}   `;
      const result = validateTitle(paddedTitle);
      expect(result.valid).toBe(true);
      expect(result.title).toBe(title200);
    });

    it('rejects a padded title if the trimmed content exceeds 200 characters', () => {
      const title201 = 'x'.repeat(201);
      const paddedTitle = `   ${title201}   `;
      const result = validateTitle(paddedTitle);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('too-long');
    });
  });

  describe('visible character & Unicode grapheme counting', () => {
    it('accurately counts emojis as single visible characters', () => {
      expect(countVisibleCharacters('🎉')).toBe(1);
      expect(countVisibleCharacters('🚀')).toBe(1);
      expect(countVisibleCharacters('🎉🚀')).toBe(2);

      const emoji200 = '🎯'.repeat(200);
      expect(validateTitle(emoji200).valid).toBe(true);

      const emoji201 = '🎯'.repeat(201);
      const result = validateTitle(emoji201);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('too-long');
    });

    it('accurately counts accented characters with combining marks', () => {
      // 'e\u0301' is 'é' composed of 2 code units but 1 visible grapheme
      const combinedE = 'e\u0301';
      expect(countVisibleCharacters(combinedE)).toBe(1);

      const combined200 = combinedE.repeat(200);
      expect(validateTitle(combined200).valid).toBe(true);
    });

    it('returns 0 for non-string inputs in countVisibleCharacters', () => {
      expect(countVisibleCharacters(null)).toBe(0);
      expect(countVisibleCharacters(undefined)).toBe(0);
      expect(countVisibleCharacters(123)).toBe(0);
    });

    it('falls back to code point counting when Intl.Segmenter is absent', async () => {
      vi.resetModules();
      vi.stubGlobal('Intl', { ...Intl, Segmenter: undefined });

      const fallback = await import('../src/validators/titleValidator.js');
      expect(fallback.countVisibleCharacters('😀a')).toBe(2);
      expect(fallback.validateTitle('a'.repeat(201)).valid).toBe(false);

      vi.unstubAllGlobals();
    });
  });

  describe('special characters and tags', () => {
    it('accepts HTML and special characters as valid plain text', () => {
      const markup = '<script>alert("test")</script>';
      const result = validateTitle(markup);
      expect(result.valid).toBe(true);
      expect(result.title).toBe(markup);
    });

    it('accepts symbols and quotes', () => {
      const special = 'Fix: item "A" & item \'B\' -> $100!';
      const result = validateTitle(special);
      expect(result.valid).toBe(true);
      expect(result.title).toBe(special);
    });
  });
});

describe('titleValidatorMiddleware (Express Middleware)', () => {
  it('calls next() and sets trimmed title when valid', () => {
    const req = { body: { title: '  Prepare presentation  ' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    validateTitleMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(req.body.title).toBe('Prepare presentation');
    expect(req.validatedTitle).toBe('Prepare presentation');
  });

  it('responds with 400 when title is missing or empty', () => {
    const req = { body: { title: '   ' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    validateTitleMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Title cannot be empty',
      reason: 'empty',
    });
  });

  it('responds with 400 when title exceeds 200 characters', () => {
    const req = { body: { title: 'z'.repeat(201) } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    validateTitleMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Title cannot exceed 200 characters',
      reason: 'too-long',
    });
  });

  it('responds with 400 when req.body is undefined', () => {
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    validateTitleMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Title is required and must be a string',
      reason: 'empty',
    });
  });
});
