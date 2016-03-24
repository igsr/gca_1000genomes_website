---
title: "Are all the genotype calls in the 1000 Genomes Project current release VCF files bi-allelic?"
faq_tags:
  - allele
  - bi-allelic
  - data-access
  - genotypes
  - vcf
faq_related:
  - where-most-recent-release
  - how-do-i-get-sub-section-vcf-file
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
---
                    
No. While bi-allelic calling was used in earlier phases of the 1000 Genomes Project, multi-allelic SNPs, indels, and a diverse set of structural variants (SVs) were called in the final phase 3 call set. More information can be found in the [main phase 3 publication from the 1000 Genomes Project](http://www.nature.com/nature/journal/v526/n7571/full/nature15393.html) and the [structural variation publication](http://www.nature.com/nature/journal/v526/n7571/full/nature15394.html). The supplementary information for both papers provides further detail.

In earlier phases of the 1000 Genomes Project, the programs used for genotyping were unable to genotype sites with more than two alleles. In most cases, the highest frequency alternative allele was chosen and genotyped. Depth of coverage, base quality and mapping quality were also used when making this decision. This was the approach used in phase 1 of the 1000 Genomes Project. As methods were developed during the 1000 Genomes Project, it is recommended to use the final phase 3 data in preference to earlier call sets.


