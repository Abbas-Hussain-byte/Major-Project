# Skill: Accessible, Non-Generic UI/UX for BenefitLens

## Why this file exists

Default AI-generated UI has a recognizable "look" — and it's specifically
wrong for this product. Most AI coding agents converge on the same visual
tics because they're statistically the most common pattern in training data,
not because they're the right choice here. This skill exists to actively
override those defaults, and to ground every choice in the actual HCI
evidence this project cites (Medhi et al. 2011; Islam et al. 2023), so the
design isn't just "different for its own sake" — it's different because
generic patterns measurably fail this specific user.

## First: explicitly forbidden default patterns

Do not produce any of the following — these are the visual signatures that
make an interface read as generic AI output, and several of them actively
hurt usability for this audience too:

- Glassmorphism / frosted-glass cards with heavy blur and soft shadows
- Unmodified default Tailwind/shadcn component styling straight out of the box
- The default system-ui/Inter font stack with no deliberate choice made
- Emoji used as functional icons instead of a real icon system
- A dashboard cluttered with small metric cards and tiny sparkline charts
- Centered-everything symmetric grids with identical rounded-corner cards
- Low-contrast gray-on-white or gray-on-gray text for anything functional
- Colour as the only cue for information or state
- Small or low-contrast text anywhere in the functional UI
- Stock-photo imagery of generic "diverse professionals in business attire"

If a generated screen matches three or more of the above, stop and rebuild it
— that's the tell.

## Visual polish allowed

While the above are banned, creating a modern, polished, hackathon-quality UI is encouraged using the following:

- Soft depth and shadows to create clear visual hierarchy
- Rounded cards and containers
- Gradient or illustrated backgrounds, but ONLY when placed strictly behind solid, high-contrast foreground containers
- Thoughtful CSS-based motion and micro-interactions (e.g., hover states, active states, page transitions)

## Core design language & hard rules — build from this instead

**Voice is the dominant visual element, not a hidden feature.** A large,
persistent microphone control should be the single most visually prominent
element on every core screen — not a small icon in a corner. The mic and text fallback must always remain visible.

**Icon-first navigation, grounded in Islam et al.'s design considerations.**
Primary navigation is icon-led with large, unambiguous pictograms — a coin
for income, a shield for insurance/protection, an open book for literacy
content, a document for the explainer. Text labels are secondary, present for
those who can read, never the only wayfinding cue. A user who cannot read at
all must still be able to identify and reach every core action.

**Deliberate, meaningful color coding per module** — not decorative gradient
variety. Pick one distinct, high-contrast color per module (e.g., a trust
blue for insurance, a warm gold for schemes, a green for income tracking) and
use it consistently as that module's identity across every screen it
appears on. Color should carry information, not just decoration.

**Large targets, high contrast, generous type.** Minimum touch target is 56px.
Body text is 16px minimum, primary action text larger still.
Maintain strict AAA contrast ratio (7:1 or better) on all functional text.
Gold/yellow backgrounds must only use dark text.
The UI must remain fully functional when the browser zoom is set to 200%.

**One purposeful action per screen.** Reject the "dashboard-itis" pattern of
cramming many small widgets onto one view. Each screen should have one clear
job — resist the instinct to add secondary widgets "since there's space."

**Typography with a real point of view.** Choose a typeface deliberately for
legibility across Latin, Telugu, and Devanagari scripts (e.g., Noto fonts, self-hosted)
— don't default to whatever the component library ships with.

**Respect user preferences.** Every animation must be disabled or significantly reduced under `prefers-reduced-motion`.

## When generating any screen, check against this list before finalizing

1. Is the microphone/voice action the most visually dominant element?
2. Can this screen be operated correctly by someone who cannot read at all?
3. Does every icon have an unambiguous, testable meaning without its label?
4. Is contrast and touch-target size at or above the minimums stated above (7:1 contrast, 56px targets, 16px text)?
5. Would this screen be identifiable as "not a generic AI-generated app" if
   shown next to a default shadcn/Tailwind starter template?

If the answer to any of these is no, revise before moving on.
