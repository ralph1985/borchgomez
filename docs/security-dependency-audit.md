# Dependency security audit

Fecha: 2026-10-24

## Alcance

Esta auditoria cubre dependencias npm/pnpm de la web Astro, dependencias del Sanity Studio y GitHub Actions. No se han leido ni impreso secretos locales; solo se ha comprobado que `.env` y `studio/.env` estan ignorados por Git.

## Hallazgos

- Las auditorias de producción de la raiz y `studio/` no reportan vulnerabilidades conocidas con `pnpm audit --prod`.
- `devalue` permanece fijado en `5.9.4`, versión corregida para el aviso anterior. El audit actual detecta nuevos avisos de `fast-uri@3.1.8`; la versión corregida indicada ahora es `3.1.9`.
- La rama de remediacion actualiza Astro a `7.4.0`, con `vite@8.3.4`, `http-cache-semantics@4.3.0` y `postcss-selector-parser@7.1.6`. El audit completo local ya no señala `http-cache-semantics`; la alerta de GitHub en `main` sigue abierta y no declara primera version corregida, por lo que debe releerse tras integrar la PR.
- El audit completo actual de la raiz muestra 9 hallazgos (3 altos, 4 moderados y 2 bajos), en rutas de build tooling que incluyen `source-map-js`, `sharp`, `undici` y `fast-uri`.
- El audit completo actual de `studio/` muestra 11 hallazgos (1 critico, 5 altos, 4 moderados y 1 bajo), en rutas de build tooling que incluyen `DOMPurify`, `source-map-js`, `zod`, `undici` y `smol-toml`.
- `astro` y `sanity` se clasifican como `devDependencies` porque la web y el Studio se publican como contenido estatico; los hallazgos quedan fuera del perimetro runtime, pero siguen visibles en el audit completo.
- Secret scanning, push protection y las alertas de Dependabot estan activos en GitHub; las actualizaciones de seguridad automaticas de Dependabot tambien estan habilitadas.

## Automatizacion

`.github/workflows/security-checks.yml` ejecuta `pnpm audit --prod` por separado para la raiz y `studio/` en cada push a `develop` o `main` y en cada pull request contra esas ramas. Ambos checks de producción pasan; el audit completo conserva los avisos de build tooling sin parche upstream.

## Buenas practicas aplicadas

- Configurar Dependabot en la rama por defecto del repositorio para que GitHub lea el fichero de configuracion.
- Separar ecosistemas y directorios: npm en `/`, npm en `/studio` y GitHub Actions en `/`.
- Enviar las actualizaciones programadas a `develop` con `target-branch`, manteniendo el flujo de trabajo habitual del proyecto.
- Agrupar actualizaciones `minor` y `patch` para reducir ruido y dejar las actualizaciones `major` como PRs separadas.
- Limitar PRs abiertos para evitar que el mantenimiento de dependencias bloquee el trabajo normal.
- Mantener versiones fijas en `package.json`; Dependabot debe actualizar specifiers exactos y lockfiles.
- Bloquear instalaciones de versiones publicadas hace menos de 7 dias con `minimumReleaseAge: 10080`.
- Actualizar las dependencias del Studio junto con su lockfile y validar build/lint/audit antes de publicar nuevas versiones de Sanity o transitorios.

## Politica de versiones jovenes

`pnpm-workspace.yaml` define `minimumReleaseAge: 10080`, equivalente a 7 dias. Esta espera aplica a dependencias directas y transitivas, y reduce el riesgo de instalar paquetes recien publicados que todavia no hayan pasado por deteccion comunitaria o retirada del registro.

No se definen exclusiones iniciales. Si una correccion urgente requiere instalar una version mas joven, debe justificarse en la PR y anadirse una excepcion puntual con `minimumReleaseAgeExclude`.

En la revision del 2 de septiembre de 2026 se usaron versiones parcheadas con al menos siete dias de antiguedad: Astro `7.2.7`, `@sanity/client` `7.26.2`, Sanity `6.11.0`, js-yaml `3.15.1` y los transitorios resueltos por los lockfiles. Las instalaciones se validaron con `--frozen-lockfile --ignore-scripts`.

## Referencias

- GitHub Dependabot options: https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file
- GitHub Dependabot security updates: https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates
- pnpm settings: https://pnpm.io/settings#minimumreleaseage
- pnpm audit: https://pnpm.io/cli/audit
