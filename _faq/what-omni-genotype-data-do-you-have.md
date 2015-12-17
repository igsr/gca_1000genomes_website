---
layout: faq
title: "What Omni genotype data do you have?"
faq_tags:
  - data-access
  - high-density-genotyping
  - omni
faq_related:
  - what-axiom-genotype-data-do-you-have
  - what-high-density-genotyping-information-do-you-have
  - where-most-recent-release
---
                    
Both Illumina and the Broad institute have carried on genotyping of 1000 genomes and Hapmap samples on the [Omni Platform](http://www.illumina.com/dna/omni/index.asp?utm_medium=banners&utm_campaign=omni). The most recent set of omni genotypes can be found in two places [technical/working/20131122_broad_omni](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/working/20131122_broad_omni/) and [technical/working/20130812_sanger_omni/](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/working/20130812_sanger_omni/) These contain GRCh37 based vcf files for the chip and normalised and raw intensity files.

We also used omni data as part of our phase1 analysis. The set used for this can be found in [phase1/analysis_results/supporting/omni_haplotypes/](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/supporting/omni_haplotypes/). These are vcf files mapped to GRCh37\. There is a single file which contains all the genotypes on the chip and then fully phased vcf files per chromosome. The haplotype estimation was carried out using the [ShapeIt2](http://www.shapeit.fr/) algorithm.
