---
title: "Why is the allele frequency different from allele count/allele number?"
faq_tags:
  - data-analysis
  - tools
  - variants
  - vcf
faq_related:
  - about-vcf-variant-files
  - how-do-i-find-out-information-about-a-single-variant
  - how-do-you-calculated-ancestral-alleles
redirect_from:
    - /faq/why-allele-frequency-different-allele-countallele-number/
---

In some early main project releases the allele frequency (AF) was estimated using additional information like LD, mapping quality and Haplotype information. This means in these releases the AF was not always the same as allele count/allele number (AC/AN). In the phase 1 release AF should always match AC/AN rounded to 2 decimal places.
