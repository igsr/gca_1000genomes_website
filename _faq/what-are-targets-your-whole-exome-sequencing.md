---
layout: faq
title: "What are the targets for your whole exome sequencing?"
faq_tags:
  - data-access
  - exome
  - targets
faq_related:
  - what-difference-between-analysis-groups-exome-and-exon-targetted-sequence-index
  - what-capture-technology-does-exome-sequencing-used
  - how-do-i-get-sub-section-vcf-file
---
                    
The Exome sequencing the 1000genomes project has undertaken is targetting the entirety of the CCDS gene set.

The targets used for the phase1 data release of 1092 samples can be found in  [technical/reference/exome_pull_down_targets_phases1_and_2](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/exome_pull_down_targets_phases1_and_2/){:target="_blank"}; the targets for phase3 analysis can be found in [technical/reference/exome_pull_down_targets/](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/exome_pull_down_targets/){:target="_blank"}.

The phase1 and 2 targets are intersections of the different technologies used and the CCDS gene list. For phase3 we are using a union of two different pull down lists NimbleGen EZ_exome v1 and Agilent sure select v2

In phase3 very little exome specific calling is taking place. Now when analysis groups are calling variants they tend to use the low coverage and exome data together in an integrated manner.
