---
layout: faq
title: "What do the names of your fastq files mean?"
faq_tags:
  - data-access
  - fastq
  - file-format
faq_related:
  - what-sequence-index-file
  - where-are-your-sequence-files-located
  - are-there-any-statistics-about-how-much-sequence-data-has-been-generated-project
---
                    
Our sequence files are distributed in gzipped [fastq format](http://en.wikipedia.org/wiki/Fastq)

Our files are named with the SRA run accession **E|SRR000000.filt.fastq.gz**. All the reads in the file also hold this name. The files with _1 and _2 in their names are associated with paired end sequencing runs. If there is also a file with no number it is name this represents the fragments where the other end failed qc. The .filt in the name represents the data in the file has been filtered after retrieval from the archive. This filtering process is described in a [README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.sequence_data){:target="_blank"}
