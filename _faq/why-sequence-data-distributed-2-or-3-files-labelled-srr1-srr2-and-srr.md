---
title: "Why is the sequence data distributed in 2 or 3 files labelled SRR_1, SRR_2 and SRR?"
faq_tags:
  - data-access
  - fastq
  - file-format
faq_related:
  - which-reference-assembly-do-you-use
---
                    
We distribute our fastq files for our paired end sequencing in 2 files, mate1 is found in a file labelled _1 and mate2 is found in the file labelled _2. The files which do not have a number in their name are singled ended reads, this can be for two reasons, some sequencing early in the project was singled ended also, as we filter our fastq files as described in our [README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.sequence_data) if one of a pair of reads gets rejected the other read gets placed in the single file.
