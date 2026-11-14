# Notas SEO técnicas

## Dominio canónico y formato de URL

- Dominio principal: `https://www.borchgomez.es/`.
- El dominio sin `www` debe redirigir permanentemente a `www`; la redirección de dominio se gestiona en la configuración del proyecto de Vercel.
- Las rutas públicas usan URL sin barra final, salvo la portada `/`. Astro genera las canónicas y el sitemap con ese formato, y Vercel redirige las variantes con barra final.
- Las páginas indexables son la portada, `aviso-legal`, `politica-privacidad` y `politica-cookies`; la página 404 no se incluye en el sitemap.

## Datos pendientes

- Imagen social dedicada en formato 1200x630, si Borja quiere una previsualización Open Graph optimizada.
- Dirección, coordenadas, horario, área formal de servicio y URL de Google Business Profile, si se quiere completar el schema local sin inventar datos.

## Acciones externas

- Verificar propiedad de `https://www.borchgomez.es/` en Google Search Console y Bing Webmaster Tools.
- Enviar `https://www.borchgomez.es/sitemap.xml` en los paneles de webmaster.
- Revisar Google Business Profile y enlazarlo con la web si Borja proporciona la URL oficial.
