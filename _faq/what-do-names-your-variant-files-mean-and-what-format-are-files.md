---
title: "What do the names of your variant files mean and what format are the files?"
faq_tags:
  - data-access
  - file-format
  - vcf
faq_related:
  - what-format-are-your-alignments-and-what-do-names-mean
  - where-are-your-sequence-files-located
  - how-do-i-get-sub-section-vcf-file
  - are-my-snps-found-1000-genomes-project
---
                    
Our variant files are distributed in [vcf format](http://vcftools.sourceforge.net/), a format initially designed which has seen wider community adoption.

The majority of our vcf files are named in the form:

**ALL.chrN|wgs|wex.2of4intersection.20100804.snps|indels|sv.genotypes.analysis_group.vcf.gz**.

This name starts with the population that the variants were discovered in, if ALL is specifed it means all the individuals available at that date were used. Then the region covered by the call set, this can be a chromosome, wgs (which means the file contains at least all the autosomes) or wex (this represents the whole exome) and a description of how the call set was produced or who produced it, the date matches the  sequence and alignment freezes used to generate the variant call set. Next a field which describes what type of variant the file contains, then the analysis group used to generate the variant calls, this should be low coverage, exome or integrated and finally we have either sites or genotypes. A sites file just contains the first 8 columns of the vcf format and the genotypes files contain individual genotype data aswell.

Release directories should also contain panel files which also describe what individuals the variants have genotypes for and what populations those individuals are from
