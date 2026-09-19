#!/usr/bin/env python
"""Medical/health website "feel" scorer.

Grounding (research, 2026-09):
- Blue dominates healthcare web design: trust, calm, competence
  (progress.com healthcare color psychology; c7.healthcare; epdwebsites.com;
  bethanyworks.com). Teal/green = stabilizing/health (psychiatryadvisor.com).
- Pharma/biotech conventions: white space, readability, negative space,
  professional restraint (3mediaweb.com, sambasci.com).
- Client reference corpus (ref/*.jpeg): medical blue #035DA8/#1367A7,
  petrol/teal #11596B, cyan #37A7BB, light-blue/white surfaces.

Scoring model (all deterministic, offline, no RNG):
  palette_alignment    30% - share of saturated color tokens in the
                              clinical hue family (teal..indigo, 160-260 deg)
  lightness_airiness   15% - share of light tokens (clinical white/tint surfaces)
  saturation_restraint 15% - saturated tokens avoiding loud chroma (<= 0.72)
  motif_density        20% - medical iconography/symbolism density
  reference_affinity   20% - page palette proximity to ref/ image corpus

Emits METRIC lines (primary: medical_feel_score, 0-100).
"""

from __future__ import annotations

import argparse
import colorsys
import json
import re
import sys
from pathlib import Path

CLINICAL_HUE_LO = 160.0   # teal/cyan/blue/indigo hue family
CLINICAL_HUE_HI = 260.0
SATURATED_MIN = 0.18      # HSL S >= this counts as a saturated (accent) token
NEON_CHROMA_MAX = 0.72    # chroma (vividness) above this = loud/neon
LIGHT_MIN = 0.82          # L >= this counts as a light clinical surface
AFFINITY_DIST = 90.0      # max RGB euclidean distance for a palette match
MOTIF_TARGET = 25         # marker occurrences needed for full motif score
TW_CHROMA = {"50": 0.08, "100": 0.12, "200": 0.18, "300": 0.28,
             "400": 0.50, "500": 0.60, "600": 0.65, "700": 0.60,
             "800": 0.50, "900": 0.40, "950": 0.30}

# Tailwind utility color families -> classification
TW_CLINICAL = {"teal", "cyan", "sky", "blue", "indigo"}
TW_NEUTRAL = {"slate", "gray", "zinc", "neutral", "stone"}
# everything else (red/orange/amber/yellow/rose/pink/green/lime/emerald,
# violet, purple, fuchsia) counts as off-family unless emerald/teal.
TW_CLINICAL |= {"emerald"}
TW_LIGHT_SHADES = {"50", "100", "200", "300"}

MOTIF_PATTERNS = [
    r"fa-heart-pulse", r"fa-stethoscope", r"fa-file-medical",
    r"fa-user-doctor", r"fa-microscope", r"fa-shield", r"fa-book-medical",
    r"fa-laptop-medical", r"fa-hospital", r"fa-capsules", r"fa-syringe",
    r"fa-dna", r"fa-user-nurse", r"fa-wave-square", r"fa-user-shield",
    r"<polyline",              # ECG trace line
    r"M18 13v10",              # plus/cross pattern tile
    r"bg-plus-pattern",
    r"bg-dots-pattern",
]

HEX6_RE = re.compile(r"#[0-9a-fA-F]{6}\b")
HEX3_RE = re.compile(r"#(?:[0-9a-fA-F]{3})(?![0-9a-fA-F])")
TW_RE = re.compile(
    r"\b(teal|cyan|sky|blue|indigo|emerald|slate|gray|grey|zinc|neutral|stone|"
    r"red|orange|amber|yellow|rose|pink|green|lime|violet|purple|fuchsia)-(\d{2})\b"
)
WHITE_RE = re.compile(r"\b(?:bg|text|border)-white\b|\bwhite/\[")

# ---------------------------------------------------------------- helpers


def hex_to_hsl(token: str):
    token = token.lstrip("#")
    if len(token) == 3:
        token = "".join(ch * 2 for ch in token)
    r = int(token[0:2], 16) / 255.0
    g = int(token[2:4], 16) / 255.0
    b = int(token[4:6], 16) / 255.0
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return h * 360.0, s, l


def hex_to_rgb(token: str):
    token = token.lstrip("#")
    if len(token) == 3:
        token = "".join(ch * 2 for ch in token)
    return (int(token[0:2], 16), int(token[2:4], 16), int(token[4:6], 16))


def rgb_distance(a, b) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


# ---------------------------------------------------------------- tokens


