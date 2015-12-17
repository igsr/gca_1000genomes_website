---
layout: faq
title: "Are all the genotype calls in the current release VCF files bi-allelic?"
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
                    
The programs used to genotype our early releases including [phase1](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/) are unable to genotype sites with more then two alleles. In most cases the highest frequency alternative allele was chosen and genotyped, depth and base and mapping quality were also used when making this decision

We intend to resolve this problem before the end of the project.
