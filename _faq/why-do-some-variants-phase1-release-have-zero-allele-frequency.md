---
title: "Why do some variants in the phase1 release have an zero Allele Frequency?"
faq_tags:
  - allele-frequency
  - maf
  - variants
faq_related:
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
  - how-can-i-get-allele-frequency-my-variant
  - what-do-names-your-variant-files-mean-and-what-format-are-files
---
                    
There are a small number of variants which have an Allele Count of 0 and an Allele Frequency of 0.

This is because the original sample list for phase1 had 1094 samples on it. After our integrated genotyping processes 2 samples where discovered to have very discordant genotypes.

* **NA07346**  
* **NA11918**

The decision was made to leave in any variant which only been discovered in one or both of these individuals. The Analysis group is still confident in their sites but not in their genotypes. In doing this we are left with some variant sites where no sample holds the non reference allele.
