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
