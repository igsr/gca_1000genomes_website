---
title: "What percentage of the genome is assayable?"
faq_tags:
  - data-analysis
  - sequence
faq_related:
  - how-are-your-alignments-generated
  - what-does-individual-have-genotype-location-where-it-has-no-sequence-coverage
  - what-depth-coverage-your-phase1-variants
---
                    
For both the pilot project and the phase 1 analysis the 1000 Genomes Project created what they defined as accessibilty masks.

The pilot mask showed that only 85% of the genome is accessible to accurate analysis with the short read technology used by the 1000 Genomes pilot project. The remaining 15% is either repeats or segmental duplications. There is more information about the pilot mask in [README.callability_masks](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/release/2010_03/pilot1/supporting/README_callability_masks)

For the phase 1 analysis using the pilot callability criteria 94% of the genome was accessible. A stricter mask was also created for the phase 1 project to be used for population genetics analysis; this mask used a narrower band of coverage criteria and also insisted that less than 0.1% of reads have a mapping quality of 0 and the average mapping quality should be 56 or higher. These criteria lead to 72.2% of the genome being accessible to accurate analysis with the short read technology used by the 1000 Genomes project.
