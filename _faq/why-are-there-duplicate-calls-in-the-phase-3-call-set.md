---
title: "Why are there duplicate calls in the phase 3 call set?"
faq_tags:
  - variants
  - vcf
faq_related:
  - how-do-i-find-the-most-up-to-date-data
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
  - what-are-your-filename-conventions
  - can-i-convert-vcf-files-to-plinkped-format
redirect_from:
    - /faq/why-are-there-duplicate-calls-in-the-phase3-call-set/
---

The [phase 3 VCF files](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/) released in June 2014 contain overlapping and duplicate sites.

This is due to an error in the processing pipeline used when sets of variant calls were combined. Originally, all multi-allelic sites were seperated into individual lines in the VCF file during the pipeline but the recombination process did not always succeed, leaving us with a small number of sites with overlapping or duplicate call records. This is most commonly seen in chromosome X.

The simplest solution to this is to ignore duplicate sites in any analysis. If you wish to use one or both of a pair of duplicate sites in your own analysis, you should use the [GRCh37 alignment files](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/20130502.phase3.low_coverage.alignment.index) to recall the genotypes of interest in the individuals you are interested in to resolve the conflict.
