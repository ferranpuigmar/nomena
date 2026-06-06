# Responsive Design Skill - Nomena App

## Overview
This skill provides guidelines and best practices for implementing responsive design in the Nomena app using Tailwind CSS v4. Follow these patterns to ensure consistent, mobile-first responsive behavior across the application.

---

## Configuration

### Tailwind CSS v4 Setup
- **Version**: Tailwind CSS v4 with `@tailwindcss/vite` plugin
- **CSS File**: `src/index.css` with `@import "tailwindcss"`
- **Theme Variables**: Defined in `@theme` block (CSS variables)
- **No config file**: Tailwind v4 uses CSS-based configuration

### Current Breakpoints
Tailwind's default breakpoints apply:
```css
sm:  640px  /* Small tablets, large phones landscape */
md:  768px  /* Tablets */
lg:  1024px /* Desktops */
xl:  1280px /* Large desktops */
2xl: 1536px /* Extra large screens */
```

### Mobile Detection Hook
Use the existing `useIsMobile` hook for JavaScript-based mobile detection:
```tsx
import { useIsMobile } from '@src/app/shared/hooks/useMobile'

const isMobile = useIsMobile() // true when viewport < 768px
```

---

## Core Principles

### 1. Mobile-First Approach
Always design for mobile first, then progressively enhance for larger screens.

```tsx
// ✅ CORRECT - Mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ❌ WRONG - Desktop first (requires overrides)
<div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
```

### 2. Touch-Friendly Targets
Minimum tap target size: **44x44px** (WCAG guideline).

```tsx
// ✅ CORRECT - Adequate touch target
<button className="h-12 px-4">Click me</button>

// ❌ WRONG - Too small for touch
<button className="h-6 px-2 text-xs">Click</button>
```

### 3. Avoid Fixed Widths
Use flexible units (`%`, `fr`, `max-w-*`) instead of fixed pixel widths.

```tsx
// ✅ CORRECT - Flexible container
<div className="max-w-7xl mx-auto px-4">

// ❌ WRONG - Fixed width breaks on small screens
<div className="w-[1200px] mx-auto">
```

---

## Layout Patterns

### Grid Layouts

#### Card Grids (Most Common)
Use this pattern for name cards, search results, favorites, etc.

```tsx
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns
<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Dense grid for small items (tags, chips)
<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
  {tags.map(tag => <Tag key={tag} label={tag} />)}
</div>
```

#### Sidebar Layouts
Use this pattern for settings pages, account pages, etc.

```tsx
// Stacked on mobile, sidebar on tablet+
<div className="grid gap-6 md:grid-cols-[220px_1fr]">
  <aside className="surface-card p-4">
    {/* Navigation */}
  </aside>
  <main className="surface-card p-6">
    {/* Content */}
  </main>
</div>

// Wider sidebar for content-heavy navigation
<div className="grid gap-6 lg:grid-cols-[280px_1fr]">
  <aside className="surface-card p-4">
    {/* Navigation */}
  </aside>
  <main className="surface-card p-6">
    {/* Content */}
  </main>
</div>
```

#### Two-Column Layouts
Use for forms, comparison views, etc.

```tsx
// Single column on mobile, two columns on tablet+
<div className="grid gap-4 md:grid-cols-2">
  <div className="surface-card p-4">{/* Column 1 */}</div>
  <div className="surface-card p-4">{/* Column 2 */}</div>
</div>

// Unequal columns (e.g., 2:1 ratio)
<div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
  <div className="surface-card p-4">{/* Main content */}</div>
  <div className="surface-card p-4">{/* Sidebar */}</div>
</div>
```

### Flexbox Patterns

#### Horizontal Navigation/Headers
```tsx
// Responsive header with wrapping
<header className="flex flex-wrap items-center justify-between gap-4 p-4">
  <Logo />
  <nav className="flex gap-4">
    <NavLink to="/search">Search</NavLink>
    <NavLink to="/favorites">Favorites</NavLink>
  </nav>
  <UserMenu />
</header>

// Stack on mobile, horizontal on tablet+
<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <h1>Title</h1>
  <div className="flex gap-2">
    <Button>Action 1</Button>
    <Button>Action 2</Button>
  </div>
</div>
```

#### Vertical Stacking with Spacing
```tsx
// Consistent spacing that adapts to screen size
<div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
  <Section1 />
  <Section2 />
  <Section3 />
</div>
```

### Container Utilities

#### Content Wrapper (Use Existing Component)
```tsx
import { ContentWrapper } from '@src/app/shared/components/content-wrapper'

// Standard constrained width with padding
<ContentWrapper>
  <YourContent />
</ContentWrapper>

// Full layout (no constraints)
<ContentWrapper hasFullLayout>
  <YourContent />
</ContentWrapper>
```

