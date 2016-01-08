---
title: "What are CRAM files?"
faq_tags:
  - alignment
  - bam
  - cram
  - data-access
  - data-analysis
faq_related:
  - what-format-are-your-alignments-and-what-do-names-mean
  - where-are-your-alignment-files-located
---
                    
CRAM files are alignment files like BAM files. They represent a compressed version of the alignment. This compression is driven by the reference the sequence data is aligned to.

The file format was designed by the [EBI](http://www.ebi.ac.uk/ena/about/cram_toolkit) to reduce the disk foot print of alignment data in these days of ever increasing data volumes. 

The CRAM files the 1000 genomes project distributes are lossy cram files which reduce the base quality scores using the Illumina 8 bin compression scheme as describe in the lossy compression section on the [cram usage page](http://www.ebi.ac.uk/ena/about/cram_usage)

There is a [cram developers mailing list](http://listserver.ebi.ac.uk/mailman/listinfo/cram-dev) where the format is discussed and help can be found.

CRAM files can be read using many Picard tools and work is being done to ensure samtools can also read the file format natively.
