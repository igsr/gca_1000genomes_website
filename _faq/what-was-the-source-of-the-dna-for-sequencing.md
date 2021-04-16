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

For the 1000 Genomes Project, the early samples were taken from the HapMap project and these all sourced their DNA from cell line cultures but some libraries were produced from blood.

The [sample spreadsheet](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/working/20130606_sample_info/) for the 1000 Genomes Project has annotation about the [EBV coverage](http://en.wikipedia.org/wiki/Epstein%E2%80%93Barr_virus#Transformation_of_B-lymphocytes) and the annotated sample source of the sequencing data in columns 59 and 60 of the [20130606_sample_info.txt](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/working/20130606_sample_info/20130606_sample_info.txt)

This spreadsheet gives the aligned coverage of EBV and then the annotation if [Coriell](http://ccr.coriell.org/) stated the sample was sourced from blood. Please note some samples were sequenced both using sample from blood and LCL transformed cells but this data was not analysed independently so the EBV coverage will be high. Also some samples with very low EBV coverage (ie ~1x) may be from blood but just indicate an endogenous infection of EBV in the individual sampled.

For studies other than the 1000 Genomes Project, commonly the DNA is derived from cell lines as the original blood samples are limited. Further details, however, can be found by consulting the [publications](/data-portal/data-collection).