#### Manual Container Pattern
```tsx
// Standard max-width container
<div className="mx-auto w-full max-w-7xl px-4 py-8">
  {/* Content */}
</div>

// Responsive padding (more on desktop)
<div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-8 lg:px-8">
  {/* Content */}
</div>
```

---

## Component Patterns

### Buttons

#### Size Variants (from `button.config.ts`)
```tsx
// Use existing size variants
<Button size="sm">Small Button</Button>   // Mobile-friendly
<Button size="default">Default</Button>   // Standard size
<Button size="md">Medium</Button>         // Larger target

// Responsive size override (if needed)
<Button size="sm" className="md:px-6 md:py-3">
  Responsive Button
</Button>
```

#### Button Groups
```tsx
// Stack on mobile, horizontal on tablet+
<div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
  <Button variant="default">Primary</Button>
  <Button variant="secondary">Secondary</Button>
</div>

// Full-width on mobile, auto on tablet+
<div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
  <Button className="w-full sm:w-auto">Action 1</Button>
  <Button className="w-full sm:w-auto">Action 2</Button>
</div>
```

### Typography

#### Responsive Headings
```tsx
// Scale down on mobile, full size on desktop
<h1 className="text-3xl font-heading font-bold md:text-4xl lg:text-5xl">
  Main Title
</h1>

<h2 className="text-2xl font-heading font-semibold md:text-3xl lg:text-4xl">
  Section Title
</h2>

<h3 className="text-xl font-heading font-semibold md:text-2xl">
  Subsection Title
</h3>
```

#### Responsive Body Text
```tsx
// Readable line length on all screens
<p className="text-base leading-relaxed md:text-lg md:leading-loose">
  Lorem ipsum dolor sit amet...
</p>

// Constrained width for readability
<p className="max-w-prose text-base leading-relaxed">
  Long-form content that should not span too wide...
</p>
```

### Forms

#### Form Layouts
```tsx
// Single column form (mobile-friendly)
<form className="flex flex-col gap-4">
  <Input label="Name" />
  <Input label="Email" />
  <Button type="submit">Submit</Button>
</form>

// Two-column form on larger screens
<form className="grid gap-4 md:grid-cols-2">
  <Input label="First Name" />
  <Input label="Last Name" />
  <Input label="Email" className="md:col-span-2" />
  <Button type="submit" className="md:col-span-2">Submit</Button>
</form>
```

#### Input Sizing
```tsx
// Full-width inputs with proper touch targets
<input 
  type="text"
  className="w-full h-12 rounded-md border border-neutral-400 px-4 text-base focus-ring"
/>

// Responsive input groups
<div className="flex flex-col gap-2 sm:flex-row">
  <input className="flex-1 h-12 px-4" placeholder="Search..." />
  <Button size="default">Search</Button>
</div>
```

### Modals & Drawers

#### Mobile: Bottom Sheet, Desktop: Centered Modal
```tsx
const MyModal = ({ isOpen, onClose, children }) => {
  const isMobile = useIsMobile()
  
  if (isMobile) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-end justify-center">
          <DialogPanel className="w-full rounded-t-2xl bg-white p-6 max-h-[90vh] overflow-y-auto">
            {children}
          </DialogPanel>
        </div>
      </Dialog>
    )
  }
  
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-md w-full rounded-2xl bg-white p-6 shadow-xl">
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
```

#### Side Drawer (from `name-detail-drawer.tsx`)
```tsx
// Full-height drawer, responsive width
<Transition show={isOpen}>
  <Dialog onClose={onClose} className="relative z-50">
    <TransitionChild>
      <div className="fixed inset-0 bg-black/30" />
    </TransitionChild>
    
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
          <TransitionChild>
            <DialogPanel className="pointer-events-auto w-screen max-w-md drawer-shadow">
              <div className="flex h-full flex-col overflow-y-auto bg-white">
                {/* Drawer content */}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </div>
  </Dialog>
</Transition>
```

### Dropdowns & Menus

#### Adaptive Dropdown (Use Existing Pattern)
```tsx
// Mobile: Bottom sheet, Desktop: Positioned dropdown
import { Dropdown } from '@src/features/names/components/dropdown'

<Dropdown
  dropDownButton={<>Filter</>}
  dropDownItem={
    <div className="surface-card p-4">
      {/* Menu items */}
    </div>
  }
/>
```

#### Custom Responsive Menu
```tsx
const MyMenu = () => {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  
  if (isMobile) {
    // Bottom sheet implementation
    return (/* ... */)
  }
  
  // Desktop dropdown
  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(true)}>Menu</Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-neutral-200 bg-white shadow-lg z-10">
          {/* Menu items */}
        </div>
      )}
    </div>
  )
}
```

