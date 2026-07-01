#!/usr/bin/env python3
"""Reporta assets públicos que no aparecen referenciados en el repositorio."""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = ROOT / "public" / "assets"
SCAN_EXTENSIONS = {
    ".css",
    ".astro",
    ".html",
    ".js",
    ".json",
    ".mjs",
    ".scss",
    ".ts",
    ".toml",
    ".webmanifest",
    ".xml",
    ".yaml",
    ".yml",
}
URL_PATTERN = re.compile(
    r"(?:url\(\s*|[\"'])([^\"')\s]+(?:\?[^\"')\s]*)?)(?:\s*\)|[\"'])",
    re.IGNORECASE,
)
SRCSET_PATTERN = re.compile(r"\bsrcset\s*=\s*([\"'])(.*?)\1", re.IGNORECASE | re.DOTALL)
ASSET_PREFIX_PATTERN = re.compile(r"(?:\.{0,2}/|/)?assets/[A-Za-z0-9_./%+@-]+(?:\?[^\s\"'<>)]*)?")


def tracked_files() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "-z"],
        cwd=ROOT,
        check=True,
        capture_output=True,
    )
    return [ROOT / item.decode() for item in result.stdout.split(b"\0") if item]


def human_size(size: int) -> str:
    value = float(size)
    for unit in ("B", "KB", "MB", "GB"):
        if value < 1024 or unit == "GB":
            return f"{value:.1f} {unit}" if unit != "B" else f"{size} B"
        value /= 1024
    raise AssertionError("Unidad de tamaño no alcanzable")


def iter_json_strings(value: object):
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for item in value:
            yield from iter_json_strings(item)
    elif isinstance(value, dict):
        for item in value.values():
            yield from iter_json_strings(item)


def candidate_urls(path: Path, text: str):
    for match in URL_PATTERN.finditer(text):
        yield match.group(1)

    for match in ASSET_PREFIX_PATTERN.finditer(text):
        yield match.group(0)

    for match in SRCSET_PATTERN.finditer(text):
        for entry in match.group(2).split(","):
            url = entry.strip().split(maxsplit=1)[0]
            if url:
                yield url

    if path.suffix.lower() in {".json", ".webmanifest"}:
        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            return
        yield from iter_json_strings(data)


def resolve_reference(source: Path, raw_url: str) -> Path | None:
    url = raw_url.strip().replace("\\/", "/")
    if not url or url.startswith(("#", "//", "data:")):
        return None

    parsed = urlsplit(url)
    if parsed.scheme or parsed.netloc:
        return None

    clean_path = unquote(parsed.path).lstrip("/")
    if not clean_path:
        return None

    if clean_path.startswith("assets/"):
        resolved = ROOT / "public" / clean_path
    else:
        resolved = source.parent / clean_path

    try:
        resolved = resolved.resolve()
        resolved.relative_to(ASSETS_DIR.resolve())
    except (OSError, ValueError):
        return None
    return resolved


def main() -> int:
    files = tracked_files()
    assets = {path.resolve() for path in files if path.is_file() and ASSETS_DIR in path.parents}
    references: set[Path] = set()

    for path in files:
        if not path.is_file() or path.suffix.lower() not in SCAN_EXTENSIONS:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for raw_url in candidate_urls(path, text):
            resolved = resolve_reference(path, raw_url)
            if resolved in assets:
                references.add(resolved)

    possible_orphans = sorted(
        assets - references,
        key=lambda path: (-path.stat().st_size, path.relative_to(ROOT).as_posix()),
    )

    print("## Posibles assets huérfanos")
    print()
    if not possible_orphans:
        print("No se han detectado posibles assets huérfanos.")
        return 0

    for path in possible_orphans:
        relative = path.relative_to(ROOT).as_posix()
        print(f"- {human_size(path.stat().st_size):>9}  `{relative}` - Posible asset huérfano")

    print()
    print("Informe orientativo: una referencia dinámica puede no ser detectable mediante análisis estático.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
