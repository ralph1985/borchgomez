# PROJECT_CONTEXT.md

Este proyecto es la web profesional de Borja Gómez, creador audiovisual rural. La página presenta servicios, planes, proyectos y vías de contacto para negocios, territorios y proyectos locales.

La web pública está migrada a Astro con salida estática. Usa componentes `.astro`, SCSS global compilado a CSS público y JavaScript vanilla para interacción. No usa React en la web pública; `studio/` sí usa React porque es un Sanity Studio.

## Arquitectura principal

- `src/pages/index.astro`: entrada de la home. Obtiene contenido con `getHomePageContent` y compone layout y secciones.
- `src/layouts/BaseLayout.astro`: HTML base, metadatos, cabecera, footer, CSS y scripts.
- `src/sections/`: secciones visibles de la home.
- `src/components/`: UI reutilizable e iconos.
- `src/scripts/site.js`: punto de entrada del JavaScript fuente de la web pública; los módulos de interacción viven en `src/scripts/`.
- `src/styles/`: SCSS fuente organizado por base, layout, componentes y secciones.
- `public/assets/`: assets servidos públicamente, incluido `public/assets/css/style.css` compilado.
- `src/domain/`, `src/ports/`, `src/application/`: tipos, puerto de contenido y caso de uso de la home.
- `src/infrastructure/content/data/`: contenido local en JSON.
- `src/infrastructure/content/sanity/`: repositorio Sanity con fallback local.
- `studio/`: Sanity Studio, schemas y seeds.
- `vercel.json`: cabeceras, CSP, cache y reglas de despliegue. Archivo protegido.

## Contenido

La UI no debe leer JSON directamente desde las secciones. `src/pages/index.astro` usa `getHomePageContent`, que depende de `ContentRepository`.

El contenido base está en `LocalContentRepository` y lee `src/infrastructure/content/data/*.json`. Si existen `SANITY_PROJECT_ID`, `SANITY_DATASET` y `SANITY_API_VERSION`, `src/shared/config/content.ts` usa `SanityContentRepository`.

Sanity puede sustituir solo las secciones conectadas explícitamente en `src/infrastructure/content/sanity/`. Si falta configuración, falla la consulta o faltan campos obligatorios, la web usa el JSON local.

Las secciones conectadas actualmente a Sanity son `hero`, `purpose`, `services`, `plans`, `portfolio`, `about` y `contact`.

El Studio desplegado existe, pero su URL no se documenta en el repositorio público.

Para comprobar si Sanity y los fallbacks locales están desincronizados sin escribir archivos se usa:

```bash
corepack pnpm run sync:fallbacks:check
```

Para refrescar fallbacks locales con Sanity se usa:

```bash
corepack pnpm run sync:fallbacks
```

El sync de fallbacks actual escribe `site-settings.json`, `services.json`, `plans.json` y `projects.json` con las secciones Sanity conectadas.

En `studio/`, los scripts `seed:*` importan documentos al dataset y deben tratarse como bootstrap o recuperación, no como mantenimiento normal de contenido. Algunos usan `--replace`, por lo que pueden sobrescribir cambios editoriales remotos. No publican cambios de schema ni estructura del Studio; cuando se añade un schema o una entrada nueva al Studio desplegado, ejecutar también:

```bash
corepack pnpm run deploy
```

## Estilos, scripts y assets

Los cambios de SCSS deben hacerse en `src/styles/**/*.scss` y compilarse con:

```bash
corepack pnpm run css:build
```

El CSS compilado `public/assets/css/style.css` está versionado y debe quedar coherente con los SCSS.

El JavaScript editable está en `src/scripts/`; `src/scripts/site.js` es el punto de entrada. No asumir la ruta antigua `assets/js/script.js`.

Los assets existentes se sirven desde `public/assets/` para conservar rutas públicas. Si se cambian assets o URLs versionadas, ejecutar:

```bash
scripts/bump-asset-version.sh
```

En el estado actual, al no existir `index.html` como fuente, el script actualiza URLs de assets dentro de `src/infrastructure/content/data/site-settings.json`.

## Desarrollo y build

El gestor fijado es pnpm mediante Corepack:

```bash
corepack pnpm install
corepack pnpm run dev
corepack pnpm run build
```

El build compila primero SCSS y después Astro. Los cambios publicados en Sanity no aparecen automáticamente en producción: requieren nuevo build y redeploy, salvo que se configuren webhooks de Vercel.

## Reglas de contenido comercial

El contenido comercial lo decide Borja o el usuario. Codex solo debe aplicarlo, corregir errores evidentes si se pide y reportar dudas.

No inventar textos, servicios, precios, claims comerciales, nombres propios, enlaces ni datos de portfolio. Si el usuario entrega copy aprobado, mantenerlo literalmente.
