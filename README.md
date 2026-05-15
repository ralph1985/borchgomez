# Borja Gómez | Dando voz a las raíces

Sitio web estático de presentación profesional para Borja Gómez, creador audiovisual rural enfocado en dar visibilidad a negocios, proyectos locales y territorios rurales mediante vídeo, fotografía, drone, contenido para redes y presencia online.

## Estado actual de la web

La web está planteada como una landing page de una sola página, en español y sin proceso de build. El contenido principal vive en `index.html`, los estilos en `assets/css/style.css` y la interacción en `assets/js/script.js`.

### Secciones publicadas

- **Inicio**: hero con claim, CTA hacia WhatsApp, enlace a Instagram y fotografía principal responsive.
- **Sobre mí**: relato profesional y conexión con el mundo rural.
- **Servicios**: seis líneas de trabajo: producción audiovisual, vídeo con drone, contenido para redes, presencia online, web/SEO local y estrategia visual con seguimiento.
- **Proyectos e historias**: carrusel con seis piezas documentales enlazadas a publicaciones de Instagram.
- **Instagram**: previsualización de publicaciones destacadas y CTA hacia el perfil `@borchgomez`.
- **Contacto**: CTA de WhatsApp, teléfono, email e Instagram.

### Funcionalidades e implementación

- Landing responsive para móvil, tablet y escritorio.
- Navegación fija con menú móvil, cierre automático al pulsar enlaces y marcado de sección activa durante el scroll.
- Carrusel de proyectos con `Swiper`, servido desde `assets/vendor/swiper/`.
- Animaciones de entrada con `AOS`, servido desde `assets/vendor/aos/`.
- Fuentes locales autoalojadas (`Manrope` y `Playfair Display`) en formato `woff2`.
- Imágenes optimizadas con variantes `400w`, `800w` y `1200w` en proyectos y hero, además de `loading="lazy"`, `decoding="async"` y tamaños explícitos.
- Metadatos SEO, Open Graph, Twitter Card, favicons y manifiesto web.
- Iconos sociales embebidos como SVG inline, sin depender de librerías externas de iconos.
- Query params `?v=...` para invalidar caché de CSS, JS, imágenes, favicons y librerías locales.
- Cabeceras de seguridad y política de caché preparadas para Vercel.

## Stack

- `HTML5`
- `CSS3`
- `JavaScript` vanilla
- Dependencias frontend autoalojadas:
  - `Swiper` en `assets/vendor/swiper/`
  - `AOS` en `assets/vendor/aos/`
- Fuentes locales:
  - `Manrope`
  - `Playfair Display`

> Nota: la web no usa gestor de paquetes ni bundler. No hay `npm install`, `npm run build` ni dependencias descargadas en tiempo de despliegue.

## Estructura del proyecto

```text
.
├── index.html
├── README.md
├── vercel.json
├── scripts/
│   └── bump-asset-version.sh
└── assets/
    ├── css/
    │   └── style.css
    ├── fonts/
    │   ├── manrope-500-700-latin.woff2
    │   └── playfair-display-700-latin.woff2
    ├── img/
    │   ├── borja-drone-foto-movil.jpg
    │   ├── borja-ordenador-drone.png
    │   ├── borja-ordenador-drone.webp
    │   ├── borja-ordenador-drone-400.webp
    │   ├── borja-ordenador-drone-800.webp
    │   ├── borja-ordenador-drone-1200.webp
    │   ├── logo.png
    │   ├── logo.webp
    │   ├── logo-64.webp
    │   ├── logo-128.webp
    │   ├── logo-256.webp
    │   ├── favicons/
    │   └── projects/
    │       ├── historias-tierra*.webp
    │       ├── paisajes-memoria*.webp
    │       ├── raices-vivas*.webp
    │       ├── territorio-vivo*.webp
    │       ├── tradiciones-vivas*.webp
    │       └── voz-pueblos*.webp
    ├── js/
    │   └── script.js
    └── vendor/
        ├── aos/
        │   ├── aos.css
        │   └── aos.js
        └── swiper/
            ├── swiper-bundle.min.css
            └── swiper-bundle.min.js
```

## Desarrollo local

Al ser un sitio estático, puedes abrir `index.html` directamente o servirlo con un servidor local.

### Opción rápida

Abrir `index.html` en el navegador.

### Opción recomendada

Desde la raíz del proyecto:

```bash
python3 -m http.server 8080
```

Después, abrir:

```text
http://localhost:8080
```

## Versionado de assets (cache busting)

El archivo `index.html` usa query params `?v=...` en assets estáticos para invalidar la caché tras cambios.

Para actualizar todas las versiones en bloque:

```bash
./scripts/bump-asset-version.sh
```

El script genera un timestamp UTC y lo aplica a los assets referenciados desde `index.html` con extensiones `css`, `js`, `png`, `jpg`, `jpeg`, `svg`, `webp` y `gif`.

## Despliegue

Proyecto preparado para Vercel mediante `vercel.json`.

Incluye cabeceras globales de:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`

Y reglas de caché diferenciadas para:

- `/` e `/index.html`: `public, max-age=0, must-revalidate`
- `/assets/(.*)`: `public, max-age=31536000, immutable`

## Mantenimiento de contenido

### Editar textos, enlaces y estructura

Modificar `index.html` para actualizar:

- Textos de secciones.
- Enlaces de Instagram, WhatsApp, teléfono y email.
- Tarjetas del carrusel de proyectos.
- Metadatos SEO/Open Graph/Twitter Card.
- Rutas de imágenes, favicons y manifiesto web.

### Editar estilos visuales

Modificar `assets/css/style.css` para actualizar:

- Paleta, tipografías y espaciados.
- Layout responsive.
- Diseño del hero, servicios, carrusel, Instagram, contacto y footer.
- Estados de navegación y estilos de botones.

### Editar interacción

Modificar `assets/js/script.js` para actualizar:

- Apertura/cierre del menú móvil.
- Marcado de enlace activo durante el scroll.
- Sombra de cabecera al hacer scroll.
- Configuración del carrusel `Swiper`.
- Inicialización de `AOS`.

## Checklist antes de publicar cambios

1. Revisar la web en móvil y escritorio.
2. Comprobar que todos los enlaces externos abren correctamente.
3. Ejecutar `./scripts/bump-asset-version.sh` si cambian CSS, JS o imágenes.
4. Servir la web con `python3 -m http.server 8080` y revisar `http://localhost:8080`.
5. Verificar que `vercel.json` sigue permitiendo los recursos usados por la página.
