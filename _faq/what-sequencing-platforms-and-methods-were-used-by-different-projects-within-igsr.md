---
title: "What sequencing platforms and methods were used by different projects within IGSR?"
faq_tags:
  - data-access
  - statistics
faq_related:
  - are-there-any-statistics-about-how-much-sequence-data-is-in-igsr
  - how-much-disk-space-used-1000-genomes-project
  - how-many-individuals-have-been-sequenced-in-igsr-projects-and-how-were-they-selected
  - about-index-files
  - about-alignment-files-bam-and-cram
redirect_from:
    - /faq/what-sequencing-platforms-were-used-1000-genomes-project/
    - /faq/what-library-insert-sizes-where-used-1000-genomes-project/
    - /faq/what-read-lengths-are-being-used-project/
---

**Sequencing Platforms used for the 1000 Genomes Project**

For the final phase of the 1000 Genomes Project only Illumina was used for the sequencing. The phase 1 effort also included ABI SOLiD sequence and the pilot project contained 454 sequence data.

**Library insert sizes used in the 1000 genomes project**

The project has generally used short insert libraries between 100 and 600bp for Illumina sequence data. For SOLiD and 454 sequence data you will see a wider variety of insert sizes. The insert sizes are reported in both the [sequence.index](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.sequence_data) file and the [bas files](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.alignment_data). The sequence index file contains the insert size reported to the SRA when the data was submitted, the bas files contain the mean insert size based on the alignment and the standard deviation from that mean.

**Read lengths used by the 1000 genomes project**

As the project started sequencing in 2008 it holds a wide range of read lengths, the Illumina and SOLiD data range between 25bp to 160bp read lengths. Our [sequence index](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.sequence_data) file report read and base counts for each fastq file which can be used to find this out more precisely. For the final analysis phase of the project only Illumina data which is 70bp or longer was used and where required samples were sequenced again to match this criterion.
