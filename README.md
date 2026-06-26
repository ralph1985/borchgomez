# Borja Gómez | Dando voz a las raíces

Web de presentación profesional para Borja Gómez, creador audiovisual rural. La página muestra servicios, planes, proyectos, presencia en Instagram y vías de contacto para negocios, territorios y proyectos locales.

La web pública está construida con Astro, componentes `.astro`, SCSS global compilado a CSS público y JavaScript vanilla. No usa React, Tailwind ni base de datos. El contenido base está en JSON local y Sanity puede alimentar `site.hero` y `site.purpose` cuando está configurado.

## Instalación

El proyecto fija el gestor en `package.json` con `packageManager`. Si pnpm no está disponible directamente, puede ejecutarse con Corepack.

```bash
corepack pnpm install
```

## Desarrollo

```bash
corepack pnpm run dev
```

Astro mostrará la URL local, normalmente:

```text
http://localhost:4321
```

Si se están editando estilos, deja también Sass en modo watch en otra terminal:

```bash
corepack pnpm run css:watch
```

## Construcción

```bash
corepack pnpm run build
```

El build compila primero `src/styles/main.scss` en `public/assets/css/style.css` y después ejecuta Astro. Si solo se quieren regenerar los estilos:

```bash
corepack pnpm run css:build
```

## Previsualización del build

```bash
corepack pnpm run preview
```

## Estructura básica

```text
.
├── astro.config.mjs
├── package.json
├── public/
│   └── assets/
├── src/
│   ├── pages/
│   ├── layouts/
│   ├── sections/
│   ├── components/
│   ├── domain/
│   ├── application/
│   ├── ports/
│   ├── infrastructure/
│   ├── styles/
│   └── shared/
├── scripts/
├── docs/
└── vercel.json
```

- `src/pages/index.astro`: entrada de la home. Obtiene el contenido y compone layout y secciones.
- `src/layouts/BaseLayout.astro`: HTML base, metadatos, cabecera, footer, CSS y scripts locales.
- `src/sections/`: secciones visibles de la home.
- `src/components/`: piezas reutilizables de UI e iconos.
- `src/domain/`: tipos simples del contenido.
- `src/ports/content-repository.ts`: interfaz de acceso a contenido.
- `src/application/get-home-page-content.ts`: caso de uso que entrega los datos preparados para la página.
- `src/infrastructure/content/`: repositorio local y JSON actuales.
- `src/scripts/site.js`: JavaScript editable de la web pública.
- `src/styles/`: fuente SCSS global organizada por base, layout, componentes y secciones.
- `public/assets/`: CSS compilado, vendors, fuentes, imágenes y favicons servidos con la misma ruta pública `/assets/...`.

## Capa de contenido

La UI no lee JSON directamente. `index.astro` usa `getHomePageContent`, que depende del puerto `ContentRepository`. La fuente base es `LocalContentRepository`, que lee datos locales desde `src/infrastructure/content/data/`.

`src/shared/config/content.ts` usa `SanityContentRepository` solo si están configuradas estas variables de entorno:

```bash
SANITY_PROJECT_ID=...
SANITY_DATASET=production
SANITY_API_VERSION=2026-06-26
```

Si falta alguna variable, si la consulta a Sanity falla o si Sanity devuelve campos incompletos, la web usa el JSON local como fallback seguro. `site.hero` y `site.purpose` pueden venir de Sanity; servicios, planes, proyectos, contacto y el resto de secciones se leen desde `src/infrastructure/content/data/`.

Para que la web pueda leer el contenido sin añadir credenciales al repositorio, el dataset de Sanity debe permitir lectura pública desde el build o estar configurado de forma equivalente en el entorno de despliegue.

### Sincronizar fallbacks locales

Para refrescar la copia local de seguridad con el contenido publicado en Sanity:

```bash
corepack pnpm run sync:fallbacks
```

El comando carga `.env` si existe y requiere `SANITY_API_VERSION` junto con `SANITY_PROJECT_ID/SANITY_DATASET` o `SANITY_STUDIO_PROJECT_ID/SANITY_STUDIO_DATASET`. Solo actualiza `site.hero` y `site.purpose` en `src/infrastructure/content/data/site-settings.json`; el resto del contenido local se conserva intacto.

Si falta configuración, no existen los documentos singleton o Sanity devuelve campos obligatorios vacíos, el comando falla antes de escribir el JSON. Al ser un comando manual, el build no queda acoplado a esta sincronización.

## Sanity Studio

El Studio está en `studio/` y usa el login propio de Sanity. No hay login propio en la web. Borja debe ser invitado como miembro del proyecto de Sanity para editar el contenido.

Para trabajar con el Studio:

```bash
cd studio
corepack pnpm install
SANITY_STUDIO_PROJECT_ID=... SANITY_STUDIO_DATASET=production corepack pnpm run dev
```

El Studio muestra los documentos singleton “Hero” y “Por qué y cómo trabajo”. Para crear o reemplazar los documentos iniciales con los textos actuales del JSON local:

```bash
cd studio
SANITY_PROJECT_ID=... SANITY_DATASET=production corepack pnpm run seed:hero
SANITY_PROJECT_ID=... SANITY_DATASET=production corepack pnpm run seed:purpose
```

Al ser una web Astro estática, los cambios publicados en Sanity no aparecen automáticamente en producción: requieren ejecutar un nuevo build y redeploy.

## Assets y despliegue

Los assets públicos se sirven desde `public/assets/` con rutas `/assets/...`. `vercel.json` define las cabeceras y reglas de caché del proyecto.

Si cambian assets o URLs de assets versionadas, ejecuta `scripts/bump-asset-version.sh` para actualizar los `?v=` con hashes de contenido. En la estructura Astro actual, si no existe `index.html`, el script actualiza las referencias dentro de `src/infrastructure/content/data/site-settings.json`.

## Pendiente

- Configurar webhooks de Sanity con Vercel si se quiere regenerar el sitio automáticamente al publicar contenido.
