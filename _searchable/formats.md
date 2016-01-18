---
layout: single_section
title: "formats"
permalink: /formats/
---
# Data file formats

## Alignment files: BAM and CRAM

BAM files are binary representations of the Sequence Alignment/Map format. These files and the associated SAMtools package are described in this [Bioinformatics publication](http://bioinformatics.oxfordjournals.org/cgi/content/abstract/25/16/2078).

Additional information about SAM/BAM is available at the SAMtools development site: [http://samtools.sourceforge.net/](http://samtools.sourceforge.net/).

CRAM files are similar to BAM files but give a compressed representation of the alignment. This compression is driven by the reference the sequence data is aligned to. The file format was designed to reduce the disk foot print of alignment data by the [EBI, who provide further information on the format](http://www.ebi.ac.uk/ena/software/cram-toolkit).

Information on working with IGSR CRAM files are available on the [FTP site](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README_using_1000genomes_cram.md).

## Variant Call Format (VCF)

The VCF format is a tab delimited format for storing variant calls and individual genotypes. It is able to store all variant calls from single nucleotide variants to large scale insertions and deletions.

##Data file specifications

The specifications for these file formats continue to develop. Current specifications for [SAM/BAM, CRAM and VCF can be found at hts-specs](https://samtools.github.io/hts-specs/).

#Summary files

##BAS
.bas files contain statistics relating to .bam or .cram files, with one line per readgroup and columns separated by
tabs. The first line is a header that describes each column. The first six columns
provide meta information about each readgroup, with the remaining columns providing various statistics about the readgroup. Where data isn't available to calculate the
result for a column, the default value will be 0. Further information is available on the [FTP site](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README_file_formats_and_descriptions.md).


##Index files
Various types of index file exist on the site, primarily listing available sequence data and alignments. The index files are tab-delimited files where the data is arranged in columns. Immediately before the body of the file there is a header line, which starts with #, that gives the column names. In addition, index files may have further information at the head of the file. These lines start with ## and can provide descriptions of the columns, the date the index was generated and other pieces of information, as appropriate to the file and data set. Further information is available on the [FTP site](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README_file_formats_and_descriptions.md).
