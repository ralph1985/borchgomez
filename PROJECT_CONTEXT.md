# PROJECT_CONTEXT.md

Este proyecto es la web profesional de Borja Gomez, creador audiovisual rural. La pagina presenta servicios, planes, proyectos, presencia en Instagram y vias de contacto para negocios, territorios y proyectos locales.

La web publica esta migrada a Astro con salida estatica. Usa componentes `.astro`, SCSS global compilado a CSS publico y JavaScript vanilla para interaccion. No usa React en la web publica; `studio/` si usa React porque es un Sanity Studio.

## Arquitectura principal

- `src/pages/index.astro`: entrada de la home. Obtiene contenido con `getHomePageContent` y compone layout y secciones.
- `src/layouts/BaseLayout.astro`: HTML base, metadatos, cabecera, footer, CSS y scripts.
- `src/sections/`: secciones visibles de la home.
- `src/components/`: UI reutilizable e iconos.
- `src/scripts/site.js`: JavaScript fuente de la web publica.
- `src/styles/`: SCSS fuente organizado por base, layout, componentes y secciones.
- `public/assets/`: assets servidos publicamente, incluido `public/assets/css/style.css` compilado.
- `src/domain/`, `src/ports/`, `src/application/`: tipos, puerto de contenido y caso de uso de la home.
- `src/infrastructure/content/data/`: contenido local en JSON.
- `src/infrastructure/content/sanity/`: repositorio Sanity con fallback local.
- `studio/`: Sanity Studio, schemas y seeds.
- `vercel.json`: cabeceras, CSP, cache y reglas de despliegue. Archivo protegido.

## Contenido

La UI no debe leer JSON directamente desde las secciones. `src/pages/index.astro` usa `getHomePageContent`, que depende de `ContentRepository`.

El contenido base esta en `LocalContentRepository` y lee `src/infrastructure/content/data/*.json`. Si existen `SANITY_PROJECT_ID`, `SANITY_DATASET` y `SANITY_API_VERSION`, `src/shared/config/content.ts` usa `SanityContentRepository`.

Sanity puede sustituir solo `site.hero` y `site.purpose`. Si falta configuracion, falla la consulta o faltan campos obligatorios, la web usa el JSON local. Servicios, planes, proyectos, contacto y el resto de secciones siguen en JSON local.

Para refrescar el fallback local de hero y purpose con Sanity se usa:

```bash
corepack pnpm run sync:fallbacks
```

## Estilos, scripts y assets

Los cambios de SCSS deben hacerse en `src/styles/**/*.scss` y compilarse con:

```bash
corepack pnpm run css:build
```

El CSS compilado `public/assets/css/style.css` esta versionado y debe quedar coherente con los SCSS.

El JavaScript editable esta en `src/scripts/site.js`. No asumir la ruta antigua `assets/js/script.js`.

Los assets existentes se sirven desde `public/assets/` para conservar rutas publicas. Si se cambian assets o URLs versionadas, ejecutar:

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

El build compila primero SCSS y despues Astro. Los cambios publicados en Sanity no aparecen automaticamente en produccion: requieren nuevo build y redeploy, salvo que se configuren webhooks de Vercel.

## Reglas de contenido comercial

El contenido comercial lo decide Borja o el usuario. Codex solo debe aplicarlo, corregir errores evidentes si se pide y reportar dudas.

No inventar textos, servicios, precios, claims comerciales, nombres propios, enlaces ni datos de portfolio. Si el usuario entrega copy aprobado, mantenerlo literalmente.
