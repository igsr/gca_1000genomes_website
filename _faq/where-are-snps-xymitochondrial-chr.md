---
title: "Where are the snps for the X/Y/Mitochondrial chr?"
faq_tags:
  - data-access
  - variants
faq_related:
  - how-do-i-get-sub-section-vcf-file
  - what-strand-are-variants-your-vcf-file
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
  - what-do-names-your-variant-files-mean-and-what-format-are-files
---
                    
Chromosome X, Y and MT variants are available for the [phase 1 variant set](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/). The [chrX calls](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/ALL.chrX.integrated_phase1_v3.20101123.snps_indels_svs.genotypes.vcf.gz) were made in the same manner as the autosome variant calls and as such are part of the integrated call set and include snps, indels and large deletions, note the males in this call set are show as haploid for any chrX snp not in the Pseudo Autosomal Region (PAR). The chrY and MT calls where made independently. We have [snps](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/ALL.chrY.phase1_samtools_si.20101123.snps.low_coverage.genotypes.vcf.gz) and [deletions](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/ALL.chrY.genome_strip_hq.20101123.svs.low_coverage.genotypes.vcf.gz) for chrY and [snp](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/ALL.chrMT.phase1_samtools_si.20101123.snps.low_coverage.genotypes.vcf.gz) calls for chrMT. For more details about how these call sets were made please see the [phase1 paper](http://www.1000genomes.org/announcements/integrated-map-genetic-variation-1092-human-genomes-2012-10-31).
