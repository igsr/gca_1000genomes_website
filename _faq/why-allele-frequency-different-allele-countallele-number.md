---
layout: faq
title: "Why is the Allele frequency different from Allele Count/Allele Number?"
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
                    
In some early main project releases the Allele Frequency was estimated using additional information like LD, mapping quality and Haplotype information. This means in these releases the Allele Frequency was not always the same as AC/AN. In the phase1 release AF should always match AC/AN rounded to 2 decimal places.
