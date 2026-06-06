# Análisis de Diseños Mobile vs Código Actual

**Fecha**: 2026-06-06  
**Diseños analizados**: 6 pantallas mobile de Pencil (nomena.pen)  
**Referencia**: Node IDs: n6D4m8, VCO2V, OZA2y, K286X, SnL0A, Ztbgt

---

## 1. Explore - Search (Mobile) [n6D4m8]

### Diseño Pencil
- **Ancho**: 390px (iPhone)
- **Layout**: Vertical stack con gap 16px
- **Header**: 56px altura, logo + search + menu icons
- **Hero Section**:
  - Title: "Descubre el nombre perfecto" (24px, Josefin Sans, bold)
  - Search bar: 390px width, 8px radius, padding 14/16, con icon
  - Alphabet row: Letras A-Z horizontal (fontSize 12px, gap 5px)
  - Gender filters: 4 pills (Todos, Femenino, Masculino, Unisex) con cornerRadius 999
- **Content**: Grid 2 columnas (gap 12px, padding 0/16/24/16)

### Código Actual
**Archivo**: `src/features/names/pages/search-page.tsx`

```tsx
// ❌ PROBLEMA: Grid fijo de 4 columnas, NO responsive
<div className="grid grid-cols-4 gap-4">
  {allNames.map((name) => (
    <NameCard key={name.normalizedName} name={name.name} ... />
  ))}
</div>
```

**Archivo**: `src/features/names/components/hero-search.tsx`
- ✅ Tiene header sticky con IntersectionObserver
- ⚠️ Falta adaptación mobile para:
  - Title responsivo (actualmente no ajusta tamaño)
  - Search bar adaptado
  - Alphabet row con scroll horizontal en mobile
  - Gender filters en mobile

### Recomendaciones

#### 1. Hacer grid responsive en SearchPage
```tsx
// src/features/names/pages/search-page.tsx
<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
  {allNames.map((name) => (
    <NameCard key={name.normalizedName} name={name.name} ... />
  ))}
</div>
```

#### 2. Hero responsive
```tsx
// src/features/names/components/hero-search.tsx
<div className="mx-auto max-w-7xl px-4 py-4 text-center">
  {/* Title */}
  <h1 className="text-2xl font-heading font-semibold md:text-3xl lg:text-4xl">
    Descubre el nombre perfecto
  </h1>
  
  {/* Search bar */}
  <div className="mt-4 flex items-center gap-3 rounded-lg border border-neutral-400 bg-white px-4 py-3.5 md:py-4">
    <SearchIcon className="size-4.5 text-neutral-500 md:size-5" />
    <input 
      placeholder="Buscar nombres..."
      className="flex-1 text-sm text-neutral-500 md:text-base"
    />
  </div>
  
  {/* Alphabet row - scroll horizontal en mobile */}
  <div className="mt-3 flex gap-1.5 overflow-x-auto pb-2 md:justify-center md:gap-2 md:overflow-visible">
    {alphabet.map(letter => (
      <button 
        key={letter}
        className="shrink-0 text-xs text-neutral-500 hover:text-brand-700 md:text-sm"
      >
        {letter}
      </button>
    ))}
  </div>
  
  {/* Gender filters */}
  <div className="mt-3 flex gap-2 overflow-x-auto md:justify-center md:gap-3">
    <GenderButton active>Todos</GenderButton>
    <GenderButton>Femenino</GenderButton>
    <GenderButton>Masculino</GenderButton>
    <GenderButton>Unisex</GenderButton>
  </div>
</div>
```

---

## 2. Explore - Scrolled (Mobile) [VCO2V]

### Diseño Pencil
- **Sticky bar**: 
  - Search bar compacta (padding 10/12, fontSize 13px)
  - Alphabet dropdown (A-Z con chevron)
  - Filter button con badge indicator
  - Border bottom + bg white
- **Content**: Grid 2 columnas + summary bar al final

### Código Actual
**Archivo**: `src/features/names/components/hero-search.tsx`
- ✅ Ya tiene IntersectionObserver para sticky header
- ⚠️ Falta:
  - Search bar más compacta cuando sticky
  - Dropdown de alphabet en sticky state
  - Filter button con badge

### Recomendaciones

