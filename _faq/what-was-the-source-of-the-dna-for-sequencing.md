---
title: "What was the source of the DNA for sequencing?"
faq_tags:
  - cell-lines
  - data-access
faq_related:
  - what-sequencing-platforms-and-methods-were-used-by-different-projects-within-igsr
  - can-i-get-cell-lines-for-igsr-samples
redirect_from:
    - /faq/what-was-source-dna-sequencing/
---

The early samples were taken from the HapMap project and these all sourced their dna from cell line cultures. Some of the more recent libraries have been produced from blood.

Our [sample spreadsheet](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/working/20130606_sample_info/) has annotation about the [EBV coverage](http://en.wikipedia.org/wiki/Epstein%E2%80%93Barr_virus#Transformation_of_B-lymphocytes) and the annotated sample source of the sequencing data in columns 59 and 60 of the [20130606_sample_info.txt](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/working/20130606_sample_info/20130606_sample_info.txt)

This spreadsheet gives the aligned coverage of EBV and then the annotation if [Coriell](http://ccr.coriell.org/) stated the sample was sources from blood. Please note some samples were sequenced both using sample from blood and LCL transformed cells but this data was not analysed independently so the EBV coverage will be high. Also some samples with very low EBV coverage (ie ~1x) may be from blood but just indicate an endogenous infection of EBV in the individual sampled.
