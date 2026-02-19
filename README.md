# How to add pages to the IGSR website

This repo contains the static content for the IGSR website hosted at https://www.internationalgenome.org/

## Current architecture

- Static site content is built with Jekyll and served by nginx from a Docker container on Google Cloud Run.
- The frontend proxies `/api/*` requests to the `igsr-be` API.
- The `igsr-be` service provides API endpoints and search functionality.
- Search is enabled by ElasticCloud v8.

## How to add new general pages

To add a new general page to the website, create a file ending in with the extension .md in the top level directory.
The file name does not influence the link or page name but should reflect the contents of the page.
At the top of any new file you need to add the following header:

---

layout: NAME OF SECTION LAYOUT (normally single_section)  
title: "TITLE FOR PAGE"  
permalink: URL FOR PAGE

---

The URL needs to be close in form to the page title e.g a page titled The 1000 Genomes Phase 3 publication might want a url /1000_genomes_phase3_publication/

The contents of the page are then written in markdown format. Please see [https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for more details

## How to add new FAQs

An FAQ should be created in the \_faq directory. The filename needs to end with the extension .md. The filename is used as the URL for FAQs. Like normal pages the file needs a header. For an FAQ the header looks like

---

title: "TITLE FOR PAGE"  
faq_tags:

- descriptive tag used to group pages (see [https://github.com/igsr/gca_1000genomes_website/tree/master/\_faq_categories](https://github.com/igsr/gca_1000genomes_website/tree/master/_faq_categories) for full list of current categories
  faq_related:  
  -Name (-.md) of any related FAQ e.g there_corrupt_file-your-ftp-site

---

Please look at [https://www.internationalgenome.org/faq/can-i-find-genomic-position-list-dbsnp-rs-numbers-0/](https://www.internationalgenome.org/faq/can-i-find-genomic-position-list-dbsnp-rs-numbers-0/) and [https://github.com/igsr/gca_1000genomes_website/blob/master/\_faq/can-i-find-genomic-position-list-dbsnp-rs-numbers-0.md](https://github.com/igsr/gca_1000genomes_website/blob/master/_faq/can-i-find-genomic-position-list-dbsnp-rs-numbers-0.md) for a good exemplar FAQ

## How to add new Announcements

New announcements must be posted in the announcements/\_posts directory  
The file name should follow the convention YYYY-MM-DD-name.md. The URL will be the name without the date in it e.g the file [2016-04-26-1000genomes-chry-publication.md](https://github.com/igsr/gca_1000genomes_website/blob/master/announcements/_posts/2016-04-26-1000genomes-chry-publication.md) has the link [https://www.internationalgenome.org/announcements/1000genomes-chry-publication/](https://www.internationalgenome.org/announcements/1000genomes-chry-publication/)

The announcement file also needs a header

---

title: "ANNOUNCEMENT TITLE"  
pinned: [true|false] - this indicates if the page is pinned to the front page. If you want to pin a new announcement you must unpin an old one

---

## Directory structure of this repo

### non-underscored directories

Directories that do _not_ start with underscore (\_) are for url paths. For example, a file called vcf4.0.md in the directory /wiki/Analysis/ will be served as the url www.internationalgenome.org/wiki/Analysis/vcf4.0

### \_faq

Any file in this directory will be served in the website FAQ section. The yaml front matter should contain:

1. title - the title gets displayed at the top of the FAQ page and in the list of FAQ questions at www.internationalgenome.org/faq
2. faq_related - an array of other files from the \_faq directory (without extension)
3. faq_tags - an array of files in the \_faq_categories directory (without extension)

### \_faq_categories

Any file in this directory becomes a category for grouping together related faq pages. The yaml front matter should contain one thing only:

1. title - the title of the category gets displayed at the top of the faq pages belonging to that category

### \_includes

This contains any little fragment of html (or markdown) that you can include from anywhere in any page e.g. {% include google_analytics.html %}

An important one is \_includes/homepage.html. This is included from both index.html and from home.html. We do this so that these two urls show identical content: https://www.internationalgenome.org/ and https://www.internationalgenome.org/home.

### \_layouts

Files in this directory define the layouts available for any page you create.

- single_section: **You probably want to use this layout.** It gives you the basic layout of a page on the 1000genomes website with a single white sheet on which to put content
- multi_section: This gives you a basic layout but you have the option to add multiple white sheets separated vertically by grey space. Insert a white sheet section like this: {% capture my_content %}<p> blah blah blah </p>{% endcapture %}{% include section.html content=my_content %}

### \_media

Any file in this directory gets listed on www.internationalgenome.org/media. Files should be named starting with the date e.g. 2016-02-19-beano.html. The yaml front matter should contain:

1. link_url - link to the external website displaying the article
2. publication - name of the newspaper / website displaying the article
3. date - format yyyy-mm-dd
4. title - title of the article

### \_mojo_templates

This directory contains legacy template artifacts used in the previous Mojolicious-based deployment.

### \_plugins

[Jekyll has a plugin system with hooks that allow you to create custom generated content specific to your site.](http://jekyllrb.com/docs/plugins/). Note that because we use plugins our site will never work on github pages. Nevermind.

##### stub_name_generator.rb

This plugin does several things which were helpful in the faq pages and faq list pages for creating links to other faq.

1. Every faq and faq_category is automatically given an attribute 'stub_name' which is the faq/faq_category filename stripped of the extension
2. The site variable site.faq_map is a hash. Key is the stub_name of each faq. Value is the faq page itself.
3. The site variable site.faq_category_map is a hash. Key is the stub_name of each faq_category. Value is the faq_category itself.

### \_press_release

Any file in this directory gets listed on www.internationalgenome.org/media. Files should be named starting with the date e.g. 2016-02-19-i-love-igsr.html. The yaml front matter should contain:

1. link_url - link to the press release
2. date - format yyyy-mm-dd
3. title - title of the press release

## Other important files

### Gemfile and Gemfile.lock

These are here so that jekyll can build the site properly. Gemfile contains a list of 3rd-party plugins we are using.

### \_config.yml

Standard jekyll configuration explained [on the jekyll website](http://jekyllrb.com/docs/configuration/).

### \_mojo_redirects

Historically this Jekyll-generated file was used to list redirect mappings. In the current dockerised deployment (Google Cloud Run), redirects are handled by nginx using `docker/manual_redirects.server.conf` (301 redirects), not by reading this file directly.

### sitemap.xml

This sitemap is generated during the Jekyll build and served as a static file by nginx; search engines use it for indexing.

### robots.txt

This static file is served by nginx and points crawlers to `sitemap.xml`.

### search_index.json

This Jekyll-generated JSON contains page content metadata. In the new architecture, website search is served via the `igsr-be` API backed by Elastic Cloud, rather than being loaded into an EBI-hosted Elasticsearch service from this file.

## Container build and runtime files

### Dockerfile

`Dockerfile` is a multi-stage build:

1. `jekyll` stage builds the static site into `/out/_site`.
2. `portal` stage builds the Angular data portal bundle and local vendor scripts.
3. `runtime` stage serves everything from nginx (`nginx:stable-alpine`).

In runtime, nginx serves static content and proxies `/api/*` to the upstream API using `API_BASE`. The listen port is controlled by `PORT`.

### docker/

The `docker/` directory contains container runtime configuration and helper assets:

1. `docker/nginx.conf.template` - nginx server template (static serving, `/api` proxying, cache headers, legacy endpoint blocks).
2. `docker/manual_redirects.server.conf` - manual 301 redirect rules included by nginx at runtime.
3. `docker/scripts/fix-main-ts.sh` - required by the Dockerfile, adjusts legacy Angular bootstrap code for production build behavior.
4. `docker/scripts/inject-polyfill-snippet.sh` - required by the Dockerfile, injects local polyfill script tags into the data portal HTML.

## Run a local development instance of the website

### Prerequisites

- macOS with colima installed
- docker CLI installed (with buildx support)
- python3 available (for local indexing)
- network access to the MySQL host in config.ini (e.g., mysql-igsr-web)
- local clones of gca_1000genomes_website, igsr-be, and es/es-py
- open ports: 9200 (ES), 8000 (API), 8080 (FE)
- enough disk/RAM for two Colima VMs (defaults: 12GB ARM64, 8GB AMD64)

### Launch command

```bash
cd gca_1000genomes_website
./scripts/local_igsr_site_instance_up.sh \
    --fe-repo "/path/to/gca_1000genomes_website" \
    --be-repo "/path/to/igsr-be" \
    --es-py-repo "/path/to/es-py" \
    --es-config "/path/to/config.ini" \
    --api-config "/path/to/.env"
```
