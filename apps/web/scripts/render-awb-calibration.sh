#!/usr/bin/env bash

set -euo pipefail

TRACKING="${1:-9I-TST18478688}"

ROOT="$(pwd)"
OUT="$ROOT/.awb-calibration"

mkdir -p "$OUT/reference"
mkdir -p "$OUT/generated"
mkdir -p "$OUT/diff"

echo "Generating pixel-perfect AWB..."

curl -sS \
  "http://localhost:3000/api/airwaybill-pixel/${TRACKING}" \
  -o "$OUT/generated.pdf"

echo "Rendering reference..."

python /home/oai/skills/pdfs/scripts/render_pdf.py \
  "$ROOT/public/templates/air-waybill-template.pdf" \
  --out_dir "$OUT/reference" \
  --dpi 200

echo "Rendering generated AWB..."

python /home/oai/skills/pdfs/scripts/render_pdf.py \
  "$OUT/generated.pdf" \
  --out_dir "$OUT/generated" \
  --dpi 200

echo "Creating visual diff..."

python /home/oai/skills/pdfs/scripts/compare_renders.py \
  "$ROOT/public/templates/air-waybill-template.pdf" \
  "$OUT/generated.pdf" \
  --out_dir "$OUT/diff" \
  --dpi 200

echo
echo "Done."
echo "Reference: $OUT/reference/page-1.png"
echo "Generated: $OUT/generated/page-1.png"
echo "Diff:      $OUT/diff"
