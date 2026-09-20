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
from html.parser import HTMLParser
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
    """Deterministic palette clusters from the reference corpus.

    Two sources, merged:
    - ref_dir images (client visual brand ground truth): PIL MEDIANCUT
      clusters >= 3% pixel weight each.
    - ref_dir-real/*.json (declared DOM colors harvested from live
      medical/pharma sites, committed as fixtures): colors with >= 5%
      of each site's total element-count weight.
    """
    clusters = []
    try:
        from PIL import Image
    except ImportError:
        print("WARN: PIL unavailable; image clusters skipped", file=sys.stderr)
        Image = None
    if Image is not None:
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
    # declared-color corpus from real medical/pharma sites
    real_dir = ref_dir.parent / "ref-real"
    if real_dir.is_dir():
        for jpath in sorted(real_dir.glob("*.json")):
            try:
                data = json.loads(jpath.read_text(encoding="utf-8"))
            except (OSError, ValueError):
                continue
            total = sum(data.values()) or 1
            for hexkey, cnt in data.items():
                if cnt / total >= 0.05:  # colors >= 5% element weight
                    rgb = (int(hexkey[0:2], 16), int(hexkey[2:4], 16),
                           int(hexkey[4:6], 16))
                    clusters.append(rgb)
    return clusters


# ---------------------------------------------------------------- contrast
# WCAG 2.1 AA contrast, measured on declared Tailwind classes via a light
# ancestor-tracking parser (deterministic static analysis; no DOM).
# Rationale: healthcare sites serve elderly/low-vision audiences;
# readability is a documented medical-web convention (sambasci.com,
# 3mediaweb.com). Large text (>=24px, or >=18.66px bold) needs 3:1,
# normal text 4.5:1.

TW_TOKEN_HEX = {
    "slate-50": "F8FAFC", "slate-100": "F1F5F9", "slate-200": "E2E8F0",
    "slate-300": "CBD5E1", "slate-400": "94A3B8", "slate-500": "64748B",
    "slate-600": "475569", "slate-700": "334155", "slate-800": "1E293B",
    "slate-900": "0F172A", "blue-50": "EFF6FF", "blue-100": "DBEAFE",
    "blue-200": "BFDBFE", "blue-300": "93C5FD", "blue-400": "60A5FA",
    "blue-500": "3B82F6", "blue-600": "2563EB", "blue-700": "1D4ED8",
    "blue-800": "1E40AF", "blue-900": "1E3A8A", "cyan-50": "ECFEFF",
    "cyan-100": "CFFAFE", "cyan-200": "A5F3FC", "cyan-300": "67E8F9",
    "cyan-400": "22D3EE", "cyan-500": "06B6D4", "cyan-600": "0891B2",
    "cyan-700": "0E7490", "cyan-800": "155E75", "cyan-900": "164E63",
    "white": "FFFFFF", "black": "000000",
}
TW_SIZE_PX = {"xs": 12, "sm": 14, "base": 16, "lg": 18, "xl": 20, "2xl": 24,
              "3xl": 30, "4xl": 36, "5xl": 48, "6xl": 60}
VOID_TAGS = {"br", "img", "hr", "input", "meta", "link", "source", "path",
             "circle", "line", "polyline", "rect"}


def _hex_tuple(h):
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def _blend(fg, bg, a):
    """fg over bg with alpha a."""
    return tuple(round(f * a + b * (1 - a)) for f, b in zip(fg, bg))


