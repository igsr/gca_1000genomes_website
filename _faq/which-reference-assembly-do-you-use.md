---
layout: faq
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
                    
The reference assembly the 1000 genomes project has mapped sequence data to has changed over the course of the project.

For the pilot phase we mapped data to NCBI36. A copy of our reference fasta file can be found on the [ftp site](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/technical/reference/).

For the phase1 analysis we mapped to GRCh37. Our fasta file which can be found [here](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/) called human_g1k_v37.fasta.gz, it contains the autosomes, X, Y and MT but no haplotype sequence or EBV

For the final round of alignments the sequence data will be mapped to a set of sequences derived from the GRCh37 assembly.  This GRCh37-derived alignment set includes chromosomal plus unlocalized and unplaced contigs, the rCRS mitochondrial sequence (AC:NC_012920), Human herpesvirus 4 type 1 (AC:NC_007605) and decoy sequence derived from HuRef, Human Bac and Fosmid clones and NA12878. These files are available in [phase2_reference_assembly_sequence](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/phase2_reference_assembly_sequence/) on the ftp site.  All human variant coordinates reported by the 1000 Genomes project are in GRCh37 coordinates.
