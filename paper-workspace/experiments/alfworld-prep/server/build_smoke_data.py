#!/usr/bin/env python3
"""Fetch two fixed ALFWorld training samples with explicit HTTP Range requests."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import zipfile
from pathlib import Path, PurePosixPath

import requests
from remotezip import RemoteZip


REPOSITORY = "alfworld/alfworld"
ASSETS = {
    "json": {
        "id": 112282473,
        "name": "json_2.1.1_json.zip",
        "size": 72_018_818,
        "members": [
            "json_2.1.1/train/look_at_obj_in_light-AlarmClock-None-DeskLamp-301/"
            "trial_T20190907_174127_043461/traj_data.json",
            "json_2.1.1/train/look_at_obj_in_light-AlarmClock-None-DeskLamp-301/"
            "trial_T20190907_174142_375532/traj_data.json",
        ],
    },
    "pddl": {
        "id": 112282926,
        "name": "json_2.1.1_pddl.zip",
        "size": 34_881_784,
        "members": [
            "json_2.1.1/train/look_at_obj_in_light-AlarmClock-None-DeskLamp-301/"
            "trial_T20190907_174127_043461/initial_state.pddl",
            "json_2.1.1/train/look_at_obj_in_light-AlarmClock-None-DeskLamp-301/"
            "trial_T20190907_174142_375532/initial_state.pddl",
        ],
    },
    "tw_pddl": {
        "id": 209796632,
        "name": "json_2.1.2_tw-pddl.zip",
        "size": 36_493_542,
        "members": [
            "json_2.1.1/train/look_at_obj_in_light-AlarmClock-None-DeskLamp-301/"
            "trial_T20190907_174127_043461/game.tw-pddl",
            "json_2.1.1/train/look_at_obj_in_light-AlarmClock-None-DeskLamp-301/"
            "trial_T20190907_174142_375532/game.tw-pddl",
        ],
    },
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def signed_asset_url(asset_id: int) -> str:
    endpoint = (
        f"https://api.github.com/repos/{REPOSITORY}/releases/assets/{asset_id}"
    )
    response = requests.get(
        endpoint,
        headers={"Accept": "application/octet-stream"},
        allow_redirects=False,
        timeout=30,
    )
    response.raise_for_status()
    location = response.headers.get("Location")
    if not location:
        raise RuntimeError(f"GitHub asset API did not return a redirect: {endpoint}")
    return location


def safe_destination(root: Path, member: str) -> Path:
    relative = PurePosixPath(member)
    if relative.is_absolute() or ".." in relative.parts:
        raise RuntimeError(f"unsafe ZIP member: {member}")
    destination = root.joinpath(*relative.parts).resolve()
    destination.relative_to(root.resolve())
    return destination


def fetch_members(output: Path) -> list[dict[str, object]]:
    records: list[dict[str, object]] = []
    for asset in ASSETS.values():
        archive = RemoteZip(
            signed_asset_url(int(asset["id"])),
            support_suffix_range=False,
        )
        available = set(archive.namelist())
        for member in asset["members"]:
            if member not in available:
                raise RuntimeError(f"missing member in {asset['name']}: {member}")
            destination = safe_destination(output, member)
            destination.parent.mkdir(parents=True, exist_ok=True)
            with archive.open(member) as source, destination.open("wb") as target:
                shutil.copyfileobj(source, target)
            records.append(
                {
                    "asset_id": asset["id"],
                    "asset_name": asset["name"],
                    "asset_size": asset["size"],
                    "member": member,
                    "size": destination.stat().st_size,
                    "sha256": sha256(destination),
                }
            )
        archive.close()
    return records


def extract_logic(output: Path, wheel: Path) -> list[dict[str, object]]:
    records: list[dict[str, object]] = []
    logic_dir = output / "logic"
    logic_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(wheel) as archive:
        for member in ("alfworld/data/alfred.pddl", "alfworld/data/alfred.twl2"):
            destination = logic_dir / Path(member).name
            with archive.open(member) as source, destination.open("wb") as target:
                shutil.copyfileobj(source, target)
            records.append(
                {
                    "source": wheel.name,
                    "member": member,
                    "path": destination.relative_to(output).as_posix(),
                    "size": destination.stat().st_size,
                    "sha256": sha256(destination),
                }
            )
    return records


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--wheel", type=Path, required=True)
    args = parser.parse_args()

    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    manifest = {
        "purpose": "Two fixed ALFWorld text-environment smoke samples; not a full dataset.",
        "repository": REPOSITORY,
        "license_review": (
            "Official GitHub Release assets associated with the MIT-licensed project; "
            "no separate data license file was found."
        ),
        "archive_hash_scope": (
            "Full-archive hashes are unavailable because only explicit HTTP byte ranges "
            "were fetched. Each extracted member is hashed below."
        ),
        "files": fetch_members(output),
        "logic_files": extract_logic(output, args.wheel.resolve()),
    }
    manifest_path = output / "smoke_data_manifest.json"
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(manifest_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
