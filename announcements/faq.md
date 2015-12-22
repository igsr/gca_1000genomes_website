---
layout: single_section
title: "1000 Genomes"
permalink: /announcements/
---

## Announcements
{% for announcement in site.categories.announcements %}
##### {{announcement.date | date: '%A %B %d, %Y' }}

[{{announcement.title}}]({{ announcement.url }})

{{ announcement.content }}
{% endfor %}
  
