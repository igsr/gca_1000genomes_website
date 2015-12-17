---
layout: faq
title: "Where are your alignment files located?"
faq_tags:
  - alignment
  - bam
  - data-access
faq_related:
  - how-are-your-alignments-generated
  - what-format-are-your-alignments-and-what-do-names-mean
  - how-do-i-get-sub-section-vcf-file
  - which-reference-assembly-do-you-use
---
                    
Our main alignment files are located in our [data directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data/). Our mapped bams contain reads which aligned to the whole genome.

You can find an index of our alignments in our [alignment.index file](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/alignment.index). There are dated versions of these files and statistics surrounding each alignment release in the [alignment_indicies](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/alignment_indices/) directory. Please note with few exceptions we only keep the most recent QC passed alignment for each sample on the ftp site.

We also have frozen versions of the alignments use for both the [pilot](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/) and the [phase1](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/) analyses in different directories on the ftp site. Please note the that the pilot alignments are mapped to NCBI36 rather than GRCh37 like all other alignments on the ftp site.
