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

Scoring model v2 (all deterministic, offline, no RNG):
  palette_alignment    28% - share of saturated color tokens in the
                              clinical hue family (teal..indigo, 160-260 deg)
  typography_signal    12% - clinical micro-labels, weight ramp, readable
                              leading (sambasci.com typography conventions)
  lightness_airiness   12% - share of light tokens (clinical surfaces)
  saturation_restraint 12% - saturated tokens avoiding loud chroma (<= 0.72)
  motif_density        18% - medical iconography/symbolism density
  reference_affinity   18% - page palette proximity to ref/ corpus,
                              CIEDE2000 (Sharma 2005) <= 20
Emits METRIC lines (primary: medical_feel_score, 0-100).
"""

from __future__ import annotations

import argparse
import colorsys
import math
import json
import re
import sys
from pathlib import Path

CLINICAL_HUE_LO = 160.0   # teal/cyan/blue/indigo hue family
CLINICAL_HUE_HI = 260.0
SATURATED_MIN = 0.18      # HSL S >= this counts as a saturated (accent) token
NEON_CHROMA_MAX = 0.72    # chroma (vividness) above this = loud/neon
LIGHT_MIN = 0.82          # L >= this counts as a light clinical surface
AFFINITY_DELTA_E = 20.0   # CIEDE2000 perceptual threshold for a palette match
MOTIF_TARGET = 25         # marker occurrences needed for full motif score
EYEBROW_TARGET = 8        # uppercase tracked micro-labels for full score
WEIGHT_RAMP_MIN = 4       # distinct font-weight utilities for full score
LEADING_TARGET = 10       # leading-relaxed paragraphs for full score
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
    r"red|orange|amber|yellow|rose|pink|green|lime|violet|purple|fuchsia)-(\d{2,3})\b"
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

def rgb_to_lab(rgb):
    """sRGB -> CIELAB (D65)."""
    def f(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (f(c) for c in rgb)
    x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047
    y = (r * 0.2126729 + g * 0.7151522 + b * 0.0721750) / 1.00000
    z = (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) / 1.08883
    def g_(t):
        return t ** (1 / 3) if t > 0.008856 else (7.787 * t + 16 / 116)
    fx, fy, fz = g_(x), g_(y), g_(z)
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))


def ciede2000(lab1, lab2) -> float:
    """CIEDE2000 color difference (Sharma et al. 2005 formulation)."""
    L1, a1, b1 = lab1
    L2, a2, b2 = lab2
    kL, kC, kH = 1.0, 1.0, 1.0
    C1 = (a1 * a1 + b1 * b1) ** 0.5
    C2 = (a2 * a2 + b2 * b2) ** 0.5
    Cb = (C1 + C2) / 2
    C7 = Cb ** 7
    G = 0.5 * (1 - (C7 / (C7 + 25 ** 7)) ** 0.5)
    a1p = (1 + G) * a1
    a2p = (1 + G) * a2
    C1p = (a1p * a1p + b1 * b1) ** 0.5
    C2p = (a2p * a2p + b2 * b2) ** 0.5
    h1p = math.degrees(math.atan2(b1, a1p)) % 360 if (a1p or b1) else 0.0
    h2p = math.degrees(math.atan2(b2, a2p)) % 360 if (a2p or b2) else 0.0
    dLp = L2 - L1
    dCp = C2p - C1p
    if C1p * C2p == 0:
        dhp = 0.0
    else:
        dhp = h2p - h1p
        if dhp > 180:
            dhp -= 360
        elif dhp < -180:
            dhp += 360
    dHp = 2 * (C1p * C2p) ** 0.5 * math.sin(math.radians(dhp) / 2)
    Lbp = (L1 + L2) / 2
    Cbp = (C1p + C2p) / 2
    if C1p * C2p == 0:
        hbp = h1p + h2p
    else:
        if abs(h1p - h2p) <= 180:
            hbp = (h1p + h2p) / 2
        elif (h1p + h2p) < 360:
            hbp = (h1p + h2p + 360) / 2
        else:
            hbp = (h1p + h2p - 360) / 2
    T = (1 - 0.17 * math.cos(math.radians(hbp - 30))
         + 0.24 * math.cos(math.radians(2 * hbp))
         + 0.32 * math.cos(math.radians(3 * hbp + 6))
         - 0.20 * math.cos(math.radians(4 * hbp - 63)))
    dtheta = 30 * math.exp(-(((hbp - 275) / 25) ** 2))
    Cbp7 = Cbp ** 7
    RC = 2 * (Cbp7 / (Cbp7 + 25 ** 7)) ** 0.5
    SL = 1 + (0.015 * (Lbp - 50) ** 2) / (20 + (Lbp - 50) ** 2) ** 0.5
    SC = 1 + 0.045 * Cbp
    SH = 1 + 0.015 * Cbp * T
    RT = -math.sin(math.radians(2 * dtheta)) * RC
    dL = dLp / (kL * SL)
    dC = dCp / (kC * SC)
    dH = dHp / (kH * SH)
    return (dL * dL + dC * dC + dH * dH + RT * dC * dH) ** 0.5


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
        if fam == "grey":
            fam_hue, s = 210.0, 0.08
            chroma = 0.06
        elif fam in TW_NEUTRAL:
            fam_hue, s = 210.0, 0.08
            chroma = 0.06
        elif fam in TW_CLINICAL:
            fam_hue = {"teal": 175, "cyan": 187, "sky": 199, "blue": 217,
                       "indigo": 239, "emerald": 160}[fam]
            s = 0.65
            chroma = TW_CHROMA.get(shade, 0.50)
        else:
            # off-family utilities: representative hues outside the clinical
            # range (documented approximation) so they correctly penalize
            # palette_alignment
            fam_hue = {"red": 4, "orange": 27, "amber": 46, "yellow": 55,
                       "lime": 74, "green": 145, "rose": 351, "pink": 330,
                       "violet": 265, "purple": 291, "fuchsia": 297}[fam]
            s = 0.70
            chroma = TW_CHROMA.get(shade, 0.50)
        l = {"50": 0.97, "100": 0.94, "200": 0.90, "300": 0.83,
             "400": 0.68, "500": 0.55, "600": 0.46, "700": 0.37,
             "800": 0.29, "900": 0.21, "950": 0.14}.get(shade, 0.5)
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
            "typography_signal", "medical_feel_score")}

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
        cluster_labs = [rgb_to_lab(c) for c in clusters]
        token_labs = [(t[4], rgb_to_lab(t[4])) for t in hex_tokens]
        near = sum(
            1 for rgb, lab in token_labs
            if min(ciede2000(lab, cl) for cl in cluster_labs) <= AFFINITY_DELTA_E
        )
        metrics["reference_affinity"] = near / len(hex_tokens)
    else:
        metrics["reference_affinity"] = 0.0

    # 6. typography signal: clinical micro-labels, weight ramp, readable leading
    eyebrows = len(re.findall(r"uppercase[^>\"]*tracking-(?:widest|wider|\[0\.3em\])", text)) \
        + len(re.findall(r"tracking-(?:widest|wider|\[0\.3em\])[^>\"]*uppercase", text))
    eyebrow_score = min(1.0, eyebrows / EYEBROW_TARGET)
    weights_used = sum(
        1 for w in ("font-light", "font-medium", "font-semibold",
                    "font-bold", "font-black", "font-extrabold")
        if w in text
    )
    ramp_score = min(1.0, weights_used / WEIGHT_RAMP_MIN)
    leading_score = min(1.0, text.count("leading-relaxed") / LEADING_TARGET)
    metrics["typography_signal"] = (eyebrow_score + ramp_score + leading_score) / 3.0

    weights = {
        "palette_alignment": 0.28,
        "typography_signal": 0.12,
        "lightness_airiness": 0.12,
        "saturation_restraint": 0.12,
        "motif_density": 0.18,
        "reference_affinity": 0.18,
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
              "saturation_restraint", "motif_density", "reference_affinity",
              "typography_signal"):
        print(f"METRIC {k}={metrics[k]:.4f}")
    print(json.dumps(metrics, indent=2), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
