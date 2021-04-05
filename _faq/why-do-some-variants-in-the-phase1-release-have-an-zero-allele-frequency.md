---
title: "Why do some variants in the phase1 release have a zero Allele Frequency?"
faq_tags:
  - allele-frequency
  - maf
  - variants
faq_related:
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
  - how-do-i-find-out-information-about-a-single-variant
  - what-are-your-filename-conventions
redirect_from:
    - /faq/why-do-some-variants-phase1-release-have-zero-allele-frequency/
---

There are a small number of variants which have an Allele Count of 0 and an Allele Frequency of 0.

This is because the original sample list for phase1 had 1094 samples on it. After our integrated genotyping processes 2 samples where discovered to have very discordant genotypes.

* **NA07346**  
* **NA11918**

The decision was made to leave in any variant which only been discovered in one or both of these individuals. The Analysis group is still confident in their sites but not in their genotypes. In doing this we are left with some variant sites where no sample holds the non reference allele.
