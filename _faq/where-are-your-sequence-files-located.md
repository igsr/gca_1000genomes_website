---
title: "Where are your sequence files located?"
faq_tags:
  - data-access
  - sequence
faq_related:
  - what-sequence-index-file
  - where-are-your-alignment-files-located
  - where-are-your-variant-files-located
  - why-sequence-data-distributed-2-or-3-files-labelled-srr1-srr2-and-srr
---
                    
Our sequence files are distributed in fastq format and can be found under the [data directory](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/) of the ftp site, here there is a directory per individual which then contains all the sequence data we have for that individual aswell as all the alignment data we have.

We also distribute meta data for all our sequencing runs in a [sequence.index](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/sequence.index) file which is described in a [README](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.sequence_data) on the ftp site.