def _rel_lum(rgb):
    def ch(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def _contrast_ratio(fg, bg):
    l1, l2 = _rel_lum(fg), _rel_lum(bg)
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


class _ContrastParser(HTMLParser):
    """Tracks (text color, background, size, bold) for text nodes."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = [ {"fg": "000000", "bg": "FFFFFF",
                        "size": 16.0, "bold": False} ]
        self.svg_depth = 0
        self.hidden_depth = 0
        self.samples = []   # (ratio, required, text, fg, bg)

    def _own_bg(self, classes):
        hex_bg = re.search(r"bg-\[#?([0-9a-fA-F]{6})\]", classes)
        if hex_bg:
            return hex_bg.group(1).upper()
        grad = (re.search(r"from-\[#?([0-9a-fA-F]{6})\]", classes),
                re.search(r"to-\[#?([0-9a-fA-F]{6})\]", classes))
        if "bg-gradient" in classes and grad[0] and grad[1]:
            a, b = _hex_tuple(grad[0].group(1)), _hex_tuple(grad[1].group(1))
            return "".join(f"{(x + y) // 2:02X}" for x, y in zip(a, b))
        if "bg-gradient" in classes:
            named = []
            for stop in ("from", "to"):
                m = re.search(rf"{stop}-(\w[\w-]*\d{{2,3}}|\w+)(?![\w/\[])", classes)
                if m and m.group(1) in TW_TOKEN_HEX:
                    named.append(TW_TOKEN_HEX[m.group(1)])
                else:
                    named.append(None)
            if named[0] and named[1]:
                a, b = _hex_tuple(named[0]), _hex_tuple(named[1])
                return "".join(f"{(x + y) // 2:02X}" for x, y in zip(a, b))
            if named[0]:
                return named[0]
        if "bg-gradient" in classes and grad[0]:
            return grad[0].group(1).upper()
        for tok in classes.split():
            key = tok[3:] if tok.startswith("bg-") else ""
            if key in TW_TOKEN_HEX:
                return TW_TOKEN_HEX[key]
        alpha = re.search(r"bg-white/\[(0?\.\d+)\]", classes)
        if alpha:
            parent = self.stack[-1]["bg"]
            return "".join(f"{c:02X}" for c in
                           _blend((255, 255, 255), _hex_tuple(parent),
                                  float(alpha.group(1))))
        return None

    def handle_starttag(self, tag, attrs):
        attr_d = dict(attrs)
        if tag == "svg":
            self.svg_depth += 1
        elif attr_d.get("aria-hidden") == "true":
            self.hidden_depth += 1
        if tag in VOID_TAGS or tag == "svg" or self.hidden_depth:
            return
        classes = attr_d.get("class", "") or ""
        parent = self.stack[-1]
        bg = self._own_bg(classes) or parent["bg"]
        fg = parent["fg"]
        fg_alpha = 1.0
        size = parent["size"]
        bold = parent["bold"]
        for raw_tok in classes.split():
            # responsive variants (sm:/md:/lg:) apply at desktop widths —
            # score against the desktop-applied utility
            tok = raw_tok.split(":", 1)[1] if ":" in raw_tok else raw_tok
            key = tok[5:] if tok.startswith("text-") else ""
            if key in TW_TOKEN_HEX:
                fg = TW_TOKEN_HEX[key]
                fg_alpha = 1.0
            elif re.fullmatch(r"\[#([0-9a-fA-F]{6})\]", key or ""):
                m6 = re.fullmatch(r"\[#([0-9a-fA-F]{6})\]", key)
                fg = m6.group(1).upper()
                fg_alpha = 1.0
            elif key in TW_SIZE_PX:
                size = float(TW_SIZE_PX[key])
            elif re.fullmatch(r"\[\d+px\]", key or ""):
                size = float(key[1:-3])
            elif tok.startswith("text-") and "/" in tok:
                base, _, a = tok[5:].partition("/")
                if base in TW_TOKEN_HEX and re.fullmatch(r"\d+", a or ""):
                    fg = TW_TOKEN_HEX[base]
                    fg_alpha = int(a) / 100.0
        if "font-bold" in classes or "font-black" in classes \
                or "font-extrabold" in classes:
            bold = True
        if "font-light" in classes:
            bold = False
        self.stack.append({"fg": fg, "bg": bg, "size": size,
                           "bold": bold, "fg_alpha": fg_alpha})

    def handle_endtag(self, tag):
        if tag == "svg" and self.svg_depth:
            self.svg_depth -= 1
            return
        if tag in VOID_TAGS or tag == "svg":
            return
        if self.hidden_depth:
            self.hidden_depth -= 1
            return
        if len(self.stack) > 1:
            self.stack.pop()

    def handle_data(self, data):
        if self.svg_depth or self.hidden_depth or not data.strip():
            return
        ctx = self.stack[-1]
        fg = _blend(_hex_tuple(ctx["fg"]), _hex_tuple(ctx["bg"]),
                    ctx.get("fg_alpha", 1.0))
        ratio = _contrast_ratio(fg, _hex_tuple(ctx["bg"]))
        required = 3.0 if (ctx["size"] >= 24 or
                           (ctx["size"] >= 18.66 and ctx["bold"])) else 4.5
        self.samples.append((ratio, required, data.strip()[:24],
                             ctx["fg"], ctx["bg"]))


def contrast_readability(html_text: str):
    """Return (score 0-1, failing samples)."""
    p = _ContrastParser()
    p.feed(html_text)
    p.close()
    if not p.samples:
        return 1.0, []
    failing = [s for s in p.samples if s[0] < s[1]]
    return 1 - len(failing) / len(p.samples), failing


# ---------------------------------------------------------------- scoring


def score(text: str, ref_dir: Path) -> dict:
    tokens = collect_tokens(text)
    metrics = {}
    if not tokens:
        return {k: 0.0 for k in (
            "palette_alignment", "lightness_airiness",
            "saturation_restraint", "motif_density", "reference_affinity",
            "typography_signal", "contrast_readability", "medical_feel_score")}

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

    # 7. contrast readability: WCAG 2.1 AA on declared text/bg pairs
    cr_score, cr_failures = contrast_readability(text)
    metrics["contrast_readability"] = cr_score
    for ratio, req, snippet, fg, bg in sorted(cr_failures)[:8]:
        print(f"WARN contrast {ratio:.2f}<{req} fg=#{fg} bg=#{bg} '{snippet}'",
              file=sys.stderr)

    weights = {
        "palette_alignment": 0.25,
        "typography_signal": 0.10,
        "lightness_airiness": 0.11,
        "saturation_restraint": 0.11,
        "motif_density": 0.16,
        "reference_affinity": 0.16,
        "contrast_readability": 0.11,
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
              "typography_signal", "contrast_readability"):
        print(f"METRIC {k}={metrics[k]:.4f}")
    print(json.dumps(metrics, indent=2), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
