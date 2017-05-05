---
title: "Why are there duplicate calls in the phase 3 call set"
faq_tags:
  - variants
  - vcf
faq_related:
  - where-most-recent-release
  - can-i-get-haplotype-data-1000-genomes-individuals
  - awhat-do-names-your-variant-files-mean-and-what-format-are-files
  - can-i-convert-vcf-files-plinkped-format
---

The [phase3 VCF files](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/) released in June 2014 contain overlapping and duplicate sites.

This is due to an error in our processing pipeline as originally all multi-allelic sites were seperated into individual lines in the VCF file to have genotypes assigned to them but the recombination process did not always succeed leaving us with some overlapping and duplicate sites.

The most expedient solution to this is to skip the duplicate sites from any analysis. If you wish to use one or both of these sites in your own analysis you will need to use the [GRCh37 alignment files](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/20130502.phase3.low_coverage.alignment.index) to recall the genotypes of interest in your individuals of interest to resolve the conflict.

