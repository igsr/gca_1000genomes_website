---
title: "What does the LDAF value mean in your phase1 VCF files?"
faq_tags:
  - allele-frequency
  - data-access
  - phase-1
  - vcf
faq_related:
  - how-can-i-get-allele-frequency-my-variant
  - why-do-some-variants-phase1-release-have-zero-allele-frequency
  - how-do-i-get-sub-section-vcf-file
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
---
                    
LDAF is an allele frequency value in the info column of our phase1 VCF files.

Our standard AF values are allele frequencies rounded to 2 decimal places calculated using allele count (AC) and allele number (AN) values. LDAF is the allele frequency as inferred from the haplotype estimation.

You will note that LDAF does sometimes differ from the AF calculated on the basis of allele count and allele number. This generally means there are many uncertain genotypes for this site. This is particularly true close to the ends of the chromosomes.
