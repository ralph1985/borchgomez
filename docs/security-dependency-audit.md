# Dependency security audit

Fecha: 2026-10-25

## Alcance

Esta auditoria cubre dependencias npm/pnpm de la web Astro, dependencias del Sanity Studio y GitHub Actions. No se han leido ni impreso secretos locales; solo se ha comprobado que `.env` y `studio/.env` estan ignorados por Git.

## Hallazgos

- Las auditorias de produccion de la raiz y `studio/` no reportan vulnerabilidades conocidas con `pnpm audit --prod`.
- En `main`, antes de esta rama, el audit completo local mostraba 9 hallazgos en la raiz y 11 en `studio/`; todos estan fuera del audit de produccion.
- La rama `fix/security-advisories-main-2026-10` actualiza en la raiz `fast-uri` a `3.1.9`, `undici@8` a `8.12.2`, `sharp` a `0.35.5` y `source-map-js` a `1.2.2`. En `studio/` actualiza Sanity a `6.17.0`, React/ReactDOM a `19.2.8`, TypeScript a `6.0.3`, `dompurify` a `3.4.17`, `undici@7` a `7.30.1`, `smol-toml` a `1.9.0`, `source-map-js` a `1.2.2` y `zod` a `4.6.6`.
- La actualización de Sanity elimina la ruta vulnerable de `undici@6`; el lockfile de Studio ya no resuelve esa major.
- Sanity `6.17.0` incluye la correccion del problema de perdida de datos en Portable Text incorporada en `6.14.1`; los pins de React, TypeScript y `@sanity/cli` satisfacen los peers del Studio.
- Tras estos cambios, los audits completos locales de la raiz y `studio/` no muestran vulnerabilidades conocidas; los audits de produccion tambien pasan.
- GitHub muestra 14 alertas abiertas en `main`. Esta rama resuelve localmente las 14 mediante versiones parcheadas; el estado remoto queda pendiente de releer despues de integrar y volver a escanear.
- `fast-uri@3.1.9` se publico el 2026-10-19 a las 23:05:26 UTC y alcanza los siete dias el 2026-10-26 a las 23:05:26 UTC. Se conserva el cooldown global de `10080` minutos y se exceptua solo `fast-uri@3.1.9` en la raiz.
- `smol-toml@1.9.0` corrige el hallazgo de Studio. Con autorizacion del usuario, se actualiza el override puntual de `@vercel/frameworks@3.29.0` fuera de su pin exacto `1.5.2`; la resolucion global `1.9.0` tambien cubre consumidores cuya semver la permite. Se valido con instalacion congelada, audit completo y build.
- `devalue` permanece fijado en `5.9.4`, version corregida para el aviso anterior. `zod@4.6.6` satisface el rango `^4.4.3` declarado por los consumidores del Studio y corrige un hallazgo del audit local.
- `astro` y `sanity` se clasifican como `devDependencies` porque la web y el Studio se publican como contenido estatico; los hallazgos quedan fuera del perimetro runtime, pero siguen visibles en el audit completo.
- Secret scanning, push protection y las alertas de Dependabot estan activos en GitHub; las actualizaciones de seguridad automaticas de Dependabot tambien estan habilitadas.

## Automatizacion

`.github/workflows/security-checks.yml` ejecuta `pnpm audit --prod` por separado para la raiz y `studio/` en cada push a `develop` o `main` y en cada pull request contra esas ramas. Las auditorias locales completas y de produccion pasan; los checks remotos de la nueva PR se comprobaran antes de informar que esta lista.

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

La rama mantiene el floor global y define una unica excepcion temporal y exacta: `fast-uri@3.1.9` en la raiz. No se usa una excepcion por nombre de paquete ni se reduce el cooldown global.

En la revision del 2 de septiembre de 2026 se usaron versiones parcheadas con al menos siete dias de antiguedad: Astro `7.2.7`, `@sanity/client` `7.26.2`, Sanity `6.11.0`, js-yaml `3.15.1` y los transitorios resueltos por los lockfiles. Las instalaciones se validaron con `--frozen-lockfile --ignore-scripts`.

## Referencias

- GitHub Dependabot options: https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file
- GitHub Dependabot security updates: https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates
- pnpm settings: https://pnpm.io/settings#minimumreleaseage
- pnpm audit: https://pnpm.io/cli/audit
