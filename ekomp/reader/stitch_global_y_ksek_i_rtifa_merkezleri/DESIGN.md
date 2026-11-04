---
name: High-Altitude Olympic Performance
colors:
  surface: '#061426'
  surface-dim: '#061426'
  surface-bright: '#2d3a4e'
  surface-container-lowest: '#020e21'
  surface-container-low: '#0e1c2f'
  surface-container: '#132033'
  surface-container-high: '#1d2a3e'
  surface-container-highest: '#28354a'
  on-surface: '#d6e3fe'
  on-surface-variant: '#e3bfb1'
  inverse-surface: '#d6e3fe'
  inverse-on-surface: '#243145'
  outline: '#aa8a7d'
  outline-variant: '#5a4136'
  surface-tint: '#ffb596'
  primary: '#ffb596'
  on-primary: '#581e00'
  primary-container: '#ff6500'
  on-primary-container: '#551d00'
  inverse-primary: '#a33e00'
  secondary: '#45edee'
  on-secondary: '#003737'
  secondary-container: '#00d0d1'
  on-secondary-container: '#005455'
  tertiary: '#aac9f4'
  on-tertiary: '#0e3255'
  tertiary-container: '#7a98c1'
  on-tertiary-container: '#0c3053'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcd'
  primary-fixed-dim: '#ffb596'
  on-primary-fixed: '#360f00'
  on-primary-fixed-variant: '#7d2d00'
  secondary-fixed: '#56f9f9'
  secondary-fixed-dim: '#26dcdd'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f50'
  tertiary-fixed: '#d3e4ff'
  tertiary-fixed-dim: '#aac9f4'
  on-tertiary-fixed: '#001c38'
  on-tertiary-fixed-variant: '#29486d'
  background: '#061426'
  on-background: '#d6e3fe'
  surface-variant: '#28354a'
typography:
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 38px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  metric-display:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  metric-display-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  title-md:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.12em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies high-altitude physiological precision, peak athletic dedication, and elite Olympic infrastructure. Built for world-class athletes, performance scientists, and Olympic federations, the aesthetic fuses crisp technical data display with the harsh, pristine environment of high-altitude training.

The visual style is **High-Contrast Modern Athletic**, merging technical data density with expansive, crisp negative space. It draws direct inspiration from alpine winter environments and technical biometric readouts: deep abyssal navy tones provide structural gravity, pure snow-whites provide optical clarity, while high-velocity orange and glacial cyan drive intense focus toward key metrics and performance differentials. Visual elements are engineered for instantaneous cognition under physical strain, using micro-architectural lines, razor-sharp status indicators, and luminous telemetry readouts.

## Colors

The palette directly captures the atmospheric tension of 3,000-meter altitude training: deep oxygen-deprived alpine night against razor-sharp ice and searing energy expenditure.

- **Primary Accent (`#FF6500` / `#FF7B54`)**: Kinetic Oxygen. Used exclusively for primary calls to action, peak physiological effort states, VO2 max thresholds, active Olympic records, and live telemetry triggers.
- **Secondary Accent (`#00D2D3`)**: Glacial Cryo. Represents physiological recovery, altitude atmospheric density, baseline comparison standards, and cold-medium disciplines (ice hockey, curling, winter conditioning, swimming pool split markers).
- **Tertiary Surface Layer (`#1E3E62`)**: Alpine Slate. Used for surface elevation tiers, container borders, telemetry module framing, and inactive segmented controls.
- **Neutral Foundations (`#0B192C` to `#050B14`)**: Abyssal Altitude. Deep, dark athletic navy serving as the core backdrop to eliminate screen glare, elevate optical contrast, and preserve energy in low-light and bright alpine glare conditions alike.
- **Signal Snow (`#FFFFFF` to `#E2E8F0`)**: Crisp contrast whites dedicated to vital statistics, athlete identity names, and high-priority directional wayfinding.

## Typography

Typography establishes an uncompromising hierarchy engineered for instant parsing during high-intensity training scenarios. 

- **Space Grotesk** serves as the headline, metric, and telemetry font. Its technological geometry evokes precision chronograph dials and high-altitude flight instruments. All display and headline sizes feature tightened negative letter spacing to project athletic compactness and urgency.
- **Hanken Grotesk** functions as the primary body and interface workhorse. Its humanist grotesque structure guarantees absolute legibility on mobile field-tablets, wearable monitors, and sideline performance rigs.
- **Telemetry Formatting Rules**: Numerical figures inside cards, biometric stats, and split times must always apply tabular figures (`font-variant-numeric: tabular-nums`) to prevent optical jitter during live real-time streams. All sub-section identifiers and category tags must be set in uppercase using `label-caps`.

## Layout & Spacing

