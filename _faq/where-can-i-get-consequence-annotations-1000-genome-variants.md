---
title: "Where can I get consequence annotations for the 1000 genome variants?"
faq_tags:
  - annotation
  - consequence
  - data-access
  - ensembl
  - variants
faq_related:
  - where-are-your-variant-files-located
  - how-do-i-get-sub-section-vcf-file
  - are-there-any-scripts-or-apis-use-1000-genomes-data-sets
---
                    
The 1000 genomes phase1 analysis calculated consequences based on [Gencode annotation](http://www.gencodegenes.org/releases/7.html) and this can be found in the directory [phase1/analysis_results/functional_annotation/](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/functional_annotation/)

Ensembl can also provides consequence information for the variants. The variants that are loaded into the Ensembl database and have consequence types assigned and displayed on the [Variation view](http://browser.1000genomes.org/Homo_sapiens/Variation/Mappings?db=core;r=6:74125388-74126388;v=rs311685;vdb=variation;vf=14071116){:_target="_blank"}. Ensembl can also offer consequence predictions using their [Variant effect predictor](http://browser.1000genomes.org/Homo_sapiens/UserData/UploadVariations?db=core){:_target="_blank"}.

Please note the phase1 annotations and the Ensembl annotations visible via the browser due to using different versions of gene and non coding annotation.