#### Crear StickySearchBar component
```tsx
// src/features/names/components/sticky-search-bar.tsx
export const StickySearchBar = ({ isFixed }: { isFixed: boolean }) => {
  if (!isFixed) return null
  
  return (
    <div className="sticky top-14 z-40 border-b border-neutral-200 bg-white px-4 py-2.5">
      <div className="flex gap-2.5">
        {/* Search bar compacta */}
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-neutral-400 bg-white px-3 py-2.5">
          <SearchIcon className="size-4 text-neutral-500" />
          <span className="text-sm text-neutral-500">Buscar nombres...</span>
        </div>
        
        {/* Alphabet dropdown */}
        <Dropdown
          dropDownButton={
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-neutral-700">A-Z</span>
              <ChevronDownIcon className="size-3 text-neutral-500" />
            </div>
          }
          dropDownItem={<AlphabetList />}
          className="rounded-lg border border-neutral-400 bg-white px-3 py-2.5"
        />
        
        {/* Filter button */}
        <button className="relative rounded-lg border border-neutral-400 bg-white px-3 py-2.5">
          <FilterIcon className="size-3.5 text-neutral-700" />
          {hasFilters && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-brand-700 text-[10px] font-medium text-white">
              {filterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
```

#### Integrar en hero-search.tsx
```tsx
// Usar isFixed del IntersectionObserver
const [isFixed, setIsFixed] = useState(false)

return (
  <>
    <div ref={sentinelRef} />
    <StickySearchBar isFixed={isFixed} />
    <div className={cn("bg-white", isFixed && "pt-[60px]")}>
      {/* Hero content original */}
    </div>
  </>
)
```

---

## 3. Favorites (Mobile) [OZA2y]

