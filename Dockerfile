# syntax=docker/dockerfile:1.6
#
# IGSR Front-End Dockerfile
# --------------------------------
# Purpose: Build and serve the IGSR website composed of:
#   - Jekyll site (Ruby 2.2 / Debian Jessie)  → /usr/share/nginx/html
#   - Angular 4 portal bundled by Webpack 3   → /usr/share/nginx/html/data-portal
#   - nginx (stable-alpine) runtime with a templated config (envsubst)
#
# Key versions:
#   Ruby 2.2  | Bundler 1.16.0 | Jekyll (from Gemfile)
#   Node 16   | Webpack 3.12.0 | TypeScript 2.4.2 | RxJS 5.4.3 | Zone.js 0.8.29
#   nginx:stable-alpine
#
# Notes:
#   - Jekyll is always built with JEKYLL_ENV=production (no build-time modes).
#   - Angular bundle is always built in production mode (webpack -p).
#   - Local polyfills (core-js, reflect-metadata, zone.js) are shipped to avoid
#     brittle CDN dependencies and are injected into /data-portal/index.html.
#   - API_BASE is an nginx proxy target. For Docker Desktop on macOS/Linux,
#     you’ll typically run with: --add-host=host.docker.internal:host-gateway
# 
# To build and run for local testing/dev: 
# cd gca_1000genomes_website
# docker build -no-cache --platform=linux/amd64 -t igsr-fe .
# docker run --rm -p 8080:80 -e API_BASE="http://host.docker.internal:8000" --add-host=host.docker.internal:host-gateway igsr-fe
# Then browse to http://localhost:8080

##
## Stage 1 — Jekyll site build (Ruby 2.2 / Debian Jessie)
##
FROM ruby:2.2 AS jekyll

# Build Jekyll in production mode
ENV JEKYLL_ENV=production

# Debian archive pins for old Jessie base
RUN set -eux; \
    sed -i 's/deb.debian.org/archive.debian.org/g; s|security.debian.org|archive.debian.org|g' /etc/apt/sources.list; \
    sed -i '/jessie-updates/d' /etc/apt/sources.list; \
    printf 'Acquire::Check-Valid-Until "false";\nAcquire::AllowInsecureRepositories "true";\n' > /etc/apt/apt.conf.d/99archive; \
    apt-get -o Acquire::Check-Valid-Until=false -o Acquire::AllowInsecureRepositories=true update; \
    apt-get -y --allow-unauthenticated --no-install-recommends install \
    build-essential git ca-certificates libxml2-dev libxslt1-dev zlib1g-dev nodejs; \
    ln -sf /usr/bin/nodejs /usr/bin/node || true; \
    rm -rf /var/lib/apt/lists/*

WORKDIR /site
COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v 1.16.0 \
    && bundle _1.16.0_ config set without 'development test' \
    && bundle _1.16.0_ install

COPY . .
RUN bundle exec jekyll build --destination /out/_site

##
## Stage 2 — Angular 4 portal bundle (Webpack 3)
##
FROM node:16-buster AS portal
WORKDIR /portal

# Angular app sources
COPY _data-portal/ /portal/

# Install app deps with legacy peer behavior (old Angular)
RUN npm install --unsafe-perm --legacy-peer-deps

# Toolchain + legacy runtime deps pinned to Angular 4 era
RUN npm i --no-save \
    webpack@3.12.0 \
    typescript@2.4.2 \
    ts-loader@2.3.7 \
    angular2-template-loader@0.6.2 \
    raw-loader@0.5.1 \
    rxjs@5.4.3 \
    zone.js@0.8.29 \
    reflect-metadata@0.1.10 \
    core-js@2.4.1

# Force Angular production mode and remove AoT bootstrap if present
RUN <<'BASH'
set -eux
mf=app/main.ts
if [ -f "$mf" ] && ! grep -q "enableProdMode" "$mf"; then
  tmp="$mf.tmp"
  printf "import { enableProdMode } from '@angular/core';\n" > "$tmp"
  printf "enableProdMode();\n" >> "$tmp"
  cat "$mf" >> "$tmp"
  mv "$tmp" "$mf"
fi
if [ -f "$mf" ] && grep -q "app.module.ngfactory" "$mf"; then
  cat > "$mf" <<'TS'
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
TS
fi
BASH

# TS config used by ts-loader (transpile-only to avoid incompatible type defs)
RUN <<'BASH'
set -eux
cat > tsconfig.webpack.json <<'JSON'
{
  "compilerOptions": {
    "target": "es5",
    "module": "es2015",
    "moduleResolution": "node",
    "lib": ["es2015", "dom"],
    "baseUrl": ".",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "types": [],
    "outDir": "build/ts",
    "rootDir": ".",
    "sourceMap": false
  },
  "include": ["app/**/*.ts", "app/*.ts"],
  "exclude": ["**/*.spec.ts", "node_modules"]
}
JSON
BASH

