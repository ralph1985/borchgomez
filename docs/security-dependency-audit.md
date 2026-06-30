# Dependency security audit

Fecha: 2026-06-30

## Alcance

Esta auditoria cubre dependencias npm/pnpm de la web Astro, dependencias del Sanity Studio y GitHub Actions. No se han leido ni impreso secretos locales; solo se ha comprobado que `.env` y `studio/.env` estan ignorados por Git.

## Hallazgos

- La raiz del proyecto no reporta vulnerabilidades conocidas con `corepack pnpm audit --prod --audit-level moderate`.
- La raiz del proyecto tampoco reporta vulnerabilidades conocidas con `corepack pnpm audit --audit-level moderate` en la rama usada para configurar Dependabot.
- `studio/` reporta 14 vulnerabilidades con `corepack pnpm --dir studio audit --prod --audit-level moderate`: 2 bajas, 8 moderadas y 4 altas.
- Los hallazgos de `studio/` son transitivos bajo `sanity` y su CLI/build toolchain. Los paquetes afectados incluyen `ws`, `undici`, `js-yaml`, `smol-toml` y `uuid`.
- Dependabot alerts estaban desactivadas en GitHub y se activaron mediante la API de GitHub.

## Buenas practicas aplicadas

- Configurar Dependabot en la rama por defecto del repositorio para que GitHub lea el fichero de configuracion.
- Separar ecosistemas y directorios: npm en `/`, npm en `/studio` y GitHub Actions en `/`.
- Enviar las actualizaciones programadas a `develop` con `target-branch`, manteniendo el flujo de trabajo habitual del proyecto.
- Agrupar actualizaciones `minor` y `patch` para reducir ruido y dejar las actualizaciones `major` como PRs separadas.
- Limitar PRs abiertos para evitar que el mantenimiento de dependencias bloquee el trabajo normal.
- Mantener versiones fijas en `package.json`; Dependabot debe actualizar specifiers exactos y lockfiles.
- Bloquear instalaciones de versiones publicadas hace menos de 7 dias con `minimumReleaseAge: 10080`.
- Tratar las vulnerabilidades del Studio como trabajo de seguimiento separado, validando build/lint/audit antes de aceptar updates de Sanity o transitorios.

## Politica de versiones jovenes

`pnpm-workspace.yaml` define `minimumReleaseAge: 10080`, equivalente a 7 dias. Esta espera aplica a dependencias directas y transitivas, y reduce el riesgo de instalar paquetes recien publicados que todavia no hayan pasado por deteccion comunitaria o retirada del registro.

No se definen exclusiones iniciales. Si una correccion urgente requiere instalar una version mas joven, debe justificarse en la PR y anadirse una excepcion puntual con `minimumReleaseAgeExclude`.

## Referencias

- GitHub Dependabot options: https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file
- GitHub Dependabot security updates: https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates
- pnpm settings: https://pnpm.io/settings#minimumreleaseage
- pnpm audit: https://pnpm.io/cli/audit
