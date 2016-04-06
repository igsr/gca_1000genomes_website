---
title: "Why is the allele frequency different from allele count/allele number?"
faq_tags:
  - data-analysis
  - tools
  - variants
  - vcf
faq_related:
  - are-all-genotype-calls-current-release-vcf-files-bi-allelic
  - how-can-i-get-allele-frequency-my-variant
  - where-does-ancestral-allele-information-your-variants-come
---
                    
In some early main project releases the allele frequency (AF) was estimated using additional information like LD, mapping quality and Haplotype information. This means in these releases the AF was not always the same as allele count/allele number (AC/AN). In the phase 1 release AF should always match AC/AN rounded to 2 decimal places.