# Webpack 3 configuration (raw-loader for templates/styles)
RUN <<'BASH'
set -eux
cat > webpack.config.js <<'EOF'
const path = require('path');
module.exports = {
  entry: './app/main.ts',
  output: { path: path.resolve(__dirname, 'static'), filename: 'build.js' },
  resolve: { extensions: ['.ts', '.js'] },
  module: {
    rules: [
      { test: /\.ts$/,  use: [{ loader: 'ts-loader', options: { configFile: 'tsconfig.webpack.json', transpileOnly: true } }, 'angular2-template-loader'] },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.css$/,  loader: 'raw-loader' }
    ]
  }
};
EOF
# -p = production optimizations (Uglify, etc.)
node node_modules/webpack/bin/webpack.js -p --config webpack.config.js
# Sanity check: ensure bundle exists
test -s static/build.js
BASH

# Ship local polyfills (avoid CDN flakiness)
RUN set -eux; \
    mkdir -p /portal/vendor; \
    if [ -f node_modules/core-js/client/shim.min.js ]; then \
    cp node_modules/core-js/client/shim.min.js /portal/vendor/core-js.min.js; \
    elif [ -f node_modules/core-js-bundle/minified.js ]; then \
    cp node_modules/core-js-bundle/minified.js /portal/vendor/core-js.min.js; \
    fi; \
    if [ -f node_modules/reflect-metadata/Reflect.min.js ]; then \
    cp node_modules/reflect-metadata/Reflect.min.js /portal/vendor/reflect-metadata.js; \
    else \
    cp node_modules/reflect-metadata/Reflect.js /portal/vendor/reflect-metadata.js; \
    fi; \
    cp node_modules/zone.js/dist/zone.js /portal/vendor/zone.js

##
## Stage 3 — nginx runtime
##
FROM nginx:stable-alpine AS runtime

# API_BASE is consumed by nginx template at container start via envsubst
# PORT controls nginx listen ports in the template
ENV API_BASE=http://host.docker.internal:8000
ENV PORT=80

# Templated nginx (entrypoint will envsubst this into /etc/nginx/conf.d/default.conf)
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template

# Jekyll site + portal bundle & vendor polyfills
COPY --from=jekyll /out/_site/ /usr/share/nginx/html/
RUN mkdir -p /usr/share/nginx/html/data-portal/static /usr/share/nginx/html/data-portal/vendor
COPY --from=portal /portal/static/build.js  /usr/share/nginx/html/data-portal/static/build.js
COPY --from=portal /portal/vendor/          /usr/share/nginx/html/data-portal/vendor/

# Inject local polyfills into data-portal index.html (no-op if file absent)
RUN <<'SH'
set -eux
f=/usr/share/nginx/html/data-portal/index.html
[ -f "$f" ] || exit 0

# Remove CDN polyfills if present
sed -i \
  -e '/ajax\/libs\/core-js\/[^"]*\/shim\.min\.js/d' \
  -e '/ajax\/libs\/zone\.js\/[^"]*\/zone\(\.min\)\?\.js/d' \
  -e '/ajax\/libs\/reflect-metadata\/[^"]*\/Reflect\(\.min\)\?\.js/d' \
  "$f" || true

# Inject our local vendor scripts before static/build.js
snippet=/tmp/vendors.snippet
cat > "$snippet" <<'EOF'
  <script src="/data-portal/vendor/core-js.min.js"></script>
  <script src="/data-portal/vendor/reflect-metadata.js"></script>
  <script src="/data-portal/vendor/zone.js"></script>
EOF
awk 'FNR==NR{buf=buf $0 ORS; next} /static\/build\.js/ && !done { printf "%s", buf; print; done=1; next } { print } END{ if(!done) printf "%s", buf }' \
  "$snippet" "$f" > "$f.tmp" && mv "$f.tmp" "$f"
rm -f "$snippet"
SH

# Optional: strip source map hints from vendored polyfills (tiny files, fewer warnings)
RUN sed -i '/sourceMappingURL/d' /usr/share/nginx/html/data-portal/vendor/*.js || true

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]