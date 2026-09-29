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

- Purple-to-blue (or pink-to-orange) gradient hero sections
- Glassmorphism / frosted-glass cards with heavy blur and soft shadows
- Unmodified default Tailwind/shadcn component styling straight out of the box
- The default system-ui/Inter font stack with no deliberate choice made
- Emoji used as functional icons instead of a real icon system
- A dashboard cluttered with small metric cards and tiny sparkline charts
- Centered-everything symmetric grids with identical rounded-corner cards
- Low-contrast gray-on-white or gray-on-gray text for anything functional
- Stock-photo imagery of generic "diverse professionals in business attire"

If a generated screen matches three or more of the above, stop and rebuild it
— that's the tell.

## Core design language — build from this instead

**Voice is the dominant visual element, not a hidden feature.** A large,
persistent microphone control should be the single most visually prominent
element on every core screen — not a small icon in a corner. This is the
product's actual differentiator; the UI should look like it, not like a
generic form-based app with a voice option bolted on.

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

**Large targets, high contrast, generous type.** Minimum touch target ~56px
(larger than the standard 44px minimum — this audience skews toward older
users and imprecise touch on cheap devices). Body text 16px minimum, primary
action text larger still. Aim for WCAG AAA contrast on anything functional,
not just AA — Medhi et al.'s finding that text UIs fail 100% of the time for
this population is exactly the failure mode low-contrast, small text
reproduces even for a user who technically can read.

**One purposeful action per screen.** Reject the "dashboard-itis" pattern of
cramming many small widgets onto one view. Each screen should have one clear
job — resist the instinct to add secondary widgets "since there's space."

**Typography with a real point of view.** Choose a typeface deliberately for
legibility across Latin, Telugu, and Devanagari scripts (if any UI chrome
needs to render native-script text) — don't default to whatever the
component library ships with. A distinct, considered type choice is one of
the cheapest ways to avoid the generic look.

## When generating any screen, check against this list before finalizing

1. Is the microphone/voice action the most visually dominant element?
2. Can this screen be operated correctly by someone who cannot read at all?
3. Does every icon have an unambiguous, testable meaning without its label?
4. Is contrast and touch-target size at or above the minimums stated above?
5. Would this screen be identifiable as "not a generic AI-generated app" if
   shown next to a default shadcn/Tailwind starter template?

If the answer to any of these is no, revise before moving on.
