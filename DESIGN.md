# RecruitIQ — Design Guidelines

## Color Palette
- **Primary (Deep Navy):** #1E3A5F — used for primary actions, headings, sidebar backgrounds
- **Accent (Electric Blue):** #2D7DD2 — used for highlights, links, active states, badges
- **Background:** #FFFFFF — clean white canvas
- **Foreground:** #0F1F33 — near-black for body text
- **Card:** #F5F8FC — very light blue-tinted card surfaces
- **Card Foreground:** #0F1F33
- **Muted:** #EDF1F7 — subtle section backgrounds
- **Muted Foreground:** #5A7089 — secondary text, labels
- **Border:** #C8D8E8 — soft navy-tinted borders
- **Input:** #C8D8E8
- **Ring:** #2D7DD2
- **Destructive:** #D93025
- **Destructive Foreground:** #FFFFFF
- **Popover:** #FFFFFF
- **Popover Foreground:** #0F1F33
- **Secondary:** #EDF1F7
- **Secondary Foreground:** #1E3A5F
- **Navbar Background:** #1E3A5F
- **Sidebar Background:** #162E4D
- **Sidebar Foreground:** #E8F0F9
- **Sidebar Primary:** #2D7DD2
- **Sidebar Primary Foreground:** #FFFFFF
- **Sidebar Accent:** #1E3A5F
- **Sidebar Accent Foreground:** #E8F0F9
- **Sidebar Border:** #243F5E
- **Sidebar Ring:** #2D7DD2

## Typography
- **Headings:** Space Grotesk — modern, geometric, authoritative
- **Body:** Inter — clean, highly legible at small sizes

## Elevation & Surfaces
- Cards use subtle box-shadow (`shadow-sm`) on white/card-background
- Sidebar and navbar use deep navy for strong visual hierarchy
- Use border-border for dividers; avoid heavy lines

## Component Style
- Rounded corners: `rounded-lg` for cards, `rounded-md` for inputs/buttons
- Primary buttons: deep navy fill, white text
- Accent used for progress bars, score badges, active nav items
- Score badges (0–100%): color-coded — green ≥ 75%, yellow 50–74%, red < 50%
- Kanban cards: compact, with candidate name, score badge, and role tag
- Tables: clean, alternating muted rows, sortable headers

## Charts
- Chart 1: #2D7DD2 (electric blue)
- Chart 2: #1E3A5F (deep navy)
- Chart 3: #4AA8D8 (sky blue)
- Chart 4: #A8C7E8 (light blue)
- Chart 5: #5A7089 (slate)

## Tone
- Professional and data-driven
- No decorative clutter — every element earns its place
- Dense information display is acceptable; clarity over minimalism
