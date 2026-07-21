# Informe legal y técnico

Fecha de revisión: 18 de julio de 2026.

## Auditoría técnica

### Frameworks y arquitectura

- Web pública con Astro 7 en modo estático (`output: "static"`).
- Componentes `.astro`, TypeScript para tipos/capas de contenido, SCSS fuente en `src/styles/**` y CSS compilado en `public/assets/css/style.css`.
- JavaScript vanilla modular desde `src/scripts/site.js`, con `animejs` para animaciones.
- Contenido local en `src/infrastructure/content/data/*.json`.
- Sanity opcional como CMS en build mediante `@sanity/client`; si falta configuración o falla la consulta, se usan fallbacks locales.
- Sanity Studio independiente en `studio/`, con React por el propio Studio. No se carga en la web pública.
- Hosting previsto en Vercel, con `vercel.json` para cabeceras, CSP y caché.

### Formularios, endpoints y APIs

- Formularios públicos: no detectados.
- Campos de formulario o casillas de aceptación: no detectados.
- Astro Actions: no detectadas.
- Endpoints de la web pública: `robots.txt.ts` y `sitemap.xml.ts`, ambos de solo lectura.
- APIs propias: no detectadas.
- `fetch()` en navegador: no detectado.
- Envío de emails desde servidor: no detectado.
- Contacto: enlaces `mailto:`, `tel:`, WhatsApp e Instagram. El usuario decide si abre esos canales externos.

### Servicios y proveedores detectados

- Vercel: alojamiento de la web pública y entrega de archivos estáticos.
- Sanity: CMS opcional en build y Studio editorial separado.
- WhatsApp: enlace externo de contacto.
- Instagram: enlace externo de contacto y enlaces salientes de proyectos.
- TikTok y Facebook: enlaces externos en la navegación.
- Google Fonts: no se cargan desde Google. Las fuentes Manrope y Playfair Display están servidas localmente desde `public/assets/fonts/`.

### Servicios no detectados

- Google Analytics u otra analítica: no detectada.
- reCAPTCHA o CAPTCHA equivalente: no detectado.
- YouTube: no detectado.
- Vimeo: no detectado.
- Google Maps o mapas embebidos: no detectados.
- Instagram embebido mediante iframe/script: no detectado.
- Newsletters, promociones automatizadas, usuarios registrados, área privada o ecommerce: no detectados.

### Almacenamiento y cookies

- `document.cookie` o cookies creadas dinámicamente por código propio: no detectadas.
- Cookies HTTP configuradas por endpoints propios: no detectadas.
- Cookies analíticas, publicitarias o de terceros por embeds: no detectadas.
- `localStorage`: no detectado en la web pública actual.
- `sessionStorage`: no detectado.
- `IndexedDB`: no detectado.
- Cache Storage o Service Worker: no detectados.

### Tratamientos de datos personales detectados

- Datos comunicados voluntariamente si el usuario contacta por email, teléfono, WhatsApp, Instagram u otro canal enlazado.
- Datos técnicos mínimos tratados por el proveedor de alojamiento para entregar la web y mantener seguridad, como IP, fecha, hora, recurso solicitado y agente de usuario.
- Datos editoriales del sitio en Sanity, consultados durante build o mantenimiento. La web pública no expone formularios que escriban datos personales en Sanity.

## Auditoría legal de las plantillas

### Aviso legal

- Contiene placeholders sin resolver.
- Incluye referencias genéricas a cookies técnicas temporales y a registros/promociones/concursos que no existen en la web.
- Habla de medición de audiencia y parámetros de tráfico sin evidencia técnica en el proyecto.
- Incluye cláusulas amplias sobre foros, chats, blogs o comentarios que no existen.

### Política de privacidad

- Contiene tratamientos no detectados: comunicaciones comerciales, boletín informativo, estudios de mercado, análisis estadísticos y formularios con casillas.
- Habla de datos obligatorios en formularios de contacto o descarga que no existen.
- Mantiene referencias genéricas a proveedores de comunicaciones sin concretar el funcionamiento real.
- Incluye restos de extracción de documento (`26543026339`, `26543026340`) que no deben publicarse.

