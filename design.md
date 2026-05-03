# Nomena - Product & Design Brief for Pencil.dev

## 1. Purpose of this document

This document is meant to be used as design context for Pencil.dev.

Its goal is to explain the project in enough detail that a new design system and a new visual direction can be generated **from scratch**, based on product needs, user flows, information architecture, and functional requirements, **not** on the UI currently implemented in code.

Use the current application only as a source of truth for:

- product scope
- routes and pages
- user actions
- data entities
- functional states
- technical constraints

Do **not** use the current styling, spacing, color choices, typography, or component aesthetics as a design reference.

---

## 2. Project summary

**Nomena** is a web application for discovering, comparing, saving, and sharing baby names.

The product is built around four core jobs:

1. Help users explore names quickly.
2. Help users understand each name through metadata such as origin, meaning, gender, popularity, and ranking.
3. Help users save favorite names for later review.
4. Help couples compare favorites and detect name matches.

The product is currently focused on Spanish-speaking users and uses name data sourced from Spanish public records and external enrichment sources.

---

## 3. Product vision

The ideal product feeling is:

- intimate, warm, and trustworthy
- curated rather than overwhelming
- emotionally resonant, but still practical
- useful for repeated visits, not only for one-time browsing

This is not a generic database browser. It should feel closer to:

- a discovery experience
- a personal shortlist tool
- a collaborative decision space for two people

---

## 4. Primary users

### 4.1 Expecting parents

Users who want to browse names, learn what they mean, and build a shortlist.

Needs:

- fast scanning
- meaningful filtering
- confidence in the information shown
- easy comparison between many options

### 4.2 Couples making a shared decision

Two users who want to collect favorites independently and later compare them.

Needs:

- frictionless sharing
- clear visibility into overlaps
- low-conflict collaborative experience
- simple invite and pairing flow

### 4.3 Curious explorers

Users who may browse names without registering at first, but might later create an account to save favorites.

Needs:

- immediate value before commitment
- clear incentive to sign in
- continuity when moving from anonymous to authenticated usage

---

## 5. Product pillars

The new design system should support these pillars:

### 5.1 Discovery first

Search and browsing are the center of the product.

### 5.2 Clarity over density

The app contains multiple data points per name. The design should prioritize hierarchy and readability instead of trying to show everything with equal weight.

### 5.3 Emotional utility

Choosing a name is practical and emotional. The interface should support both dimensions.

### 5.4 Collaboration without complexity

The couple feature should feel obvious, welcoming, and low-friction.

### 5.5 Repeatable decision-making

Users should be able to return often, continue where they left off, and refine choices gradually.

---

## 6. Technology context

Current stack:

- React 19
- TypeScript
- Vite
- React Router
- Firebase Auth
- Firestore
- TanStack Query
- Zustand

This matters for design because:

- authenticated and unauthenticated states both exist
- data loading and incremental pagination exist
- real-time or near-real-time updates can happen in shared favorites
- pages are application views, not a marketing website

---

## 7. Information architecture

Top-level routes currently implemented:

- `/search`
- `/account/profile`
- `/account/favorites`
- `/account/couple`
- `/login`
- `/register`
- `*` not found page

Recommended IA interpretation for redesign:

### Public area

- Login
- Register
- Not found

### Main app area

- Explore names
- Account

### Account subsections

- Profile
- Favorites
- Couple sharing

Even if the navigation is redesigned, these functional areas should remain available.

---

## 8. Functional page inventory

## 8.1 Search / Explore page

Route: `/search`

This is the main product page and should be treated as the primary experience.

Current functionality:

- list of names in a grid
- text query input
- quick filtering by initial letter
- gender filters
- pagination / load more behavior
- click on a name to open a detail panel
- add or remove favorite

Data shown in the discovery experience:

- name
- gender
- origin
- popularity or usage score
- favorite state

Data shown in the detail view:

- name
- gender
- origin
- meaning
- usage count or popularity indicator
- ranking in Spain
- length and length category
- favorite action
- previous / next navigation across the current result set

Design intent for this page:

- support quick scan across many names
- allow refinement without cognitive overload
- make detail reading feel immersive and reassuring
- make favoriting fast and obvious

Critical UX states:

- initial loading
- empty results
- results loaded
- loading more results
- network or query error
- unauthenticated favorite attempt
- detail panel open

---

## 8.2 Login page

Route: `/login`

Current purpose:

- allow users to authenticate with email and password
- redirect authenticated users away from this page

Design intent:

- make sign-in feel lightweight and trustworthy
- explain why account creation is useful
- reduce friction for users who were already exploring

Important UX considerations:

