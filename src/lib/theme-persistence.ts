/**
 * Theme persistence (localStorage)
 *
 * Key: THEME_STORAGE_KEY — values "light" | "dark" | "system".
 * - "light" / "dark": Tailwind `html` class is forced to that mode (see ThemeProvider).
 * - "system": resolved from `prefers-color-scheme` (dark → `html.dark`, light → `html.light`).
 *
 * SSR / no-JS: `layout.tsx` keeps `html` default class `dark` so the shell stays readable;
 * when JS runs, the inline `beforeInteractive` script reconciles `html` from storage before paint,
 * then ThemeProvider repeats read + `applyTheme` on mount and registers the media listener when mode is system.
 *
 * The inline script cannot import this module; keep THEME_STORAGE_KEY identical there (see layout comment).
 */
export const THEME_STORAGE_KEY = "nw-theme";
