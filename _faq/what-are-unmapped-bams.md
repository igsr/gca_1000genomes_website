---
layout: faq
title: "What are the unmapped bams?"
faq_tags:
  - alignment
  - bam
  - data-analysis
faq_related:
  - what-format-are-your-alignments-and-what-do-names-mean
  - why-are-there-chrom-11-and-chrom-20-alignment-files
---
                    
The unmapped bams contain all the reads for the given individual which could not be placed on the [reference genome](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/phase2_reference_assembly_sequence/). It contains no mapping information

Please note that any paired end sequence where one end sucessfully maps but the other does not both reads are found in the mapped bam