### Diseño Pencil
- **Header**: Logo + menu (sin search icon)
- **Title section**: 
  - "Tus favoritos" (24px)
  - Subtitle explicativo (13px, color #A9A19A)
- **Tabs**: 3 tabs horizontales con border-bottom indicator
- **Match section**: Banner verde con coincidencias + 3 cards
- **Grid**: 2 columnas (gap 12px)

### Código Actual
**Archivo**: `src/features/favorites/pages/favorites-page.tsx`

```tsx
// ✅ YA TIENE grid responsive
<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
```

### Mejoras Necesarias

#### 1. Header sin search en mobile
```tsx
// src/app/shared/components/header/header.tsx
const isMobile = useIsMobile()

<header className="border-b border-stroke-subtle bg-white">
  <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
    <Logo />
    {!isMobile && <Menu items={menuItems} />}
    {isMobile ? (
      <MenuIcon className="size-6" />
    ) : (
      actions
    )}
  </div>
</header>
```

#### 2. Añadir subtitle en FavoritesPage
```tsx
<div className="px-4 pt-4 md:px-6">
  <h1 className="text-2xl font-heading font-semibold md:text-3xl">
    Tus favoritos
  </h1>
  <p className="mt-1.5 text-sm text-neutral-500 md:text-base">
    Organiza y compara tus nombres favoritos
  </p>
</div>
```

#### 3. Tabs responsive
```tsx
<div className="border-b border-neutral-200">
  <nav className="flex gap-1 overflow-x-auto px-4 md:gap-2">
    <button className="shrink-0 border-b-2 border-brand-700 px-2 py-3 text-xs font-semibold text-brand-700 md:text-sm">
      Mis favoritos (8)
    </button>
    <button className="shrink-0 border-b-2 border-transparent px-2 py-3 text-xs font-medium text-neutral-700 md:text-sm">
      De mi pareja (6)
    </button>
    <button className="shrink-0 border-b-2 border-transparent px-2 py-3 text-xs font-medium text-neutral-700 md:text-sm">
      Coincidencias (3)
    </button>
  </nav>
</div>
```

#### 4. Match banner (nuevo componente)
```tsx
// src/features/favorites/components/match-banner.tsx
export const MatchBanner = ({ count }: { count: number }) => (
  <div className="rounded-xl bg-success-light p-4 md:p-5">
    <div className="flex items-center gap-2.5 mb-3">
      <SparklesIcon className="size-4.5 text-success md:size-5" />
      <h3 className="text-sm font-semibold md:text-base">
        {count} coincidencias con tu pareja
      </h3>
    </div>
    <div className="space-y-2">
      {/* Cards de coincidencias */}
    </div>
  </div>
)
```

---

## 4. Couple Sharing (Mobile) [K286X]

### Diseño Pencil
- **Hero centered**: Icon + title + description (width 300px)
- **Two cards**: Invite card + Redeem card
  - Corner radius: 16px
  - Padding: 24px
  - Gap entre elementos: 16px
- **Buttons**: Full width, 48px height

### Código Actual
**Archivo**: `src/features/couple/pages/*` (varios archivos)
- ⚠️ Verificar si existe página de couple sharing
- Necesita layout mobile-first

### Recomendaciones

#### Layout estructura
```tsx
// src/features/couple/pages/couple-page.tsx
<div className="min-h-screen bg-canvas-primary">
  <Header />
  
  {/* Hero */}
  <div className="flex flex-col items-center gap-3 px-6 py-8 text-center md:py-12">
    <HeartHandshakeIcon className="size-12 text-brand-700 md:size-14" />
    <h1 className="text-2xl font-heading font-semibold md:text-3xl">
      Compara con<br />tu pareja
    </h1>
    <p className="max-w-xs text-sm text-neutral-500 md:max-w-md md:text-base">
      Vincula tu cuenta con tu pareja y descubre los nombres que ambos amáis.
    </p>
  </div>
  
  {/* Cards */}
  <div className="space-y-4 px-4 pb-6 md:mx-auto md:max-w-2xl md:px-6">
    <InviteCard />
    <RedeemCard />
  </div>
</div>
```

#### Card component
```tsx
// src/features/couple/components/couple-card.tsx
export const CoupleCard = ({ title, description, children }) => (
  <div className="surface-card space-y-4 rounded-2xl p-6">
    <h2 className="text-lg font-heading font-semibold md:text-xl">
      {title}
    </h2>
    <p className="text-sm leading-relaxed text-neutral-500 md:text-base">
      {description}
    </p>
    {children}
  </div>
)
```

---

## 5. Profile (Mobile) [SnL0A]

### Diseño Pencil
- **Avatar section**: Avatar grande + email + join date
- **Form sections**: Email + Password con gaps de 20px
- **Fields**: 48px height, corner radius 8px
- **Buttons**: Full width, 48px height

### Código Actual
**Archivo**: `src/features/account/*`
- ⚠️ Verificar estructura actual de perfil
- Comparar con diseño mobile

### Recomendaciones

#### Avatar section
```tsx
<div className="flex items-center gap-4 px-4 py-2 md:px-6">
  <div className="flex size-13 items-center justify-center rounded-full bg-brand-700 text-lg font-heading font-bold text-white md:size-16 md:text-xl">
    {initials}
  </div>
  <div className="flex-1">
    <p className="text-sm font-medium md:text-base">{email}</p>
    <p className="text-xs text-neutral-500 md:text-sm">
      Usando Nomena desde {joinDate}
    </p>
  </div>
</div>
```

#### Form sections
```tsx
<div className="space-y-5 px-4 md:px-6">
  {/* Email section */}
  <section className="space-y-3">
    <h3 className="text-base font-heading font-semibold md:text-lg">
      Correo electrónico
    </h3>
    <Input 
      value={email}
      disabled
      className="h-12"
    />
    <Button size="default" className="w-full">
      Actualizar email
    </Button>
  </section>
  
  {/* Password section */}
  <section className="space-y-3">
    <h3 className="text-base font-heading font-semibold md:text-lg">
      Contraseña
    </h3>
    <Input 
      type="password"
      placeholder="Contraseña actual"
      className="h-12"
    />
    <Input 
      type="password"
      placeholder="Nueva contraseña"
      className="h-12"
    />
    <Input 
      type="password"
      placeholder="Repite la contraseña"
      className="h-12"
    />
    <Button size="default" className="w-full">
      Cambiar contraseña
    </Button>
  </section>
</div>
```

---

## 6. Name Detail (Mobile) [Ztbgt]

### Diseño Pencil
- **Top bar**: Back arrow + Name + Heart icon (56px height)
- **Content**: Padding 0/20/32/20, gap 20px
- **Badge**: Gender badge con corner radius 999
- **Description**: 15px fontSize, line height 1.6
- **Origins**: Pills con border
- **CTA**: 50px height button
- **Info cards**: Grid 1 columna en mobile

### Código Actual
**Archivo**: `src/features/names/components/name-detail-drawer.tsx`
- ✅ Ya tiene estructura de drawer
- ⚠️ Verificar adaptación mobile vs diseño

### Recomendaciones

#### Top bar mejorado
```tsx
<div className="flex h-14 items-center justify-between border-b border-neutral-200 px-4">
  <button onClick={onClose} className="flex size-10 items-center justify-center">
    <ArrowLeftIcon className="size-5.5" />
  </button>
  <h2 className="text-lg font-heading font-semibold">
    {name}
  </h2>
  <button onClick={toggleFavorite} className="flex size-10 items-center justify-center">
    <HeartIcon className={cn("size-5.5", isFavorite && "fill-favorite text-favorite")} />
  </button>
</div>
```

#### Content layout
```tsx
<div className="space-y-5 px-5 py-6 md:space-y-6 md:px-6">
  {/* Gender badge */}
  <div>
    <Tag variant={gender}>{genderLabel}</Tag>
  </div>
  
  {/* Description */}
  <p className="text-[15px] leading-relaxed text-neutral-700">
    {description}
  </p>
  
  {/* Origins */}
  <div className="space-y-2.5">
    <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
      Orígenes
    </h4>
    <div className="flex flex-wrap gap-2">
      {origins.map(origin => (
        <span 
          key={origin}
          className="surface-card rounded-full px-3.5 py-1.5 text-sm"
        >
          {origin}
        </span>
      ))}
    </div>
  </div>
  
  {/* CTA */}
  <Button size="default" className="h-12.5 w-full md:h-13">
    Guardar favorito
  </Button>
  
  {/* Info section */}
  <div className="space-y-3.5">
    <h3 className="text-xl font-heading font-semibold">
      Información
    </h3>
    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
      <InfoCard title="Uso en España" value={usage} />
      <InfoCard title="Posición" value={rank} />
    </div>
  </div>
</div>
```

---

## Resumen de Cambios Prioritarios

### 🔴 Alta Prioridad

1. **SearchPage grid responsive**
   - Archivo: `src/features/names/pages/search-page.tsx`
   - Cambio: `grid-cols-4` → `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`

2. **Hero search responsive**
   - Archivo: `src/features/names/components/hero-search.tsx`
   - Añadir: Title responsive, search bar adaptado, alphabet scroll horizontal

3. **Sticky search bar compacta**
   - Crear: `src/features/names/components/sticky-search-bar.tsx`
   - Integrar con IntersectionObserver existente

### 🟡 Media Prioridad

4. **Header adaptativo**
   - Archivo: `src/app/shared/components/header/header.tsx`
   - Mobile: Ocultar search, mostrar solo menu icon

5. **Favorites page mobile**
   - Archivo: `src/features/favorites/pages/favorites-page.tsx`
   - Añadir subtitle, tabs responsive, match banner

6. **Name detail drawer mobile**
   - Archivo: `src/features/names/components/name-detail-drawer.tsx`
   - Ajustar spacing, button heights, info cards grid

### 🟢 Baja Prioridad

7. **Couple sharing page**
   - Verificar existencia y adaptar a diseño mobile
   - Hero centered + cards full width

8. **Profile page mobile**
   - Avatar section + form sections con spacing correcto
   - Inputs y buttons con heights de diseño (48px)

---

## Valores de Diseño Clave

### Spacing
- **Mobile padding lateral**: 16px (px-4)
- **Gap entre secciones**: 16-20px
- **Gap entre elementos**: 12px
- **Bottom padding**: 24-32px

### Typography
- **Titles mobile**: 24px (text-2xl)
- **Titles desktop**: 32-40px (text-3xl / text-4xl)
- **Body mobile**: 13-15px
- **Body desktop**: 14-16px

### Components
- **Button height**: 48-50px (h-12 / h-12.5)
- **Input height**: 48px (h-12)
- **Header height**: 56px (h-14)
- **Corner radius buttons**: 8-10px (rounded-lg / rounded-xl)
- **Corner radius cards**: 12-16px (rounded-xl / rounded-2xl)

### Breakpoints
- **Mobile first**: < 768px
- **Tablet**: >= 768px (md:)
- **Desktop**: >= 1024px (lg:)

---

## Próximos Pasos

1. ✅ Aplicar cambios de alta prioridad (SearchPage + Hero)
2. ✅ Crear StickySearchBar component
3. ✅ Adaptar Header para mobile
4. ⏳ Revisar y adaptar Favorites page
5. ⏳ Ajustar Name detail drawer
6. ⏳ Verificar y crear Couple sharing page si no existe
7. ⏳ Adaptar Profile page

---

**Documentos relacionados**:
- `docs/skills/responsive-design.md` - Guía de buenas prácticas
- `designs/nomena.pen` - Diseños fuente de Pencil
- `src/index.css` - Theme variables y design tokens
