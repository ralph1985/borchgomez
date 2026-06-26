# Borja Gómez | Dando voz a las raíces

Web de presentación profesional para Borja Gómez, creador audiovisual rural. La página muestra servicios, planes, proyectos, presencia en Instagram y vías de contacto para negocios, territorios y proyectos locales.

El proyecto está migrado a Astro con componentes `.astro`, CSS global y JavaScript vanilla. No usa React, Tailwind, base de datos ni CMS en esta fase.

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

## Construcción

```bash
corepack pnpm run build
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
- `public/assets/`: CSS, JS, fuentes, vendors, imágenes y favicons servidos con la misma ruta pública `/assets/...`.

## Capa de contenido

La UI no lee JSON directamente. `index.astro` usa `getHomePageContent`, que depende del puerto `ContentRepository`. En esta fase el puerto se implementa con `LocalContentRepository`, que lee datos locales desde `src/infrastructure/content/data/`.

Para sustituir el origen por Sanity u otro CMS en una fase posterior, la UI no debería reescribirse: bastaría con crear otro repositorio que implemente `ContentRepository` y conectarlo en `src/shared/config/content.ts`.

## Assets y despliegue

Los assets existentes se sirven desde `public/assets/` para conservar las rutas públicas. `vercel.json` mantiene las cabeceras y reglas de caché del proyecto y no forma parte de la migración de contenido.

## Fase 2 pendiente

- Añadir Sanity Studio si se confirma como CMS.
- Definir schemas para servicios, planes, proyectos, ajustes de sitio y home.
- Crear un repositorio de contenido Sanity que implemente `ContentRepository`.
- Configurar webhooks de Sanity con Vercel para regenerar el sitio al publicar contenido.
