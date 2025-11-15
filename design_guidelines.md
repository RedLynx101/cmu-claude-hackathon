# CollabCMU Design Guidelines

## Design Approach
**Reference-Based + System Hybrid**: Drawing from Linear's clean productivity interface and Notion's content-rich layouts, adapted for CMU's academic collaboration context. Modern, professional aesthetic that emphasizes clarity and efficient information discovery.

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts) - clean, highly legible for data-heavy interfaces
- **Accent Font**: Poppins for headings - adds personality while maintaining professionalism
- **Hierarchy**:
  - H1: text-4xl/font-bold (page titles)
  - H2: text-2xl/font-semibold (section headers)
  - H3: text-xl/font-semibold (card titles, club names)
  - Body: text-base (primary content)
  - Small: text-sm (metadata, timestamps, labels)
  - Tiny: text-xs (badges, tags, supporting info)

### Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16 for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: space-y-8 to space-y-12
- Card gaps: gap-6
- Button padding: px-6 py-3
- Tight spacing for related items: space-y-2

**Grid Structure**:
- Container: max-w-7xl mx-auto px-6
- Dashboard: 3-column grid (sidebar + main content + details panel)
- Club cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Match results: 2-column comparison layout

### Component Library

**Navigation**
- Left sidebar (w-64, fixed): Logo, main navigation, user profile at bottom
- Top bar: Breadcrumbs, search, notifications, quick actions
- Navigation items: Icon + label, hover state with subtle background

**Dashboard Cards**
- Club Profile Cards: Rounded-lg, shadow-sm, border
  - Club logo/icon (top left)
  - Club name (text-xl/font-semibold)
  - Description (text-sm, 2-line clamp)
  - Tags/categories (flex-wrap, gap-2)
  - Action buttons (bottom right)
  
**Match Results Display**
- Match Score Badge: Large circular progress indicator (92% compatibility)
- Two-column comparison: Club A ↔️ Club B side-by-side
- Expandable sections: "Why This Match", "Collaboration Ideas", "Generated Proposal"
- Strength/Need alignment visualization: Icon-based grid showing overlaps

**Forms & Inputs**
- Club creation form: Multi-step wizard (3 steps: Basic Info → Goals & Offerings → Needs)
- Input fields: Floating labels, border-2, rounded-md, h-12
- Textareas: min-h-32, resize-y
- Multi-select tags: Pill-based interface with × to remove
- Submit buttons: Full-width on mobile, inline on desktop

**Data Display**
- Match Cards: Horizontal layout
  - Left: Match score badge (w-20 h-20)
  - Center: Club info, match reasoning (2-3 lines)
  - Right: CTA buttons (stacked)
- Event Ideas: Timeline-style layout with connector lines
- Proposal View: Document-style with sections, copy button (top right)

**Modals & Overlays**
- Full-screen overlay for proposal generation: Centered modal, max-w-4xl
- Side drawer for club details: Slide from right, w-96
- Toast notifications: Top-right, auto-dismiss in 4s

**Badges & Tags**
- Club categories: Rounded-full, px-3 py-1, text-xs
- Status indicators: Dot + label inline
- Match scores: Large numbers with /100, gradient background on high scores

### Images
**Hero Section**: No large hero image - this is a utility app. Instead:
- Compact branded header (h-24) with CMU wordmark and tagline
- Immediate jump to dashboard/action

**Club Logos**: Use placeholder icons from Heroicons (academic-cap, beaker, code-bracket, etc.) for demo clubs. Each club card displays its icon prominently (w-12 h-12, top-left of card).

**Illustrations**: For empty states only:
- "No matches yet" - simple line illustration
- "Add your first club" - welcoming graphic
Keep illustrations minimal and secondary to functionality.

### Page Layouts

**Dashboard (Main View)**
```
[Sidebar] [Main Content Area: Club Grid] [Quick Actions Panel]
- 3-column responsive layout
- Collapses to single column on mobile
- Recent matches widget (top right)
- "Find Matches" CTA prominently placed
```

**Club Profile Page**
```
[Header: Club Name + Edit Button]
[Info Grid: 2-column on desktop]
  - Left: Description, Goals, Offerings
  - Right: Needs, Members, Events
[Bottom: Related Matches Section]
```

**Match Results Page**
```
[Filter Bar: Sort by score, category]
[Results Grid: Card layout, 2-column]
Each card expands accordion-style to show:
  - Collaboration ideas (bulleted list)
  - Generated proposal (expandable text)
  - Outreach template (copy button)
```

**Add/Edit Club Form**
```
[Progress Stepper: 1-2-3]
[Form Section: Centered, max-w-2xl]
[Navigation: Back + Continue buttons]
```

### Interaction Patterns
- Hover states: Subtle scale (scale-105) on cards
- Loading states: Skeleton screens for club cards, spinner for AI generation
- Transitions: transition-all duration-200 for smooth interactions
- Focus states: ring-2 ring-offset-2 for accessibility
- No complex animations - keep it snappy and professional

### Responsive Behavior
- Mobile: Stack all columns, full-width cards, bottom navigation
- Tablet: 2-column grid, collapsible sidebar
- Desktop: Full 3-column layout with fixed sidebar

### Demo-Specific Elements
- Pre-loaded club showcase: Hero grid showing 6-8 clubs immediately
- "Live generation" indicator when showing AI matching in action
- Sample collaboration board: Kanban-style with 3 columns (Proposed, In Progress, Completed)