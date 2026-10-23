import { describe, expect, it, vi } from 'vitest';
import { checkTitle, countVisibleCharacters, MAX_TITLE_LENGTH } from './titleRules.js';

describe('titleRules.checkTitle', () => {
  it('accepts a normal title and returns it trimmed (BR1.1)', () => {
    expect(checkTitle('  Buy milk  ')).toEqual({ ok: true, title: 'Buy milk' });
  });

  it('refuses an empty title', () => {
    expect(checkTitle('')).toEqual({ ok: false, reason: 'empty' });
  });

  it('refuses a title of spaces only', () => {
    expect(checkTitle('   \t  ')).toEqual({ ok: false, reason: 'empty' });
  });

  it('refuses a value that is not text', () => {
    expect(checkTitle(undefined)).toEqual({ ok: false, reason: 'empty' });
    expect(checkTitle(42)).toEqual({ ok: false, reason: 'empty' });
  });

  it('accepts exactly 200 characters and refuses 201 (BR1.3)', () => {
    expect(checkTitle('a'.repeat(MAX_TITLE_LENGTH)).ok).toBe(true);
    expect(checkTitle('a'.repeat(MAX_TITLE_LENGTH + 1))).toEqual({ ok: false, reason: 'too-long' });
  });

  it('counts the length after trimming', () => {
    expect(checkTitle(`  ${'a'.repeat(200)}  `).ok).toBe(true);
  });

  it('counts an emoji and an accented letter once', () => {
    expect(countVisibleCharacters('😀')).toBe(1);
    expect(countVisibleCharacters('é')).toBe(1);
    expect(checkTitle('😀'.repeat(200)).ok).toBe(true);
    expect(checkTitle('😀'.repeat(201))).toEqual({ ok: false, reason: 'too-long' });
    expect(checkTitle('é'.repeat(200)).ok).toBe(true);
  });

  it('accepts markup as plain text', () => {
    expect(checkTitle('<b>x</b>')).toEqual({ ok: true, title: '<b>x</b>' });
  });

  it('falls back to counting code points where the text segmenter is missing', async () => {
    vi.resetModules();
    vi.stubGlobal('Intl', { ...Intl, Segmenter: undefined });
    const fallback = await import('./titleRules.js');
    expect(fallback.countVisibleCharacters('😀a')).toBe(2);
    expect(fallback.checkTitle('a'.repeat(201))).toEqual({ ok: false, reason: 'too-long' });
    vi.unstubAllGlobals();
  });
});