- form validation
- error messaging
- loading state while authenticating
- link to registration
- clear return path into the app

---

## 8.3 Register page

Route: `/register`

Current purpose:

- create an account with email and password
- redirect authenticated users into the app

Design intent:

- make the value of registration explicit
- connect registration to favorites and couple comparison
- keep the form short and focused

Important UX considerations:

- form validation
- password requirements
- duplicate account errors
- loading state
- link to sign in

---

## 8.4 Favorites page

Route: `/account/favorites`

Current purpose:

- show the user's saved names
- show partner favorites when connected
- show shared matches between both users

Current structure:

- tabbed views
- count per tab
- list of name cards

Core content sections:

- My favorites
- Partner favorites
- Shared favorites / matches

Design intent:

- make this page feel like a decision workspace, not just a saved-items dump
- emphasize intersections and collaboration
- help users move from collection to evaluation

Critical UX states:

- loading
- user has no favorites
- user has favorites but no partner connected
- partner connected but partner has no favorites
- there are no overlaps yet
- there are shared matches

Opportunity for a redesign:

- this page can become the emotional center of the product
- shared matches should feel more meaningful than a plain filtered list

---

## 8.5 Couple / Sharing page

Route: `/account/couple`

Current purpose:

- generate an invite code
- copy and share that code externally
- redeem an invite code from another user
- view connected partner(s)
- remove an existing partner connection

Functional behavior:

- generated code expires after 48 hours
- generating a new code invalidates the previous one
- redeeming a code connects both users through shared favorites relationships

Design intent:

- make collaboration setup feel simple and safe
- reduce anxiety around codes and connection states
- give users confidence about what happens after pairing

Critical UX states:

- no partner connected
- partner connected
- code generated
- copy confirmed
- code invalid or expired
- code redeem in progress
- partner removal in progress

This page should likely feel more guided and explanatory than the current implementation.

---

## 8.6 Profile page

Route: `/account/profile`

Current purpose:

- show the current authenticated email
- placeholder for future security settings

Current implementation status:

- incomplete
- email and password update forms are not implemented yet

Design intent:

- make it a calm, low-frequency settings area
- focus on identity, account access, and trust

Possible future content:

- email management
- password change
- account deletion
- notification preferences
- profile naming or couple label customization

---

## 8.7 Not found page

Route: fallback

Purpose:

- recover users gracefully when a route does not exist
- give a clear path back to search or account

---

## 9. Main user flows

## 9.1 Explore and favorite a name

1. User lands on Explore.
2. User scans names or filters by query, letter, or gender.
3. User opens a name detail view.
4. User favorites a name.
5. If the user is authenticated, the action is saved.
6. If the user is not authenticated, the system should guide the user to sign in without losing intent.

Design implication:

- favoriting should be a highly optimized action
- the sign-in interruption should preserve continuity

## 9.2 Build a shortlist over time

1. User explores multiple sessions.
2. User saves favorites gradually.
3. User reviews favorites later in a dedicated page.
4. User compares candidates and narrows down options.

Design implication:

- favorites should feel durable and easy to revisit
- the system should support long-form decision making

## 9.3 Pair with a partner

1. User generates an invite code.
2. User sends the code outside the app.
3. Second user redeems the code.
4. Both users become connected.
5. Shared and partner favorites become available.

Design implication:

- the page should explain the before and after state clearly
- pairing should feel like an upgrade to the product experience

## 9.4 Find overlapping favorites

1. Both users save favorites independently.
2. The app computes which names exist in both sets.
3. Shared matches are presented as a distinct subset.

Design implication:

- shared matches deserve a distinct visual treatment
- they should feel celebratory and high-value

---

## 10. Domain entities

## 10.1 Name

Core fields currently present in the product:

- id
- name
- normalized name
- gender
- meaning
- origin
- usage score
- Spain popularity rank
- length
- length category

Design meaning:

- `name` is the hero content
- `meaning` and `origin` are explanatory metadata
- `gender`, `length`, and popularity are comparison signals
- not every field needs equal prominence in list and detail contexts

## 10.2 Favorite collection

Current behavior:

- stored per user
- linked to name ids
- includes relationship metadata for sharing with partner accounts

Design meaning:

- favorites are not just bookmarks
- they are a persistent shortlist and a collaboration layer

## 10.3 Invite code

Current behavior:

- generated per user
- time-limited
- used to connect accounts

Design meaning:

- this is a transactional artifact
- it needs clarity, trust, and obvious feedback

## 10.4 Authenticated user

Current fields visible to the app:

- uid
- email
- optional display name data in backend support flows

Design meaning:

