---
layout: single_section
title: "Announcements"
permalink: /announcements/
redirect_from:
    - /announcements/faq/
---
  
## Announcements
{% for announcement in site.categories.announcements %}
##### {{announcement.date | date: '%A %B %d, %Y' }}

[{{announcement.title}}]({{ announcement.url }})

{{ announcement.content }}
{% endfor %}
  
