---
title: "Are there any genomic regions that have not been studied?"
faq_tags:
  - data-analysis
  - sequence
faq_related:
  - what-methods-were-used-for-generating-alignments
  - how-was-imputation-used-in-1000-genomes-to-fill-in-gaps-in-sequencing
  - what-is-the-coverage-depth
redirect_from:
    - /faq/why-only-85-genome-assayable/
---
                    
The 1000 Genomes Project created what they defined as accessibilty masks for the pilot phase, phase 1 and phase 3 of the Project.

## Pilot
The pilot mask showed that only 85% of the genome is accessible to accurate analysis with the short read technology used by the 1000 Genomes pilot project. The remaining 15% is either repeats or segmental duplications. There is more information about the pilot mask in [README.callability_masks](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/release/2010_03/pilot1/supporting/README_callability_masks).

## Phase 1
For the phase 1 analysis using the pilot callability criteria 94% of the genome was accessible. A stricter mask was also created for the phase 1 project to be used for population genetics analysis; this mask used a narrower band of coverage criteria and also insisted that less than 0.1% of reads have a mapping quality of 0 and the average mapping quality should be 56 or higher. These criteria lead to 72.2% of the genome being accessible to accurate analysis with the short read technology used at that time by the 1000 Genomes Project. Further information is in [section 10.4 of the supplementary material](http://www.nature.com/nature/journal/v491/n7422/extref/nature11632-s1.pdf) from the phase 1 publication.

## Phase 3
In phase 3, using the pilot criteria 95.9% of the genome was found to be accessible. For the stricter mask created during phase 3, 76.9% was found to be accessible. A detailed description of the accessibility masks created during phase 3, the final phase of the Project, can be found in [section 9.2 of the supplementary material](http://www.nature.com/nature/journal/v526/n7571/extref/nature15393-s1.pdf) for the main publication. The percentages quoted are for non-N bases.
