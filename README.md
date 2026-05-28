# Nomena App

React + TypeScript + Vite app para explorar y descubrir nombres.

## Stack

- React 19 + TypeScript + Vite
- Firebase (Firestore + Auth)
- TanStack Query
- Zustand

## Desarrollo

```bash
npm install
npm run dev
```

## Seeds

Sistema de seeds para alimentar la base de datos de Firebase con nombres del INE enriquecidos con datos externos.

### Fuentes de datos

| Fuente | Datos | Campo |
|---|---|---|
| [INE](https://www.ine.es) | Frecuencia y ranking en España | `usage_score`, `popularity_rank` |
| [Behind the Name](https://www.behindthename.com/api/) | Significado, origen, género | `meaning`, `origin`, `genderEstimate` |

### Estructura

```
src/features/seeds/
  api/
    firebase/
      admin.ts       ← inicialización Firebase Admin SDK
      upload.ts      ← subida a Firestore
      delete.ts      ← borrado de colecciones
    providers/
      behind-the-name.ts  ← API Behind the Name
  scripts/
    extract-ine-names.ts      ← extrae nombres únicos del Excel del INE
    enrich-behindthename.ts   ← enriquece con meaning/origin/gender
    generate-names-json.ts    ← combina INE + enrichment → names.json
    upload-names-to-firebase.ts ← sube names.json a Firestore
    clear-names.ts            ← vacía la colección names
  types/
    seed-type.ts
  utils/
    name-utils.ts
  files/              ← archivos de datos (ignorados por git)
    nombres_por_edad_media.xlsx
    ine-unique-names.json
    behindthename.json
    names.json
```

### Variables de entorno necesarias

```bash
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json  # Firebase Admin SDK
BEHINDTHENAME_API_KEY=tu_clave                          # Behind the Name API
```

### Flujo completo

```bash
# 1. Extraer nombres únicos del Excel del INE
npm run seed:extract:names

# 2. Enriquecer con Behind the Name (resumible, respeta límite de 400 req/hora)
npm run seed:enrich:behindthename

# 3. Generar names.json combinando INE + enrichment
npm run seed:generate:json

# 4. Subir a Firestore
npm run seed:upload

# Utilidades
npm run seed:clear:names   # vaciar colección names
```


## Arquitectura

### Filosofía

El proyecto sigue una **arquitectura basada en features** (Feature-Sliced Design simplificado). El código se organiza por dominio de negocio, no por capas técnicas. Cada feature es autocontenida y puede desarrollarse de forma independiente.

El objetivo es que un desarrollador pueda entender, modificar o añadir una feature sin necesidad de conocer el resto de la aplicación.

---

### Estructura principal

```
src/
├── app/              ← Shell de la aplicación (rutas, layouts, páginas públicas, shared)
├── features/         ← Módulos de negocio autocontenidos
├── lib/              ← Infraestructura compartida (Firebase, React Query, Zustand)
└── assets/           ← Iconos y recursos estáticos
```

---

### `app/` — Shell de la aplicación

| Carpeta | Responsabilidad |
|---|---|
| `router.tsx` | Definición centralizada de rutas. Exporta el objeto `ROUTES` como fuente de verdad de todos los paths |
| `pages/public/` | Páginas no autenticadas: Login, Register, 404 |
| `shared/components/` | Componentes UI reutilizables entre features (Button, Header, Menu, Tag…) |
| `shared/layouts/` | Layout base que envuelve todas las páginas autenticadas |
| `shared/hooks/` | Hooks genéricos sin lógica de negocio (`useClickOutside`, `useMobile`) |
| `shared/utils/` | Utilidades puras (`normalizeName`) |

---

### `features/` — Módulos de negocio

Cada feature sigue la misma estructura interna:

```
feature/
├── api/              ← Capa de servicio: llamadas a Firebase + mappers
│   ├── index.ts      ← Barrel export
│   └── accion/
│       ├── service.ts   ← Lógica Firebase
│       └── mappers.ts   ← DB model → Domain model
├── components/       ← Componentes UI específicos de la feature
├── hooks/            ← Hooks de orquestación (React Query + Zustand + auth)
├── store/            ← Estado global con Zustand
├── types/            ← Modelos de dominio TypeScript
├── pages/            ← Páginas enrutables (containers)
├── navigation/       ← Configuración de ítems de navegación
└── schemas/          ← Esquemas de validación con Zod (si aplica)
```

**Features actuales:**

| Feature | Responsabilidad |
|---|---|
| `auth` | Autenticación con Firebase Auth, gestión de sesión, avatar |
| `names` | Búsqueda, filtrado y detalle de nombres |
| `favorites` | Guardar y gestionar nombres favoritos |
| `couple` | Vincular pareja, compartir favoritos en tiempo real |
| `account` | Perfil de usuario y ajustes de cuenta |
| `seeds` | Scripts de desarrollo para poblar Firestore |

---

### `lib/` — Infraestructura compartida

| Archivo | Responsabilidad |
|---|---|
| `firebase.ts` | Inicialización del SDK de Firebase (Auth, Firestore, Storage) |
| `firebase-admin.ts` | Firebase Admin SDK para scripts de seed |
| `query-client.ts` | Configuración del cliente de React Query |
| `zustand.ts` | Wrapper con devtools para los stores de Zustand |

---

### Gestión de estado

Se usa un modelo dual:

- **React Query**: estado del servidor — fetching, caché, mutaciones, sincronización en tiempo real
- **Zustand**: estado global del cliente — usuario autenticado, favoritos en caché, estado de pareja

Los stores de Zustand exportan selectores directamente desde el archivo del store para evitar re-renders innecesarios.

---

### Convenciones de nomenclatura

| Tipo | Patrón | Ejemplo |
|---|---|---|
| Páginas | `*-page.tsx` | `search-page.tsx` |
| Stores | `*-store.ts` | `auth-store.ts` |
| Hooks | `use-*.ts` | `use-favorites.ts` |
| Tipos | `*-type.ts` | `auth-type.ts` |
| Schemas | `*-schemas.ts` | `auth-schemas.ts` |
| Nav items | `*-nav-items.ts` | `favorites-nav-items.ts` |
| Servicios API | `service.ts` + `mappers.ts` | dentro de `api/accion/` |
| Config CVA | `*.config.ts` | `button.config.ts` |

---

### Componentes con variantes: `*.config.ts` + CVA

Los componentes UI con múltiples variantes visuales separan su lógica de estilos en un archivo `*.config.ts` usando [class-variance-authority (CVA)](https://cva.style).

**Estructura de un componente con CVA:**

```
button/
├── button.config.ts   ← variantes, tipos, interface de props
└── button.tsx         ← componente React, consume el config
```

**Anatomía de un `*.config.ts`:**

```ts
import { cva, type VariantProps } from "class-variance-authority";

// 1. Clases base — siempre aplicadas
export const buttonVariants = cva(
    `inline-flex items-center font-medium transition-all disabled:cursor-not-allowed ...`,
    {
        variants: {
            // 2. Variantes — cada prop genera un grupo de clases
            variant: {
                default: 'bg-brand-700 hover:bg-brand-900 text-fg-on-accent',
                ghost:   'bg-transparent hover:bg-canvas-surface-hover',
                // ...
            },
            size: {
                sm:      'px-3 py-1.5 text-sm',
                default: 'px-6 py-3 text-[15px]',
            },
        },
        // 3. Variantes compuestas — clases aplicadas cuando coinciden varias props
        compoundVariants: [
            {
                variant: 'secondary',
                isSelected: true,
                className: 'bg-brand-700 text-fg-on-accent hover:bg-brand-900',
            },
        ],
        // 4. Valores por defecto
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

// 5. Tipos derivados automáticamente del config
export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];

// 6. Interface de props del componente (extiende VariantProps)
export interface ButtonProps
    extends Omit<React.ComponentProps<"button">, "color">,
            VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    to?: string;
}
```

**Consumo en el componente:**

```tsx
import { cn } from '@src/lib/cn';
import { buttonVariants, type ButtonProps } from "./button.config";

export const Button = ({ variant, size, className, ...rest }: ButtonProps) => (
    <button className={cn(buttonVariants({ variant, size }), className)} {...rest} />
);
```

`cn` combina `clsx` + `tailwind-merge` para resolver conflictos entre clases de Tailwind.

**Componentes que siguen este patrón:**

| Componente | Config |
|---|---|
| `Button` | `button.config.ts` — variantes: `default`, `ghost`, `secondary`, `rounded`… |
| `Text` | `text.config.ts` — variantes tipográficas: `h1`–`h4`, `body-1`, `caption`… |
| `Tag` | `tag.config.ts` — variantes de género y estado |

---

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# nomena
