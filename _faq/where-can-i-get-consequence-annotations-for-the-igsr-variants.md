---
title: "Where can I get consequence annotations for the IGSR variants?"
faq_tags:
  - annotation
  - consequence
  - data-access
  - ensembl
  - variants
faq_related:
  - how-do-i-find-specific-variant-files
  - how-do-i-get-a-genomic-region-sub-section-of-your-files
  - can-i-query-igsr-programmatically
redirect_from:
    - /faq/where-can-i-get-consequence-annotations-1000-genome-variants/
---

The final 1000 Genomes phase 3 analysis calculated consequences based on [GENCODE annotation](http://www.gencodegenes.org/releases/19.html) and this can be found in the directory:
[release/20130502/supporting/functional_annotation/](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/supporting/functional_annotation/)

Ensembl can also provides consequence information for the variants. The variants that are loaded into the Ensembl database and have consequence types assigned and displayed on the [Variation view](http://www.ensembl.org/Homo_sapiens/Variation/Mappings?db=core;r=6:73415665-73416665;v=rs311685;vdb=variation;vf=167346058). Ensembl can also offer consequence predictions using their [Variant Effect Predictor (VEP)](http://www.ensembl.org/info/docs/tools/vep/index.html).

Please note the phase 3 annotations and the Ensembl annotations visible via the browser due to using different versions of gene and non coding annotation.
