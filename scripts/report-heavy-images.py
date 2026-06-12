#!/usr/bin/env python3
"""Muestra las imágenes versionadas de mayor tamaño sin imponer límites."""

from __future__ import annotations

import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
IMAGE_EXTENSIONS = {".avif", ".gif", ".ico", ".jpeg", ".jpg", ".png", ".svg", ".webp"}
REPORT_LIMIT = 20


def human_size(size: int) -> str:
    value = float(size)
    for unit in ("B", "KB", "MB", "GB"):
        if value < 1024 or unit == "GB":
            return f"{value:.1f} {unit}" if unit != "B" else f"{size} B"
        value /= 1024
    raise AssertionError("Unidad de tamaño no alcanzable")


def main() -> int:
    result = subprocess.run(
        ["git", "ls-files", "-z", "--", "assets/img"],
        cwd=ROOT,
        check=True,
        capture_output=True,
    )
    images = [
        ROOT / item.decode()
        for item in result.stdout.split(b"\0")
        if item and Path(item.decode()).suffix.lower() in IMAGE_EXTENSIONS
    ]
    images.sort(key=lambda path: (-path.stat().st_size, path.relative_to(ROOT).as_posix()))

    print("## Imágenes más pesadas")
    print()
    if not images:
        print("No se han encontrado imágenes versionadas.")
        return 0

    for position, path in enumerate(images[:REPORT_LIMIT], start=1):
        relative = path.relative_to(ROOT).as_posix()
        print(f"{position}. {human_size(path.stat().st_size):>9}  `{relative}`")

    print()
    print(f"Ranking informativo de las {min(REPORT_LIMIT, len(images))} imágenes de mayor tamaño; no aplica umbrales.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