---

## Navigation Patterns

### Header Navigation

#### Desktop: Horizontal Menu, Mobile: Hamburger
```tsx
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <header className="border-b border-stroke-subtle bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Mobile layout */}
        <div className="flex items-center justify-between md:hidden">
          <Logo />
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="h-10 w-10 flex items-center justify-center"
          >
            <MenuIcon />
          </button>
        </div>
        
        {/* Desktop layout */}
        <div className="hidden md:flex md:items-center md:justify-between md:gap-6">
          <Logo />
          <nav className="flex gap-6">
            <NavLink to="/search">Search</NavLink>
            <NavLink to="/favorites">Favorites</NavLink>
            <NavLink to="/account">Account</NavLink>
          </nav>
          <UserMenu />
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  )
}
```

### Tabs

#### Responsive Tab Navigation
```tsx
// Horizontal scroll on mobile, full width on desktop
<div className="border-b border-neutral-200">
  <nav className="flex gap-2 overflow-x-auto px-4 md:gap-6 md:justify-center" aria-label="Tabs">
    <button className="whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm hover:border-neutral-400">
      Tab 1
    </button>
    <button className="whitespace-nowrap border-b-2 border-brand-700 px-3 py-3 text-sm text-brand-700">
      Tab 2 (Active)
    </button>
    <button className="whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm hover:border-neutral-400">
      Tab 3
    </button>
  </nav>
</div>
```

---

## Spacing & Sizing

### Responsive Spacing
```tsx
// Margin/Padding scales with screen size
<div className="p-4 md:p-6 lg:p-8">
  {/* Content with responsive padding */}
</div>

<div className="space-y-4 md:space-y-6 lg:space-y-8">
  {/* Vertical spacing that grows */}
</div>

// Gap in flex/grid containers
<div className="flex gap-2 md:gap-4 lg:gap-6">
  {/* Responsive gap */}
</div>
```

### Responsive Sizing
```tsx
// Width constraints
<div className="w-full md:w-2/3 lg:w-1/2">
  {/* 100% → 66% → 50% */}
</div>

// Height constraints (use sparingly)
<div className="h-64 md:h-80 lg:h-96">
  {/* 256px → 320px → 384px */}
</div>

// Max-width utilities
<div className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
  {/* Progressively larger max-width */}
</div>
```

---

## Images & Media

### Responsive Images
```tsx
// Maintain aspect ratio, responsive sizing
<img 
  src={imageSrc}
  alt="Description"
  className="w-full h-auto rounded-lg"
/>

// Object-fit for specific dimensions
<div className="aspect-square w-full overflow-hidden rounded-lg">
  <img 
    src={imageSrc}
    alt="Description"
    className="h-full w-full object-cover"
  />
</div>

// Different aspect ratios per breakpoint
<div className="aspect-video md:aspect-square lg:aspect-[4/3]">
  <img src={imageSrc} className="h-full w-full object-cover" />
</div>
```

### Avatar Sizing
```tsx
// Small avatar (existing pattern from UserMenu)
<div className="size-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
  {avatarUrl ? (
    <img src={avatarUrl} alt="Avatar" className="size-full object-cover" />
  ) : (
    <div className="flex items-center justify-center size-full text-sm font-medium">
      {initials}
    </div>
  )}
</div>

// Responsive avatar size
<div className="size-12 md:size-16 lg:size-20 rounded-full bg-gray-200 overflow-hidden">
  <img src={avatarUrl} className="size-full object-cover" />
</div>
```

---

## Visibility & Display

### Hide/Show at Breakpoints
```tsx
// Hide on mobile, show on desktop
<div className="hidden md:block">
  Desktop-only content
</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">
  Mobile-only content
</div>

// Show on tablet only
<div className="hidden md:block lg:hidden">
  Tablet-only content
</div>
```

### Conditional Rendering vs CSS Classes
```tsx
// ✅ PREFERRED - Use CSS classes for simple hide/show
<Button className="hidden md:block">Desktop Button</Button>

// ⚠️ USE SPARINGLY - Conditional rendering for different UIs
{isMobile ? (
  <MobileBottomSheet />
) : (
  <DesktopModal />
)}

// ✅ PREFERRED - Use existing useMobile hook for complex logic
const isMobile = useIsMobile()
if (isMobile) {
  return <MobileView />
}
return <DesktopView />
```

---

## Testing Responsive Layouts