- identity UI is currently lightweight
- account surfaces should remain simple until more profile features exist

---

## 11. Core product objects to represent visually

The design system will need flexible patterns for:

- name cards
- favorite states
- filters
- detail overlays or drawers
- tab navigation
- account sub-navigation
- invite code display
- empty states
- loading states
- error states
- success feedback
- paired-user or shared-state indicators

---

## 12. Existing component responsibilities

These are not design references. They are behavior references.

### 12.1 Header

Responsibilities:

- app navigation
- access to auth actions
- access to key app areas
- display count hints, such as favorites total

### 12.2 Name card

Responsibilities:

- quick scan of a single name
- metadata preview
- favorite action
- open detailed view

### 12.3 Name detail panel

Responsibilities:

- full contextual reading for one name
- next and previous navigation across currently loaded results
- favorite action inside detail context

### 12.4 Account layout

Responsibilities:

- secondary navigation within account area
- content container for profile, favorites, and sharing views

### 12.5 Auth forms

Responsibilities:

- validation
- submission feedback
- redirect continuity

---

## 13. Design system brief

The new design system should be created without inheriting the current UI language.

It should be conceived as a modular system for a product with two emotional modes:

- exploratory mode
- decision and comparison mode

### 13.1 Brand attributes

Suggested brand attributes:

- warm
- considered
- contemporary
- editorial
- human
- trustworthy
- non-clinical
- not childish

Avoid a visual direction that feels:

- overly generic SaaS
- playful in a toy-like way
- wedding-themed
- overly feminine or overly masculine
- crowded or dashboard-heavy

### 13.2 Visual direction recommendations

Pencil.dev should propose a design system with:

- a clear typographic personality
- generous white space and pacing
- emphasis on names as primary content
- elegant handling of metadata
- a visual distinction between browsing, saving, and matching

Suggested references in spirit, not in direct imitation:

- editorial product interfaces
- modern lifestyle products
- calm premium consumer apps

### 13.3 Color strategy

Do not assume the current app colors are valid.

Recommended approach:

- one main brand color for emphasis
- one support accent for collaborative or positive states
- a restrained neutral scale
- semantic colors for success, warning, error, and info

Color roles needed:

- page background
- surface background
- elevated surface
- text primary
- text secondary
- border subtle
- border strong
- action primary
- action secondary
- favorite state
- shared match state
- loading / skeleton tones

### 13.4 Typography strategy

Typography is especially important because the main content is names.

The system should define:

- display style for featured names
- heading scale
- body scale
- metadata scale
- compact navigation scale

Names should have a recognizably different treatment from supporting metadata.

### 13.5 Shape and density

Recommended direction:

- soft geometry over hard corporate rectangles
- moderate rounding
- enough density for browsing many names
- enough breathing room for reflective reading in detail views

### 13.6 Motion

Motion should be calm and purposeful.

Key places where motion matters:

- opening the name detail panel
- switching tabs on favorites
- showing favorite confirmation
- generating and copying invite codes
- loading and revealing search results

Avoid excessive decorative motion.

---

## 14. Design tokens Pencil.dev should define

The design output should include at least:

- color tokens
- typography tokens
- spacing scale
- border radius scale
- shadow or elevation tokens
- motion durations and easing
- icon sizing
- breakpoints
- component state tokens

State tokens should account for:

- default
- hover
- pressed
- focus visible
- selected
- active
- disabled
- loading
- success
- error

---

## 15. Component inventory for the new design system

Pencil.dev should design or specify these component families:

### 15.1 Navigation

- top navigation bar
- mobile navigation pattern
- account side navigation or equivalent responsive alternative
- breadcrumb or contextual page heading pattern if needed

### 15.2 Search and filtering

- search input
- chip or segmented filters
- alphabetical quick filter
- active filter summary
- reset filters action

### 15.3 Name browsing

- name card in grid form
- name card in list form if needed
- popularity indicator
- gender badge
- origin tag
- favorite toggle control

### 15.4 Detail experience

- drawer, sheet, modal, or split-view detail pattern
- previous / next navigation controls
- sectioned metadata blocks
- sticky or persistent action area

### 15.5 Favorites workspace

- tabs or segmented content navigation
- shared match highlight card
- empty-state modules
- count indicators
- optional comparison aids

### 15.6 Couple sharing

- invite code card
- copy interaction pattern
- redeem form
- connected partner row or card
- confirmation and warning states

### 15.7 Forms and feedback

- auth form fields
- buttons and button groups
- inline validation messages
- banners or notices
- toast notifications
- loading placeholders
- error states

---

## 16. Page-by-page design guidance

## 16.1 Explore page

