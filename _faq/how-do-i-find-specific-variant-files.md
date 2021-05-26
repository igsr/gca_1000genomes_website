---
title: "How do I find specific variant files?"
faq_tags:
  - data-access
  - variants
  - dgva
faq_related:
  - how-do-i-get-a-genomic-region-sub-section-of-your-files
  - about-vcf-variant-files
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
  - what-are-your-filename-conventions
  - how-do-i-find-specific-alignment-files
  - how-do-i-find-the-reference-genomes-files
  - how-do-i-find-the-most-up-to-date-data
  - are-pilot-project-snps-dbsnp
  - are-the-igsr-variants-available-in-dbsnp 
redirect_from:
    - /faq/where-are-snps-xymitochondrial-chr/
    - /faq/where-are-pilot-structural-variants-archived/
    - /faq/where-are-your-variant-files-located/
---

The easiest way to find the variant files you're looking for is with the [Data Portal](https://www.internationalgenome.org/data-portal/sample). You can search for individuals, populations and data collections, and filter the files by data type and technologies. This will give you locations of the files, which you can use to download directly, or to export a list to use with a download manager.

The VCFs are by chromosome, and contain genotypes for all the individuals in the dataset.
Chromosome X, Y and MT variants are available for the [phase 3 variant set](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/). The [chrX calls](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chrX.phase3_shapeit2_mvncall_integrated_v1c.20130502.genotypes.vcf.gz) were made in the same manner as the autosome variant calls and as such are part of the integrated call set and include SNPs, indels and large deletions, note the males in this call set are show as haploid for any chrX SNP not in the Pseudo Autosomal Region (PAR). The chrY and MT calls were made independently. Both call sets are presented in an integrated file in the phase 3 FTP directory, [chrY](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chrY.phase3_integrated_v2b.20130502.genotypes.vcf.gz) and [chrMT](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chrMT.phase3_callmom-v0_4.20130502.genotypes.vcf.gz). ChrY has snps, indels and large deletions. ChrMT only has snps and indels.  For more details about how these call sets were made please see the [phase 3 paper](http://www.nature.com/nature/journal/v526/n7571/full/nature15393.html).
