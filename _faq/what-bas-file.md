---
title: "What is a bas file?"
faq_tags:
  - alignment
  - bam
  - bas
  - file-format
faq_related:
  - how-are-your-alignments-generated
  - what-format-are-your-alignments-and-what-do-names-mean
  - where-are-your-alignment-files-located
---
                    
Bas files are statistics we generate for our alignment files which we distribute alongside our alignment files. 

These are readgroup level statistics in a tab delimited manner and are described in this [README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README_file_formats_and_descriptions.md)

Each mapped and unmapped bam file has an associated bas file and we provide them collected together into a single file in the alignment_indices directory, dated to match the alignment release.
