---
title: "Initial release of low coverage pilot data"
---

The first set of SNPs and other supporting data from the low coverage individuals is now officially released on the EBI and NCBI FTP sites associated with the 1000 Genomes project.

This intermediate release of results from the 1000 Genomes project consists of the following (all file paths below are relative to the following root on the two mirror ftp sites: [ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/2009_02/](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/2009_02/){:target="_blank"} or [ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/release/2009_02/](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/release/2009_02/){:target="_blank"}).

1\. SNP calls from 104 individuals in the low coverage pilot, Pilot 1.

See this file: Pilot1/README_SRP000031_2009_02 for more details on how the calls were made and what the file formats are. All the files related to this set of calls, excepting the human genome reference used (see point 3 below), are in the Pilot1 directory.

See this file: Pilot1/alignments.index for a tab-delimited list of alignment files, one per individual, including md5 checksums for each file. The third and fourth columns give the project id for Pilot1, SRP000031, and the identifier for the corresponding individual. The alignment files are in SAM format (see [http://samtools.sourceforge.net/](http://samtools.sourceforge.net/ "http://samtools.sourceforge.net/"){:target="_blank"}).

Please note these are intermediate results, NOT based on the sequencing data from the complete Pilot.

2\. The human genome reference files used can be found in the following directory: ../../technical/reference.

The male and female reference files are in gzipped fasta format, and there are also two index files, for indexing directly into the compressed references, for BAM file manipulation. This index format is defined in the README within that directory.
