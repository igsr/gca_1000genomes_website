---
title: "Which reference assembly do you use?"
faq_tags:
  - assembly
  - data-access
  - data-analysis
  - grch37
  - ncbi36
  - reference
faq_related:
  - how-are-your-alignments-generated
  - what-format-are-your-alignments-and-what-do-names-mean
  - where-are-your-alignment-files-located
---
                    
The reference assembly the 1000 Genomes Project has mapped sequence data to has changed over the course of the project.

For the pilot phase we mapped data to NCBI36. A copy of our reference fasta file can be found on the [ftp site](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/technical/reference/).

For the phase 1 and phase 3 analysis we mapped to GRCh37. Our fasta file which can be found [on our ftp site](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/) called human_g1k_v37.fasta.gz, it contains the autosomes, X, Y and MT but no haplotype sequence or EBV.

Our most recent alignment release was mapped to GRCh38, this also contained decoy sequence, alternative haplotypes and EBV. It was mapped using an alt aware version of BWA-mem. The fasta files can be found [on our ftp site](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/GRCh38_reference_genome/)
