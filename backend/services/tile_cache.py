import os
import requests
from pathlib import Path

TILE_SERVER = "https://tile.openstreetmap.org"
CACHE_DIR = Path("cache/tiles")

def tile_path(z, x, y):
    return CACHE_DIR / str(z) / str(x) / f"{y}.png"

def fetch_tile(z: int, x: int, y: int) -> Path:
    path = tile_path(z, x, y)

    # ✅ CACHE HIT
    if path.exists():
        return path

    # ❌ CACHE MISS → download
    path.parent.mkdir(parents=True, exist_ok=True)

    url = f"{TILE_SERVER}/{z}/{x}/{y}.png"
    response = requests.get(url, timeout=10)

    if response.status_code != 200:
        raise RuntimeError(f"Tile fetch failed: {url}")

    with open(path, "wb") as f:
        f.write(response.content)

    return path
