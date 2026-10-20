// Project colors. Each project has an accent, a background, a slightly lighter second background
// and a glow (a saturated version of the background hue, never the accent itself, because a light
// accent over a dark base turns muddy). A project can set its own `theme` in its frontmatter.
// Without one, projects take these presets in homepage order and loop back to the first.
export interface Theme {
  accent: string;
  bg: string;
  bg2: string;
  glow: string;
}

export const presets: Theme[] = [
  { accent: '#8CC5A8', bg: '#0F2A2B', bg2: '#173B3A', glow: '#1E7A6E' }, // jade on teal
  { accent: '#B4C3E4', bg: '#10243A', bg2: '#1A3556', glow: '#2D5FA8' }, // powder blue on navy
  { accent: '#F0B79C', bg: '#1B2B26', bg2: '#27403A', glow: '#2E7A66' }, // peach on moss
];

export const baseTheme = presets[0];

/** The theme for the project at `index` in homepage order. */
export function themeAt(index: number, own?: Theme): Theme {
  return own ?? presets[((index % presets.length) + presets.length) % presets.length];
}

/** CSS custom properties for a theme, ready for a style attribute. */
export function themeStyle(theme: Theme): string {
  return `--accent:${theme.accent};--bg:${theme.bg};--bg-2:${theme.bg2};--glow:${theme.glow}`;
}
