# Borja Gómez | Dando voz a las raíces

Web estática de presentación profesional para Borja Gómez, creador audiovisual rural. La página muestra servicios, planes, proyectos, presencia en Instagram y vías de contacto para negocios, territorios y proyectos locales.

El proyecto está pensado para ser sencillo de mantener: HTML, CSS y JavaScript vanilla, sin framework, sin `package.json`, sin instalación de dependencias y sin proceso de build.

## Cómo ver la web

Puedes abrir `index.html` directamente en el navegador.

Para revisar mejor rutas, estilos, scripts, fuentes e imágenes, es preferible servir la carpeta como web estática:

```bash
python3 -m http.server 8080
```

Después abre:

```text
http://localhost:8080
```

No hay comandos `npm`, instalación previa ni compilación.

## Estructura básica

```text
.
├── index.html
├── README.md
├── AGENTS.md
├── PROJECT_CONTEXT.md
├── vercel.json
├── docs/
│   └── agent-memory/
├── scripts/
│   └── bump-asset-version.sh
└── assets/
    ├── css/
    ├── fonts/
    ├── img/
    ├── js/
    └── vendor/
```

- `index.html`: contenido visible principal, metadatos SEO, enlaces, secciones, imágenes y recursos cargados por la página.
- `assets/css/style.css`: estilos globales, responsive, layout, animaciones visuales y fuentes locales.
- `assets/js/script.js`: interacción en JavaScript vanilla, como menú móvil, filtros, carrusel, anclas y estados de interfaz.
- `assets/img/`: imágenes de marca, hero, portfolio y favicons.
- `assets/fonts/`: fuentes locales autoalojadas.
- `assets/vendor/`: librerías ya incluidas en el repositorio y servidas en local, como Swiper y Anime.js.
- `scripts/bump-asset-version.sh`: actualiza los parámetros `?v=...` de assets referenciados desde `index.html`.
- `vercel.json`: configuración de despliegue, cabeceras, CSP y caché para Vercel.

## Mantenimiento

El contenido comercial y SEO importante debe seguir en `index.html`, no generado desde JavaScript. Para cambios habituales:

- Textos, secciones, enlaces, metadatos, portfolio, CTA e imágenes enlazadas: editar `index.html`.
- Estilos, responsive, layout, colores, espaciados y animaciones visuales: editar `assets/css/style.css`.
- Comportamiento interactivo: editar `assets/js/script.js` con JavaScript vanilla.
- Imágenes nuevas: guardarlas en `assets/img/...` con nombres claros y optimizarlas solo con herramientas ya disponibles.
- Assets cambiados en `index.html`: ejecutar `./scripts/bump-asset-version.sh` cuando haga falta invalidar caché.

No se deben añadir frameworks, dependencias npm, CDNs, fuentes externas, analytics ni widgets externos sin permiso explícito.

## Despliegue

La web está preparada para desplegarse como sitio estático en Vercel mediante `vercel.json`.

Ese archivo define cabeceras de seguridad y reglas de caché para la raíz, `index.html` y los assets. Es un archivo protegido: solo debe modificarse con permiso explícito.

## Arquitectura de agentes

El proyecto se trabaja con Codex y subagentes especializados. La documentación interna vive fuera del README:

- `AGENTS.md`: reglas principales de coordinación, límites técnicos, Git Flow y responsabilidades.
- `PROJECT_CONTEXT.md`: contexto práctico del proyecto.
- `.codex/agents/*.toml`: instrucciones de cada subagente.
- `docs/agent-memory/`: decisiones estables y problemas conocidos.

El README debe quedarse como guía breve para entender, abrir y mantener la web. Las reglas internas de agentes no deben duplicarse aquí.