The new design should treat this page as the product homepage.

Recommended structure:

- strong page heading or discovery framing
- primary search control
- visible filter area
- results area with clear density strategy
- persistent or easy-to-access detail view

Important balance:

- browsing many names must feel fast
- reading one name in depth must feel calm

## 16.2 Favorites page

This page should feel less like storage and more like progress.

Recommended emphasis:

- saved collection overview
- meaningful match area
- partner context
- no-results and no-overlap states that still feel encouraging

## 16.3 Couple page

This page should feel guided.

Recommended emphasis:

- explanation of why to connect
- clear distinction between generating and redeeming code
- visible trust cues around validity and expiration
- clear post-connection state

## 16.4 Auth pages

These pages should be lighter and calmer than the app workspace pages.

Recommended emphasis:

- concise value proposition
- clear form hierarchy
- low-friction transitions between login and register

## 16.5 Profile page

This page should be simple and sparse.

Recommended emphasis:

- account identity
- security settings area
- future extensibility without looking unfinished

---

## 17. Responsive behavior

The product must work well on desktop and mobile.

Design expectations:

- the search experience should remain usable on small screens
- filters may collapse or convert into bottom sheets or horizontal chips
- the detail experience may shift from side drawer to full-screen sheet on mobile
- account navigation may become segmented controls, tabs, or a stacked menu
- favorites and shared matches should preserve clarity on narrow widths

Recommended breakpoint thinking:

- compact mobile
- large mobile / small tablet
- tablet
- desktop
- wide desktop

---

## 18. Accessibility requirements

The new design system should assume accessibility is required.

Include support for:

- keyboard navigation
- visible focus states
- sufficient color contrast
- semantic hierarchy in headings
- accessible labels for interactive controls
- clear error messaging
- non-color-only meaning for favorites and matches
- touch-friendly target sizes on mobile

Special attention areas:

- favorite toggles
- tab navigation
- drawer or modal interactions
- code copy and redeem flows

---

## 19. Content tone

The interface tone should be:

- clear
- human
- calm
- supportive
- not overly cute
- not overly technical

Writing style recommendations:

- short labels
- plain-language helper text
- emotionally intelligent empty states
- direct, friendly confirmations

Because the product is in Spanish, final UX copy should likely be designed in Spanish first, not translated from English as a second step.

---

## 20. Key states Pencil.dev must account for

Design outputs should include at least these states:

- explore loading
- explore empty result
- explore error
- detail view open
- name favorited
- name not favorited
- auth required interruption
- favorites empty
- partner not connected
- partner connected but no favorites yet
- no shared matches yet
- shared matches available
- invite code generated
- invite code copied
- invite code expired or invalid
- form validation error
- not found page

---

## 21. Constraints and realities of the current product

These are real product constraints that design should respect:

- authentication exists and gates some actions
- favorites are persistent per user
- partner comparison depends on account pairing
- invite codes are time-limited
- name data includes both short metadata and richer detail data
- profile management is currently minimal

These are current product gaps the design may prepare for:

- profile editing is incomplete
- richer account settings do not yet exist
- error recovery patterns are still basic
- favorites comparison can be made more meaningful than it is now

---

## 22. Explicit instruction for Pencil.dev

Design a full design system and product UI direction for **Nomena** based on this brief.

Important constraints:

- Do not replicate the existing UI aesthetic.
- Treat the current implementation as a functional MVP only.
- Optimize the new system for browsing many names, saving favorites quickly, and celebrating partner matches.
- Prioritize editorial clarity, emotional warmth, and collaborative decision-making.
- Design for responsive web first, with strong desktop and mobile behavior.
- Include component states, empty states, loading states, and interaction feedback.
- Make the search and name detail experience the strongest part of the product.

Deliverables expected from Pencil.dev:

- visual direction
- design principles
- color system
- typography system
- spacing and layout logic
- component library
- page compositions
- responsive adaptations
- interaction states
- accessibility considerations

---

## 23. Short prompt version

If a shorter prompt is needed inside Pencil.dev, use this:

> Design a new responsive web design system and product UI for Nomena, a baby-name discovery app for Spanish-speaking users. Users explore names, read details such as meaning, origin, popularity and ranking, save favorites, and connect with their partner via invite code to compare favorite names and see shared matches. Do not use the current app UI as inspiration. Create a warm, editorial, modern, trustworthy, human-centered visual system optimized for discovery, shortlist building, and collaborative decision-making. Include Explore, Login, Register, Favorites, Couple Sharing, Profile, and Not Found pages, plus all major states such as loading, empty, error, favorited, not favorited, partner connected, no matches, code copied, and invalid invite code.