### Manual Testing Checklist
Test at these key breakpoints:
- [ ] **320px** - iPhone SE (smallest common mobile)
- [ ] **375px** - iPhone 12/13/14 Pro
- [ ] **414px** - iPhone 14 Plus
- [ ] **768px** - iPad Mini (tablet breakpoint)
- [ ] **1024px** - iPad Pro / Desktop (desktop breakpoint)
- [ ] **1440px** - Common desktop resolution

### Browser DevTools
```
Chrome DevTools:
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device preset or enter custom dimensions
4. Test interactions (hover, click, scroll)
```

### Common Issues to Check
- [ ] Touch targets are at least 44x44px
- [ ] Text is readable (min 16px for body text on mobile)
- [ ] No horizontal scroll on any breakpoint
- [ ] Forms are usable on mobile (inputs not too small)
- [ ] Modals/drawers don't overflow on small screens
- [ ] Images scale properly without distortion
- [ ] Navigation is accessible on all screen sizes

---

## Anti-Patterns (Avoid These)

### ❌ Fixed Pixel Widths
```tsx
// ❌ BAD - Breaks on small screens
<div className="w-[800px]">Content</div>

// ✅ GOOD - Flexible width
<div className="w-full max-w-3xl mx-auto px-4">Content</div>
```

### ❌ Ignoring Mobile-First
```tsx
// ❌ BAD - Desktop-first requires many overrides
<div className="grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">

// ✅ GOOD - Mobile-first is cleaner
<div className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
```

### ❌ Tiny Touch Targets on Mobile
```tsx
// ❌ BAD - Too small for touch
<button className="h-6 w-6 text-xs">×</button>

// ✅ GOOD - Adequate touch target
<button className="h-10 w-10 flex items-center justify-center">
  <span className="text-xs">×</span>
</button>
```

### ❌ Overusing Breakpoint Overrides
```tsx
// ❌ BAD - Too many breakpoint overrides
<div className="p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-8">

// ✅ GOOD - Use semantic spacing
<div className="p-4 lg:p-6">
```

### ❌ Not Testing on Real Devices
```tsx
// Browser DevTools are helpful but:
// - Don't perfectly simulate touch interactions
// - May miss performance issues
// - Can't test in real-world lighting conditions

// ✅ GOOD - Test on actual devices when possible
// Use BrowserStack, real phones/tablets, or ask QA team
```

---

## Quick Reference

### Common Responsive Patterns
```tsx
// Card grid (most common)
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

// Sidebar layout
<div className="grid gap-6 md:grid-cols-[220px_1fr]">

// Flex stack → row
<div className="flex flex-col gap-4 md:flex-row md:items-center">

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">

// Responsive text size
<h1 className="text-3xl md:text-4xl lg:text-5xl">

// Hide on mobile
<div className="hidden md:block">

// Mobile only
<div className="block md:hidden">

// Content container
<div className="mx-auto w-full max-w-7xl px-4">
```

### Breakpoint Usage Guidelines
- **sm (640px)**: Rarely needed (mobile → tablet transition)
- **md (768px)**: PRIMARY breakpoint (mobile → desktop)
- **lg (1024px)**: Common for 3-column layouts, larger spacing
- **xl (1280px)**: Use sparingly for very large screens
- **2xl (1536px)**: Rarely needed, avoid unless necessary

---

## Additional Resources

### Project-Specific Files
- `src/app/shared/hooks/useMobile.ts` - Mobile detection hook
- `src/features/names/components/dropdown.tsx` - Adaptive dropdown example
- `src/app/shared/components/content-wrapper/content-wrapper.tsx` - Container utility
- `src/features/favorites/pages/favorites-page.tsx` - Responsive grid example
- `src/features/account/layout/account-layout.tsx` - Sidebar layout example

### External Documentation
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [WCAG Touch Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [MDN Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)

---

## Workflow for Adding Responsive Design

### Step-by-Step Process
1. **Design mobile layout first**
   - Start with single-column layouts
   - Ensure touch targets are adequate
   - Test on smallest supported device (320px)

2. **Add tablet breakpoint (md:768px)**
   - Introduce 2-column grids where appropriate
   - Adjust spacing if needed
   - Test horizontal layouts (flexbox row)

3. **Add desktop breakpoint (lg:1024px)**
   - Expand to 3+ columns for grids
   - Increase spacing/padding
   - Show desktop-only UI elements

4. **Refine and test**
   - Check all breakpoints in DevTools
   - Test on real devices if possible
   - Verify accessibility (keyboard nav, screen readers)

5. **Document patterns**
   - If you create a new reusable pattern, add it here
   - Share with team in PR description

---

**Version**: 1.0  
**Last Updated**: 2026-06-06  
**Maintainer**: Nomena Development Team