The layout operates on a 12-column fluid grid system on desktop (breakpoints at 1440px and 1024px), reflowing to an 8-column layout on tablet (768px - 1023px) and a structured 4-column architecture on mobile (below 768px).

- Spacing follows a 4px base athletic rhythm. Density is intentionally high within metric modules (compact 4px and 8px gaps) to keep critical physiological values grouped within a single optical fixation point.
- Canvas-level section spacing (`space-xl` / 40px) enforces clean separation between macro telemetry blocks: Biometric Overview, Discipline Readiness, Altitude Acclimatization Index, and Session Trajectory.
- Content reflow transitions live telemetry from multi-metric horizontal split-comparisons on desktop to vertically stacked biometric delta cards on mobile.

## Elevation & Depth

Visual hierarchy rejects fuzzy drop shadows in favor of **Tonal Layers with Cryo-Glass Luminosity and Structural Hairlines**. High-altitude aesthetic relies on ambient light reflections off ice and dark rock:

- **Level 0 (Base Atmosphere)**: `#050B14` canvas ground.
- **Level 1 (Module Canvas)**: Solid `#0B192C` with a 1px crisp perimeter border of `rgba(30, 62, 98, 0.6)`.
- **Level 2 (Telemetry & Metric Card Tier)**: `#112338` elevated surface with top-edge ambient stroke highlighting (`rgba(255, 255, 255, 0.08)`) simulating light hitting crystalline mountain ridges.
- **Active / Alert Depth**: When an athlete enters peak threshold or a session goes live, surfaces emit a focused directional glow (`0 0 24px rgba(255, 101, 0, 0.18)`), creating clear visual priority without elevating physical z-axis clutter.
- **Overlay & HUD Modals**: Semi-transparent `#0B192C` at 85% opacity with an active `16px` backdrop-blur filter and an ice-cyan hairline border (`rgba(0, 210, 211, 0.3)`).

## Shapes

The design system enforces a disciplined, technical shape vocabulary with **Soft (`1`)** corner treatments. Radii are kept minimal (4px base, 8px on master containers) to convey precision, mechanical discipline, and structural toughness.

- Standard buttons, input modules, and badge chips utilize 4px border-radius (`roundedness: 1`), avoiding excessive roundness that diminishes athletic rigor.
- Discipline tags, biometric pills, and status indicator dots use micro-beveled or subtle rounded borders, contrasting against full circular status indicators reserved strictly for athlete avatars and live recording states.

## Components

### Buttons
- **Primary Kinetic**: High-velocity orange background (`#FF6500`), crisp white text in uppercase `label-caps`, 4px radius, `0 2px 10px rgba(255, 101, 0, 0.3)` glow. Hover shifts to `#FF7B54`.
- **Secondary Cryo**: Dark navy background (`#0B192C`) encased in a 1px cyan border (`#00D2D3`) with cyan typography. Hover triggers `rgba(0, 210, 211, 0.1)` surface fill.
- **Ghost Utility**: Transparent surface with muted gray border (`#1E3E62`), used for tactical export and secondary telemetry sorting.

### Discipline Badges & Chips
- Compact badges dedicated to Olympic disciplines (Curling, Swimming, Athletics, Volleyball, Basketball, Football, Martial Arts).
- Constructed using `#1E3E62` at 40% fill, 1px structural border, paired with an uppercase 11px micro-label and a 6px discipline-specific color dot (e.g., Glacial Cyan for Swimming and Curling; Altitude Orange for Athletics and Martial Arts).

### Metric Comparison Cards
- Structured performance blocks comparing baseline vs. altitude output.
- Features large-format tabular telemetry values (`metric-display`) atop `#112338` surface, integrated delta chips (`+4.2% VO2` in `#00D2D3` on positive acclimation, `-1.8% Lactate Clearance` in `#FF6500`), and a micro sparkline rendered in 1.5px cyan stroke.

### Form Inputs & Adjusters
- High-altitude environment and equipment parameter controls (altitude adjustment slider, barometric pressure fields).
- Solid `#050B14` fields, 1px `#1E3E62` idle border transitioning to active `#00D2D3` focus ring with zero outline offset. Data labels float in uppercase above the control.

### Checkboxes & Segmented Discipline Toggles
- Custom square selectors with 2px radius. Inactive: solid `#0B192C` with `#1E3E62` border. Active: pure `#FF6500` fill with a sharp white geometric checkmark.
- Segmented multi-sport bar: Unified `#050B14` container housing flush-mounted segmented toggles with active items illuminated in elevated `#1E3E62`.

### Specialized Biometric Stream Bar
- Horizontally scrolling telemetry strip showing live heart rate variability, SpO2 (oxygen saturation), and blood lactate levels with dynamic danger-threshold boundary markers.