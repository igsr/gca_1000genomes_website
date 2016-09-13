---
title: "Where are the SNPs for the X/Y/Mitochondrial chr?"
faq_tags:
  - data-access
  - variants
faq_related:
  - how-do-i-get-sub-section-vcf-file
  - what-strand-are-variants-your-vcf-file
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
  - what-do-names-your-variant-files-mean-and-what-format-are-files
---
                    
Chromosome X, Y and MT variants are available for the [phase 3 variant set](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/). The [chrX calls](
http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chrX.phase3_shapeit2_mvncall_integrated_v1b.20130502.genotypes.vcf.gz) were made in the same manner as the autosome variant calls and as such are part of the integrated call set and include SNPs, indels and large deletions, note the males in this call set are show as haploid for any chrX SNP not in the Pseudo Autosomal Region (PAR). The chrY and MT calls were made independently. Both call sets are presented in an integrated file in the phase3 FTP directory, [chrY](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chrY.phase3_integrated_v2a.20130502.genotypes.vcf.gz) and chrMT(http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chrMT.phase3_callmom-v0_4.20130502.genotypes.vcf.gz). ChrY has snps, indels and large deletions. ChrMT only has snps and indels.  For more details about how these call sets were made please see the [phase 3 paper](http://www.nature.com/nature/journal/v526/n7571/full/nature15393.html).
