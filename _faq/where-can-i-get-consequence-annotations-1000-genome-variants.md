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
                    
The final 1000 Genomes phase 3 analysis calculated consequences based on [GENCODE annotation](http://www.gencodegenes.org/releases/19.html) and this can be found in the directory:
[release/20130502/supporting/functional_annotation/](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/supporting/functional_annotation/)

Ensembl can also provides consequence information for the variants. The variants that are loaded into the Ensembl database and have consequence types assigned and displayed on the [Variation view](http://browser.1000genomes.org/Homo_sapiens/Variation/Mappings?db=core;r=6:74125388-74126388;v=rs311685;vdb=variation;vf=14071116){:_target="_blank"}. Ensembl can also offer consequence predictions using their [Variant Effect Predictor (VEP)](http://browser.1000genomes.org/Homo_sapiens/UserData/UploadVariations?db=core){:_target="_blank"}.

Please note the phase 3 annotations and the Ensembl annotations visible via the browser due to using different versions of gene and non coding annotation.
