# syntax=docker/dockerfile:1.6
#
# IGSR front-end Dockerfile
# --------------------------------
# This builds the IGSR website and then serves it with nginx:
#   - Jekyll site (Ruby 2.2 / Debian Jessie) -> /usr/share/nginx/html
#   - Angular 4 portal built with Webpack 3 -> /usr/share/nginx/html/data-portal
#   - nginx (stable-alpine) as the final runtime image
#
# Main tool versions (kept stable so the build stays repeatable):
#   Ruby 2.2  | Bundler 1.16.0 | Jekyll (from Gemfile)
#   Node 16   | Webpack 3.12.0 | TypeScript 2.4.2 | RxJS 5.4.3 | Zone.js 0.8.29
#   nginx:stable-alpine

##
## Stage 1 — Build the Jekyll site (Ruby 2.2 / Debian Jessie)
##
FROM ruby:2.2 AS jekyll

# Build the site with production settings
ENV JEKYLL_ENV=production

# Jessie is end-of-life, so use the Debian archive to fetch packages
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

# Copy the Angular app code into the image
COPY _data-portal/ /portal/

# Install npm dependencies, allowing the older peer dependency rules this app needs
RUN npm install --unsafe-perm --legacy-peer-deps

# Install the build tools and runtime libraries at the older versions this app expects
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

# Ensure production mode is enabled and use the runtime bootstrap if needed
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

# Create a webpack config to build the portal
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
node node_modules/webpack/bin/webpack.js -p --config webpack.config.js

# Fail the build if the output file is missing
test -s static/build.js
BASH

# Copy browser support scripts locally so we do not rely on external URLs
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
## Stage 3 — Final runtime image (nginx)
##
FROM nginx:stable-alpine AS runtime

# These values are filled into the nginx config when the container starts
# API_BASE is the upstream API URL; PORT controls the nginx listen port
ENV API_BASE=http://host.docker.internal:8000
ENV PORT=80

# Copy the nginx config template; it is filled in at container start
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template

# Bring in the built site files from earlier stages
COPY --from=jekyll /out/_site/ /usr/share/nginx/html/
RUN mkdir -p /usr/share/nginx/html/data-portal/static /usr/share/nginx/html/data-portal/vendor
COPY --from=portal /portal/static/build.js  /usr/share/nginx/html/data-portal/static/build.js
COPY --from=portal /portal/vendor/          /usr/share/nginx/html/data-portal/vendor/
RUN rm -f /etc/nginx/conf.d/manual_redirects.server.conf
RUN mkdir -p /etc/nginx/snippets
COPY docker/manual_redirects.server.conf /etc/nginx/snippets/manual_redirects.inc

# Add local browser support scripts to data-portal index.html
RUN <<'SH'
set -eux
f=/usr/share/nginx/html/data-portal/index.html
[ -f "$f" ] || exit 0

# Remove any external script tags for these files
sed -i \
  -e '/ajax\/libs\/core-js\/[^"]*\/shim\.min\.js/d' \
  -e '/ajax\/libs\/zone\.js\/[^"]*\/zone\(\.min\)\?\.js/d' \
  -e '/ajax\/libs\/reflect-metadata\/[^"]*\/Reflect\(\.min\)\?\.js/d' \
  "$f" || true

# Insert the local script tags before build.js
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

RUN sed -i '/sourceMappingURL/d' /usr/share/nginx/html/data-portal/vendor/*.js || true

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
