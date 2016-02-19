# Directory strucutre of this repo

## non-underscored directories

Directories that do *not* start with underscore (_) are for url paths.  For example, a file called vcf4.0.md in the directory /wiki/Analysis/ will be served as the url www.1000genomes.org/wiki/Analysis/vcf4.0

## _elasticsearch_settings

We have an elasticsearch server at EBI which we use for the search feature in the 1000genomes website.  This directory contains some files that we use to configure elasticsearch.

## _faq

Any file in this directory will be served in the website FAQ section.  The yaml front matter should contain:

1. title - the title gets displayed at the top of the FAQ page and in the list of FAQ questions at www.1000genomes.org/faq
2. faq_related - an array of other files from the _faq directory (without extension)
3. faq_tags - an array of files in the _faq_categories directory (without extension)

## _faq_categories

Any file in this directory becomes a category for grouping together related faq pages.  The yaml front matter should contain one thing only:

1. title - the title of the category gets displayed at the top of the faq pages belonging to that category

## _includes

This contains any little fragment of html (or markdown) that you can include from anywhere in any page e.g. {% include google_analytics.html %}

##_layouts

Files in this directory define the layouts available for any page you create.

* single_section: **You probably want to use this layout.** It gives you the basic layout of a page on the 1000genomes website with a single white sheet on which to put content
* multi_section: This gives you a basic layout but you have the option to add multiple white sheets separated vertically by grey space. Insert a white sheet section like this: {% capture my_content %}<p> blah blah blah </p>{% endcapture %}{% include section.html content=my_content %}

## _media

Any file in this directory gets listed on www.100genomes.org/media. Files should be named starting with the date e.g. 2016-02-19-beano.html. The yaml front matter should contain:

1. link_url - link to the external website displaying the article
2. publication - name of the newspaper / website displaying the article
3. date - format yyyy-mm-dd
4. title - title of the article

## _mojo_templates

At EBI we serve the static pages from a mojolicious webserver.  This directory contains some template files which mean something to mojolicious.

## _plugins

[Jekyll has a plugin system with hooks that allow you to create custom generated content specific to your site.](http://jekyllrb.com/docs/plugins/). Note that because we use plugins our site will never work on github pages. Nevermind.

#### stub_name_generator.rb

This plugin does several things which were helpful in the faq pages and faq list pages for creating links to other faq.

1. Every faq and faq_category is automatically given an attribute 'stub_name' which is the faq/faq_category filename stripped of the extension
2. The site variable site.faq_map is a hash.  Key is the stub_name of each faq.  Value is the faq page itself.
3. The site variable site.faq_category_map is a hash. Key is the stub_name of each faq_category.  Value is the faq_category itself.

## _press_release

Any file in this directory gets listed on www.100genomes.org/media. Files should be named starting with the date e.g. 2016-02-19-i-love-igsr.html. The yaml front matter should contain:

1. link_url - link to the press release
3. date - format yyyy-mm-dd
4. title - title of the press release


# Other files that mean something

## Gemfile and Gemfile.lock

These are here so that jekyll can build the site properly.  Gemfile contains a list of 3rd-party plugins we are using

## _config.yml

Standard jekyll configuration explained [on the jekyll website](http://jekyllrb.com/docs/configuration/)

## _mojo_redirects

At EBI we serve the static pages from a mojolicious webserver. This file contains a list of urls that should give a 302 redirect. We have configured the webserver to read this file.

## sitemap.xml

This file is important for google site indexing

## robots.txt

This file is important for google site indexing.  It tells google where to look for the sitemap.xml

## search_index.json

This json file gets populated with the content of all pages.  This all gets loaded into EBI's elasticsearch server and is used when you search the website from the search box.

## _README.md

You're reading it.
