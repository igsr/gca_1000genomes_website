---
title: "Why do some of your vcf genotype files have genotypes of ./. in them?"
faq_tags:
  - data-access
  - variants
  - vcf
faq_related:
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
  - can-i-get-individual-genotype-information-browser1000genomesorg
  - about-vcf-variant-files
redirect_from:
    - /faq/why-do-some-your-vcf-genotype-files-have-genotypes-them/
---

Our [August 2010 call set](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20100804) represents a  merge of various different independent call sets. Not all the call sets in the merge had genotypes associated with them, as this merge was carried out using a predefined rules which has led to individuals or whole variant sites having no genotype and this is described as ./. in vcf 4.0\. In our [November 2010 call set](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20101123/interim_phase1_release/) and all subsequent call sets all sites have genotypes for all individuals for chr1-22 and X.
