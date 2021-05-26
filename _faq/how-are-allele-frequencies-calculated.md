---
title: "How are allele frequencies calculated?"
faq_tags:
  - allele-frequency
  - data-access
  - phase-1
  - vcf
  - data-analysis
  - dosage
  - genotypes
faq_related:
  - how-do-i-find-out-information-about-a-single-variant
  - why-do-some-variants-in-the-phase1-release-have-an-zero-allele-frequency
  - how-do-i-get-a-genomic-region-sub-section-of-your-files
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
redirect_from:
    - /faq/what-does-genotype-dosage-mean-phase1-integrated-call-set/
    - /faq/what-does-ldaf-value-mean-your-phase1-vcf-files/
    - /faq/what-does-genotype-dosage-mean-phase1-integrated-call-set-0/
---


Our standard AF values are allele frequencies rounded to two decimal places calculated using allele count (AC) and allele number (AN) values.

LDAF is an allele frequency value in the info column of our phase 1 VCF files. LDAF is the allele frequency as inferred from the haplotype estimation. You will note that LDAF does sometimes differ from the AF calculated on the basis of allele count and allele number. This generally means there are many uncertain genotypes for this site. This is particularly true close to the ends of the chromosomes.

## Genotype Dosage

The phase 1 data set also contains Genotype Dosage values. This comes from [Mach/Thunder](http://genome.sph.umich.edu/wiki/UMAKE), imputation engine used for genotype refinement in the [phase 1 data set](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/). 

The Dosage represents the predicted dosage of the non reference allele given the data available, it will always have a value between 0 and 2.

The formula is **Dosage = Pr(Het\|Data) + 2*Pr(Alt\|Data)**

The dosage value gives an indication of how well the genotype is supported by the imputation engine. The genotype likelihood gives an indication of how well the genotype is supported by the sequence data.
