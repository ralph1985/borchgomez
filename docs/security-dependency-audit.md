# Dependency security audit

Fecha: 2026-09-02

## Alcance

Esta auditoria cubre dependencias npm/pnpm de la web Astro, dependencias del Sanity Studio y GitHub Actions. No se han leido ni impreso secretos locales; solo se ha comprobado que `.env` y `studio/.env` estan ignorados por Git.

## Hallazgos

- La raiz del proyecto no reporta vulnerabilidades conocidas con `corepack pnpm audit --prod`.
- `studio/` tampoco reporta vulnerabilidades conocidas con `corepack pnpm --dir studio audit --prod`.
- La revisión inicial había detectado 9 avisos de producción en la raíz y 21 en el Studio, todos transitivos salvo las versiones base que los arrastraban.
- Los paquetes afectados incluían `astro`, `postcss`, `js-yaml`, `nanoid`, `svgo`, `undici`, `adm-zip`, `brace-expansion`, `tar`, `browserslist` y `dompurify`.
- Secret scanning y push protection están activos en GitHub; Dependabot security updates permanece desactivado y debe activarse como tarea operativa pendiente.

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