def collect_tokens(text: str):
    """Return list of (kind, h, s, l, rgb, chroma) color tokens."""
    tokens = []
    for m in HEX6_RE.finditer(text):
        h, s, l = hex_to_hsl(m.group(0))
        rgb = hex_to_rgb(m.group(0))
        chroma = (max(rgb) - min(rgb)) / 255.0
        tokens.append(("hex", h, s, l, rgb, chroma))
    covered3 = set(m.span() for m in HEX6_RE.finditer(text))
    for m in HEX3_RE.finditer(text):
        if (m.start(), m.end()) in covered3:
            continue
        h, s, l = hex_to_hsl(m.group(0))
        rgb = hex_to_rgb(m.group(0))
        chroma = (max(rgb) - min(rgb)) / 255.0
        tokens.append(("hex", h, s, l, rgb, chroma))
    for m in TW_RE.finditer(text):
        fam, shade = m.group(1), m.group(2)
        if fam == "grey":
            fam = "gray"
        if fam in TW_CLINICAL or fam in TW_NEUTRAL:
            # representative HSL per family (documented approximation)
            fam_hue = {"teal": 175, "cyan": 187, "sky": 199, "blue": 217,
                       "indigo": 239, "emerald": 160}.get(fam, 210 if fam in TW_NEUTRAL else 210)
            if fam in TW_NEUTRAL:
                fam_hue = 210
                s = 0.08
            else:
                s = 0.65
            l = {"50": 0.97, "100": 0.94, "200": 0.90, "300": 0.83,
                 "400": 0.68, "500": 0.55, "600": 0.46, "700": 0.37,
                 "800": 0.29, "900": 0.21, "950": 0.14}.get(shade, 0.5)
            chroma = 0.06 if fam in TW_NEUTRAL else TW_CHROMA.get(shade, 0.50)
            tokens.append(("tw", fam_hue, s, l, None, chroma))
    for _ in WHITE_RE.finditer(text):
        tokens.append(("tw", 210.0, 0.0, 1.0, None, 0.0))
    return tokens


# ---------------------------------------------------------------- refs


def reference_palette(ref_dir: Path):
    """Deterministic palette clusters from reference JPEGs (PIL MEDIANCUT)."""
    clusters = []
    try:
        from PIL import Image
    except ImportError:
        print("WARN: PIL unavailable; reference_affinity=0", file=sys.stderr)
        return clusters
    files = sorted(p for p in ref_dir.iterdir()
                   if p.suffix.lower() in (".jpg", ".jpeg", ".png"))
    for path in files:
        im = Image.open(path).convert("RGB")
        w, h = im.size
        small = im.resize((200, max(1, int(200 * h / w))))
        q = small.quantize(colors=12, method=Image.MEDIANCUT).convert("RGB")
        total = small.size[0] * small.size[1]
        counts = sorted(q.getcolors(total) or [], reverse=True)
        for cnt, rgb in counts:
            if cnt / total >= 0.03:  # keep clusters >= 3% weight
                clusters.append(rgb)
    return clusters


# ---------------------------------------------------------------- scoring


def score(text: str, ref_dir: Path) -> dict:
    tokens = collect_tokens(text)
    metrics = {}
    if not tokens:
        return {k: 0.0 for k in (
            "palette_alignment", "lightness_airiness",
            "saturation_restraint", "motif_density", "reference_affinity",
            "medical_feel_score")}

    saturated = [t for t in tokens if t[2] >= SATURATED_MIN]

    # 1. palette alignment: saturated tokens in clinical hue family
    if saturated:
        clinical = sum(1 for t in saturated
                       if CLINICAL_HUE_LO <= t[1] <= CLINICAL_HUE_HI)
        metrics["palette_alignment"] = clinical / len(saturated)
    else:
        metrics["palette_alignment"] = 0.0

    # 2. lightness airiness: light tokens share
    light = sum(1 for t in tokens if t[3] >= LIGHT_MIN)
    metrics["lightness_airiness"] = min(1.0, (light / len(tokens)) / 0.45)

    # 3. saturation restraint: saturated tokens that avoid neon
    if saturated:
        restrained = sum(1 for t in saturated if t[5] <= NEON_CHROMA_MAX)
        metrics["saturation_restraint"] = restrained / len(saturated)
    else:
        metrics["saturation_restraint"] = 1.0

    # 4. motif density
    motif_hits = sum(len(re.findall(p, text)) for p in MOTIF_PATTERNS)
    metrics["motif_density"] = min(1.0, motif_hits / MOTIF_TARGET)

    # 5. reference affinity: hex tokens near a reference cluster
    clusters = reference_palette(ref_dir)
    hex_tokens = [t for t in tokens if t[4] is not None]
    if clusters and hex_tokens:
        near = sum(
            1 for t in hex_tokens
            if min(rgb_distance(t[4], c) for c in clusters) <= AFFINITY_DIST
        )
        metrics["reference_affinity"] = near / len(hex_tokens)
    else:
        metrics["reference_affinity"] = 0.0

    weights = {
        "palette_alignment": 0.30,
        "lightness_airiness": 0.15,
        "saturation_restraint": 0.15,
        "motif_density": 0.20,
        "reference_affinity": 0.20,
    }
    composite = sum(metrics[k] * w for k, w in weights.items())
    metrics["medical_feel_score"] = composite * 100.0
    return metrics


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--target", default="platform.html")
    ap.add_argument("--ref-dir", default="ref")
    args = ap.parse_args()

    target = Path(args.target)
    if not target.exists():
        print(f"ERROR: target not found: {target}", file=sys.stderr)
        return 1
    text = target.read_text(encoding="utf-8")
    metrics = score(text, Path(args.ref_dir))

    print(f"METRIC medical_feel_score={metrics['medical_feel_score']:.2f}")
    for k in ("palette_alignment", "lightness_airiness",
              "saturation_restraint", "motif_density", "reference_affinity"):
        print(f"METRIC {k}={metrics[k]:.4f}")
    print(json.dumps(metrics, indent=2), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
