---
title: "How was exome and exon targetted sequencing used?"
faq_tags:
  - capture
  - data-access
  - exome
  - pull-down
  - pilot-study
  - targets
faq_related:
  - how-do-i-find-specific-variant-files
  - how-do-i-find-specific-alignment-files
  - how-do-i-get-a-genomic-region-sub-section-of-your-files
redirect_from:
    - /faq/what-are-targets-your-exon-targetted-pilot-study/
    - /faq/what-are-targets-your-whole-exome-sequencing/
    - /faq/what-capture-technology-does-exome-sequencing-used/
    - /faq/what-difference-between-analysis-groups-exome-and-exon-targetted-sequence-index/
---

The 1000 Genomes Project has run two different pull-down experiments. These are labelled as "exon targetted" and "exome".

An exon targetted run is part of the pilot study which targetted 1000 genes in nearly 700 individuals. The targets for this pilot can be found in the [pilot_data/technical/reference](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/technical/reference/) directory.

An exome run is part of the whole exome sequencing project which targetted the entirety of the CCDS gene set. The targets used for the phase 1 data release of 1092 samples can be found in  [technical/reference/exome_pull_down_targets_phases1_and_2](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/exome_pull_down_targets_phases1_and_2/); the targets for phase3 analysis can be found in [technical/reference/exome_pull_down_targets/](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/exome_pull_down_targets/).

The phase 1 and 2 targets are intersections of the different technologies used and the CCDS gene list. For phase 3 we used using a union of two different pull-down lists: NimbleGen EZ_exome v1 and Agilent sure select v2. In phase 3 very little exome specific calling took place. Instead analysis groups called variants tending to use the low coverage and exome data together in an integrated manner.

## Capture technology

Different centres have used different pull-down technologies for the Exome sequencing done for the 1000 Genomes project.

Baylor College of Medicine used [NimbleGen SeqCap_EZ_Exome_v2](http://www.nimblegen.com/products/seqcap/ez/v2/index.html) for its Solid based exome sequencing. For its more recent Illumina based exome sequencing it used a custom array [HSGC VCRome](http://www.nimblegen.com/products/seqcap/ez/designs/)

The Broad Institute has used Agilent SureSelect_All_Exon_V2 ([https://earray.chem.agilent.com/earray/](https://earray.chem.agilent.com/earray/) using ELID: S0293689).

The BGI used <span>NimbleGen SeqCap EZ exome V1</span> for the phase 1 samples and [NimbleGen SeqCap_EZ_Exome_v2](http://www.nimblegen.com/products/seqcap/ez/v2/index.html) for phase 2 and 3 (the v1 files were obtained from BGI directly; they are discontinued from Nimblegen).

The Washington University Genome Center used Agilent SureSelect_All_Exon_V2 ([https://earray.chem.agilent.com/earray/](https://earray.chem.agilent.com/earray/) using ELID: S0293689) for phase 1 and phase 2, and [NimbleGen SeqCap_EZ_Exome v3](http://www.nimblegen.com/products/seqcap/ez/v3/index.html) for phase 3
