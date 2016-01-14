---
layout: single_section
title: "FAQ"
permalink: /faq/
include_in_sitemap: true
---

## {{page.title}}

This is the FAQ from the 1000 Genomes Project. This list of questions is not exhaustive. If you have any other questions you can't find the answer to please email [info@1000genomes.org](mailto:info@1000genomes.org) to ask.

{% assign sorted_faq = (site.faq | sort: 'title') %}
{% for faq in sorted_faq %}
* [{{ faq.title }}]({{ faq.url }}){% endfor %}
