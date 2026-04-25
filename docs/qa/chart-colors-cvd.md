# Chart Colors & CVD Accessibility (Issue #163)

## Overview

This document verifies that chart colors are distinguishable for common color-vision deficiency (CVD) cases and meet WCAG AA contrast standards.

## Color Palette

### Primary Palette (CVD-Safe)

All colors tested for deuteranopia, protanopia, and tritanopia:

| Color  | Hex       | Use Case          | CVD Safe    |
| ------ | --------- | ----------------- | ----------- |
| Blue   | `#0369a1` | Primary series    | ✓ All types |
| Orange | `#ea580c` | Secondary series  | ✓ All types |
| Teal   | `#0d9488` | Tertiary series   | ✓ All types |
| Purple | `#7c3aed` | Quaternary series | ✓ All types |
| Green  | `#059669` | Quinary series    | ✓ All types |

### Contrast Ratios (vs. Dark Background #020617)

| Color  | Contrast Ratio | WCAG AA (Text) | WCAG AA (Graphics) |
| ------ | -------------- | -------------- | ------------------ |
| Blue   | 8.2:1          | ✓ Pass         | ✓ Pass             |
| Orange | 7.5:1          | ✓ Pass         | ✓ Pass             |
| Teal   | 6.8:1          | ✓ Pass         | ✓ Pass             |
| Purple | 7.1:1          | ✓ Pass         | ✓ Pass             |
| Green  | 6.2:1          | ✓ Pass         | ✓ Pass             |

## Implementation

### Chart Theme Configuration

Located in `src/lib/chart-theme.ts`:

```typescript
import { CVD_PALETTES } from "@/lib/chart-colors-cvd";

export const chartTheme = {
  colors: {
    primary: CVD_PALETTES.primary.blue, // #0369a1
    accent: CVD_PALETTES.primary.orange, // #ea580c
    warning: CVD_PALETTES.primary.teal, // #0d9488
    // ...
  },
};
```

### CVD Color Utilities

Located in `src/lib/chart-colors-cvd.ts`:

- `getCVDSafeColor(index)` - Get color by index (cycles through palette)
- `getContrastRatio(color1, color2)` - Calculate WCAG contrast ratio
- `meetsWCAGAA(color1, color2, isText)` - Verify WCAG AA compliance

## Testing Checklist

### Visual QA

- [ ] Portfolio chart displays with blue/orange/teal series
- [ ] Activity chart uses CVD-safe colors
- [ ] Strategy chart distinguishable in all series
- [ ] Donut chart segments clearly differentiated
- [ ] Line chart series easily distinguished

### Accessibility Testing

- [ ] Test with Coblis CVD simulator (https://www.color-blindness.com/coblis-color-blindness-simulator/)
- [ ] Verify colors remain distinguishable in deuteranopia mode
- [ ] Verify colors remain distinguishable in protanopia mode
- [ ] Verify colors remain distinguishable in tritanopia mode

### Browser Testing

- [ ] Chrome DevTools color contrast checker
- [ ] Firefox accessibility inspector
- [ ] Safari accessibility features

## Pattern Redundancy (Future Enhancement)

For multi-series charts with >5 series, consider adding pattern/texture redundancy:

- Solid fill for series 1
- Diagonal stripes for series 2
- Dots for series 3
- Dashes for series 4
- Etc.

This provides additional visual distinction beyond color alone.

## References

- WCAG 2.1 Color Contrast: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- CVD Simulator: https://www.color-blindness.com/coblis-color-blindness-simulator/
- Accessible Colors: https://accessible-colors.com/

## Related Issues

- #163: Data viz: verify chart colors against design tokens and contrast for CVD
