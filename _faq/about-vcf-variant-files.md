---
title: "About VCF variant files"
faq_tags:
  - allele
  - bi-allelic
  - data-access
  - genotypes
  - vcf
  - variants
  - tools
faq_related:
  - how-do-i-find-the-most-up-to-date-data
  - how-do-i-get-a-genomic-region-sub-section-of-your-files
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
  - what-are-your-filename-conventions
  - are-my-snps-found-1000-genomes-project
  - can-i-convert-vcf-files-to-plinkped-format
redirect_from:
    - /faq/are-all-genotype-calls-current-release-vcf-files-bi-allelic/
    - /faq/what-strand-are-variants-your-vcf-file/
    - /faq/what-version-vcf-are-your-vcf-files/
---

**Are all the genotype calls in the 1000 Genomes Project current release VCF files bi-allelic?**

No. While bi-allelic calling was used in earlier phases of the 1000 Genomes Project, multi-allelic SNPs, indels, and a diverse set of structural variants (SVs) were called in the final phase 3 call set. More information can be found in the [main phase 3 publication from the 1000 Genomes Project](http://www.nature.com/nature/journal/v526/n7571/full/nature15393.html) and the [structural variation publication](http://www.nature.com/nature/journal/v526/n7571/full/nature15394.html). The supplementary information for both papers provides further detail.

In earlier phases of the 1000 Genomes Project, the programs used for genotyping were unable to genotype sites with more than two alleles. In most cases, the highest frequency alternative allele was chosen and genotyped. Depth of coverage, base quality and mapping quality were also used when making this decision. This was the approach used in phase 1 of the 1000 Genomes Project. As methods were developed during the 1000 Genomes Project, it is recommended to use the final phase 3 data in preference to earlier call sets.

**What strand are the variants in your VCF file on?**

All the variants in both our VCF files and on the browser are always reported on the forward strand.

**What version of VCF are your VCF files in?**

The VCF files on our site cover a wide variety of different versions but our most [recent release VCF files](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/) are in format version [4.1](/wiki/Analysis/Variant%20Call%20Format/vcf-variant-call-format-version-41){:_target="_blank"}
