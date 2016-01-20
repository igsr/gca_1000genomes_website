---
layout: single_section
title: "Announcements"
permalink: /announcements/
redirect_from:
    - /announcements/faq/
exclude_from_search: true
---
  
## Announcements
{% for announcement in site.categories.announcements %}
##### {{announcement.date | date: '%A %B %d, %Y' }}

[{{announcement.title}}]({{ announcement.url }})

{{ announcement.content }}
{% endfor %}
  
