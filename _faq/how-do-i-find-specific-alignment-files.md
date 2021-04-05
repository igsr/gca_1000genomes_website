---
title: "How do I find specific alignment files?"
faq_tags:
  - data-access
  - exon-targetted
  - grch37
  - ncbi36
  - pilot3
  - alignment
  - bam
faq_related:
  - what-methods-were-used-for-generating-alignments
  - about-alignment-files-bam-and-cram
  - how-do-i-get-a-genomic-region-sub-section-of-your-files
  - which-reference-assembly-do-you-use
redirect_from:
    - /faq/where-are-alignment-files-exon-targetted-individuals/
    - /faq/where-are-your-alignment-files-located/
---

**Where are your alignment files located?**

Our main alignment files are located in our [data directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data/). Our mapped bams contain reads which aligned to the whole genome.

You can find an index of our alignments in our [alignment.index file](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/alignment.index). There are dated versions of these files and statistics surrounding each alignment release in the [alignment_indicies](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/alignment_indices/) directory. Please note with few exceptions we only keep the most recent QC passed alignment for each sample on the ftp site.

We also have frozen versions of the alignments use for both the [pilot](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/) and the [phase 1](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/) analyses in different directories on the ftp site. Please note the that the pilot alignments are mapped to NCBI36 rather than GRCh37 like all other alignments on the ftp site.

**Where are the alignment files for the exon targetted individuals?**

The alignment files which were used as part of the pilot project are found under [ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/data](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/data). These are all aligned to NCBI36.

There are also GRCh37 alignments available for both the high coverage individuals ([ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/pilot2_high_cov_GRCh37_bams/](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/pilot2_high_cov_GRCh37_bams/)) and the exon targetted individuals ([ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/pilot3_exon_targetted_GRCh37_bams/](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/pilot3_exon_targetted_GRCh37_bams/))

Please be aware much of the sequence data these alignments are based on is very short read data (36bp) and was generated a long time ago (~2008) so may not reflect current sequencing data.

A more modern data set for the CEU trio is available from Illumina on their [Platinum Genomes page](https://www.illumina.com/platinumgenomes.html).
