# Design QA

**Source visual truth**

- `C:\Users\zzf04\AppData\Local\Temp\codex-clipboard-8bd6f5f6-5fc3-4245-bb5d-381f4f3b463e.png`
- Source pixels: 395 × 832.
- Selected state: English desktop landing page.

**Implementation evidence**

- Desktop hero screenshot: `C:\Users\zzf04\Documents\darwinitmate\implementation-desktop-hero.png`
- Mobile screenshot: `C:\Users\zzf04\Documents\darwinitmate\implementation-mobile.png`
- Full-page implementation capture: `C:\Users\zzf04\Documents\darwinitmate\implementation-home.png`
- Combined comparison: `C:\Users\zzf04\Documents\darwinitmate\design-qa-comparison.png`
- Desktop screenshot pixels: 1418 × 985, browser viewport override 1440 × 1000, device scale factor 1.
- Mobile screenshot pixels: 375 × 830, browser viewport override 390 × 844, device scale factor 1.
- Browser-rendered URL: `http://localhost:4173/`

**Full-view comparison evidence**

- The source hero and implementation hero were placed in one combined image and compared directly.
- The implementation preserves the source's ivory split hero, navy editorial serif, terracotta CTA, service photography, compact navigation, $150 price emphasis and four-item trust strip.
- The implementation intentionally adds a small availability card and wider desktop spacing to support the requested more advanced interaction and multi-page scope.

**Focused region comparison evidence**

- Hero: heading line breaks, price placement, CTA hierarchy, image subject/crop and trust strip were checked at desktop size.
- Mobile: navigation, hero hierarchy, CTA stacking, image crop and horizontal overflow were checked at 390 × 844.
- Service imagery: all three generated assets loaded at full natural width with meaningful alt text.

**Required fidelity surfaces**

- Fonts and typography: Instrument Serif provides the selected editorial display character; DM Sans provides clean UI text. Hierarchy, optical weight and line wrapping remain faithful at desktop and mobile.
- Spacing and layout rhythm: split hero proportions, section spacing, trust bar density, page grids and mobile stacking are consistent. No document-width overflow was detected.
- Colors and tokens: ivory, deep navy, terracotta and eucalyptus tokens match the selected direction with accessible foreground contrast.
- Image quality and asset fidelity: three purpose-made raster assets match the reference art direction; no placeholder or CSS-drawn imagery is used.
- Copy and content: the site is English-only and retains the selected “Smart websites. Reliable IT. Right here in Darwin.” and “Websites from $150” conversion hierarchy.

**Interaction checks**

- Desktop quote modal opens from the header.
- Service selection enables the next step and advances to contact fields.
- Mobile menu opens and navigates to the About page.
- Six routes render through the SPA fallback.
- Clean browser session: no console errors or warnings.

**Comparison history**

1. Initial browser pass found an invalid effect cleanup that blanked the React tree.
2. The scroll and modal reset effects were corrected to return valid cleanup functions.
3. Post-fix screenshots showed the complete layout; a new clean browser tab reported zero console errors or warnings.

**Findings**

- No actionable P0, P1 or P2 visual or interaction issues remain.

**Follow-up polish**

- P3: Replace the example email and any placeholder business contact details once final contact information is available.
- P3: Connect the enquiry forms to the chosen email or CRM service before production launch.

final result: passed
