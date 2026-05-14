# Borja Gómez | Dando voz a las raíces

Sitio web estático de presentación profesional para Borja Gómez, creador audiovisual rural.

## Qué incluye

- Landing page de una sola página en español.
- Secciones: inicio, sobre mí, servicios, proyectos, Instagram y contacto.
- Carrusel de proyectos con `Swiper`.
- Animaciones de entrada con `AOS`.
- Diseño responsive para móvil y escritorio.
- Metadatos SEO/Open Graph y favicons.
- Configuración de cabeceras de seguridad y caché para despliegue en Vercel.

## Stack

- `HTML5`
- `CSS3`
- `JavaScript` (vanilla)
- CDNs externos:
  - `Swiper`
  - `AOS`
  - `Font Awesome`
  - `Google Fonts`

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
    ├── js/
    │   └── script.js
    └── img/
        ├── favicons/
        └── projects/
```

## Desarrollo local

Al ser un sitio estático, puedes abrir `index.html` directamente o servirlo con un servidor local.

### Opción rápida

Abrir `index.html` en el navegador.

### Opción recomendada (servidor local)

Desde la raíz del proyecto:

```bash
python3 -m http.server 8080
```

Y abrir:

- `http://localhost:8080`

## Versionado de assets (cache busting)

El archivo `index.html` usa query params `?v=...` en CSS, JS e imágenes para invalidar caché tras cambios.

Para actualizar todas las versiones en bloque:

```bash
./scripts/bump-asset-version.sh
```

El script genera un timestamp UTC y lo aplica a los assets referenciados desde `index.html`.

## Despliegue

Proyecto preparado para Vercel mediante `vercel.json` con:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- Caché diferenciada para `index.html` y `assets/`

## Mantenimiento de contenido

Los textos, enlaces y bloques de secciones se editan en:

- `index.html`

Los estilos visuales se editan en:

- `assets/css/style.css`

La interacción (menú móvil, estado de navegación, carrusel y animaciones) se gestiona en:

- `assets/js/script.js`
