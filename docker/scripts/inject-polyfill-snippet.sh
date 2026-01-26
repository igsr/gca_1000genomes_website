#!/bin/sh
set -eux

f=${1:-}
if [ -z "$f" ]; then
  echo "Usage: $(basename "$0") <html-file>" >&2
  exit 1
fi

snippet=$(mktemp /tmp/vendors.snippet.XXXXXX)
cat > "$snippet" <<'EOF'
  <script src="/data-portal/vendor/core-js.min.js"></script>
  <script src="/data-portal/vendor/reflect-metadata.js"></script>
  <script src="/data-portal/vendor/zone.js"></script>
EOF
awk 'FNR==NR{buf=buf $0 ORS; next} /static\/build\.js/ && !done { printf "%s", buf; print; done=1; next } { print } END{ if(!done) printf "%s", buf }' \
  "$snippet" "$f" > "$f.tmp" && mv "$f.tmp" "$f"
rm -f "$snippet"