### Política de cookies

- Parte de la premisa de cookies analíticas.
- Lista cookies de Google Analytics (`_ga`, `_gat`, `_gid`) sin que Google Analytics exista en el código.
- Incluye panel de configuración y consentimiento para cookies analíticas que no procede en el estado actual.
- Contiene referencias genéricas a cookies de usuario, contraseña o preferencias que no se corresponden con esta web.

## Cambios realizados

### Archivos creados

- `src/domain/legal.ts`: tipos para datos y páginas legales.
- `src/infrastructure/content/data/legal-data.json`: fallback local con placeholders seguros.
- `src/infrastructure/content/legal/legal-pages.ts`: textos legales versionados y adaptados al funcionamiento real.
- `src/application/get-legal-page-content.ts`: caso de uso de páginas legales.
- `src/components/ui/LegalPage.astro`: plantilla común de artículo legal.
- `src/pages/aviso-legal.astro`: página de Aviso Legal.
- `src/pages/politica-privacidad.astro`: página de Política de Privacidad.
- `src/pages/politica-cookies.astro`: página de Política de Cookies.
- `studio/schemaTypes/legalData.ts`: singleton “Datos legales” en Sanity.
- `src/styles/components/_legal-page.scss`: estilos de las páginas legales.
- `docs/legal-audit.md`: este informe.

### Archivos modificados

- `src/ports/content-repository.ts`: añade `getLegalData()`.
- `src/infrastructure/content/local-content-repository.ts`: devuelve datos legales locales.
- `src/infrastructure/content/sanity/sanity-content-repository.ts`: lee el documento `legalData` y combina con fallback local.
- `studio/schemaTypes/index.ts`: registra el schema `legalData`.
- `studio/structure.ts`: añade el singleton “Datos legales” al Studio.
- `studio/sanity.config.ts`: protege `legalData` frente a borrar, duplicar o despublicar.
- `src/layouts/BaseLayout.astro`: añade metadatos sociales por página y enlaces legales en footer.
- `src/domain/site-settings.ts`: tipa enlaces legales opcionales en footer.
- `src/infrastructure/content/data/site-settings.json`: añade enlaces a las páginas legales.
- `src/pages/sitemap.xml.ts`: incluye las tres rutas legales.
- `src/styles/layout/_footer.scss`: adapta enlaces legales del footer.
- `src/styles/main.scss`: carga estilos de páginas legales.
- `public/assets/css/style.css`: CSS compilado desde SCSS.

### Archivos eliminados

- Ninguno.

## Pendiente para Borja

- Nombre completo.
- Nombre comercial.
- Dirección fiscal o domicilio profesional que deba publicarse.
- Email legal de contacto.
- Teléfono legal de contacto.
- Dominio definitivo.
- Confirmar si quiere publicar algún dato identificativo adicional.
- Confirmar con asesoría si la redacción final requiere matices fiscales, colegiales o contractuales específicos no deducibles del código.

## Decisiones tomadas

- No se implementa banner de cookies porque no se han detectado cookies no técnicas, analítica, publicidad ni tecnologías equivalentes en la web pública.
- Los textos legales se mantienen versionados en el repositorio para evitar que Sanity almacene documentos legales completos.
- Sanity solo almacena datos legales variables, con placeholders locales mientras falten datos reales.
- Se mencionan WhatsApp, Instagram, TikTok y Facebook solo como enlaces externos, no como embeds cargados por la web.
- Se menciona Vercel como proveedor de alojamiento por el despliegue y configuración existente.
- Se menciona Sanity como CMS editorial opcional y separado del usuario final de la web pública.
- No se copian las plantillas: se sustituyen por documentos nuevos adaptados al comportamiento auditado.
- No se añaden dependencias, analítica, widgets ni servicios externos nuevos.
