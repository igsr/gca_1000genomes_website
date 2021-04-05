---
title: "How do I navigate the FTP site to find the files I need?"
faq_tags:
  - data-access
  - pilot-study
faq_related:
  - what-are-the-phases-of-1000-genomes-and-how-do-i-access-the-data-from-them
  - what-are-the-different-data-collections-available-for-1000-genomes
  - how-do-i-find-specific-sequence-read-files
redirect_from:
    - /faq/what-difference-between-your-data-directory-and-pilotdatadata-directory/
---

The [data directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data/) represents the most current up-to-date view of sequence and alignment data available for the project. We also have a [frozen data set](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/data/) which represents the data which was aligned for the [pilot project as published in Nature in 2010](http://www.nature.com/nature/journal/v467/n7319/full/nature09534.html).

An important difference to note is that while the main project data is all mapped to the GRCh37 assembly the pilot project was mapped to the NCBI36 assembly so positions of variants and alignments reported in the pilot_data directory will be different to what you see in the main project and many genome browsers. Genome browser and variant database also display the 1000 Genomes variants re-mapped to GRCh38, so these will give different coordinates again; you can access GRCh37 on [Ensembl](http://grch37.ensembl.org/index.html) and [UCSC](https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19) genome browsers.
