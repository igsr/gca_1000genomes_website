# syntax=docker/dockerfile:1.6
#
# IGSR front-end Dockerfile
# --------------------------------
# This builds the IGSR website and then serves it with nginx:
#   - Jekyll site (Ruby 3.2) -> /usr/share/nginx/html
#   - Angular portal built with Webpack 5 -> /usr/share/nginx/html/data-portal
#   - nginx (stable-alpine) as the final runtime image
#
# Main tool versions (kept stable so the build stays repeatable):
#   Ruby 3.2  | Bundler 2.7.2 | Jekyll (from Gemfile)
#   Node 22   | Angular/Webpack/TypeScript/RxJS/Zone.js from _data-portal/package.json
#   nginx:stable-alpine

##
## Stage 1 — Build the Jekyll site (Ruby 3.2)
##
FROM ruby:3.2 AS jekyll

# Build the site with production settings
ENV JEKYLL_ENV=production

WORKDIR /site
COPY Gemfile Gemfile.lock ./
RUN gem install bundler -v 2.7.2 \
  && bundle _2.7.2_ config set without 'development test' \
  && bundle _2.7.2_ install

COPY . .
RUN bundle exec jekyll build --destination /out/_site

##
## Stage 2 — Angular portal bundle (Webpack 5)
##
FROM node:22-bookworm AS portal
WORKDIR /portal

# Copy the Angular app code into the image
COPY _data-portal/ /portal/
# Copy helper scripts used during the build
COPY docker/scripts/ /portal/docker/scripts/

# Install npm dependencies, allowing the older peer dependency rules this app needs
RUN npm install --unsafe-perm --legacy-peer-deps

# Ensure production mode is enabled and use the runtime bootstrap
RUN bash docker/scripts/fix-main-ts.sh

# Build the portal bundle using the webpack config stored in the repo
RUN set -eux; \
  npx webpack --mode production --config webpack.config.js; \
  test -s static/build.js

# Copy browser support scripts locally so we do not rely on external URLs
RUN set -eux; \
  mkdir -p /portal/vendor; \
  if [ -f node_modules/core-js-bundle/minified.js ]; then \
  cp node_modules/core-js-bundle/minified.js /portal/vendor/core-js.min.js; \
  fi; \
  cp node_modules/leaflet/dist/leaflet.css /portal/vendor/leaflet.css; \
  cp node_modules/leaflet/dist/leaflet.js /portal/vendor/leaflet.js; \
  cp node_modules/leaflet.markercluster/dist/MarkerCluster.css /portal/vendor/MarkerCluster.css; \
  cp node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css /portal/vendor/MarkerCluster.Default.css; \
  cp node_modules/leaflet.markercluster/dist/leaflet.markercluster.js /portal/vendor/leaflet.markercluster.js; \
  cp node_modules/leaflet-makimarkers/Leaflet.MakiMarkers.js /portal/vendor/Leaflet.MakiMarkers.js; \
  cp node_modules/cookieconsent/build/cookieconsent.min.css /portal/vendor/cookieconsent.min.css; \
  cp node_modules/cookieconsent/build/cookieconsent.min.js /portal/vendor/cookieconsent.min.js; \
  mkdir -p /portal/vendor/images; \
  cp node_modules/leaflet/dist/images/* /portal/vendor/images/

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
RUN mkdir -p /usr/share/nginx/html/vendor \
  && cp /usr/share/nginx/html/data-portal/vendor/cookieconsent.min.css /usr/share/nginx/html/vendor/cookieconsent.min.css \
  && cp /usr/share/nginx/html/data-portal/vendor/cookieconsent.min.js /usr/share/nginx/html/vendor/cookieconsent.min.js
RUN rm -f /etc/nginx/conf.d/manual_redirects.server.conf
RUN mkdir -p /etc/nginx/snippets
COPY docker/manual_redirects.server.conf /etc/nginx/snippets/manual_redirects.inc

RUN sed -i '/sourceMappingURL/d' /usr/share/nginx/html/data-portal/vendor/*.js || true

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
