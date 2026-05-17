# The Coffee Movement

## Mission
Create implementation-ready, token-driven UI guidance for The Coffee Movement that is optimized for consistency, accessibility, and fast delivery across e-commerce storefront.

## Brand
- Product/brand: The Coffee Movement
- URL: https://www.thecoffeemovement.com/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: minimal, utility-first, accessibility-prioritized
- Main font style: `font.family.primary=acumin-pro`, `font.family.stack=acumin-pro`, `font.size.base=16px`, `font.weight.base=300`, `font.lineHeight.base=22.4px`
- Typography scale: `font.size.xs=0px`, `font.size.sm=14.46px`, `font.size.md=16px`, `font.size.lg=34.43px`
- Color palette: `color.surface.base=#000000`, `color.text.secondary=#945c44`, `color.surface.muted=#f5f1e8`, `color.surface.raised=#d9baa0`
- Spacing scale: `space.1=1.6px`, `space.2=15.91px`, `space.3=16px`, `space.4=26.57px`, `space.5=32px`, `space.6=111.17px`
- Radius/shadow/motion tokens: `radius.xs=300px` | `motion.duration.instant=100ms`, `motion.duration.fast=140ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (29), buttons (7), navigation (4), cards (2).

- Extraction diagnostics: Low sample size: fewer than 30 visible elements were extracted. Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
