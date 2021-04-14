---
title: "About FASTQ sequence read files"
faq_tags:
  - data-access
  - sequence
  - fastq
  - file-format
faq_related:
  - how-do-i-find-specific-sequence-read-files
  - what-are-your-filename-conventions
  - are-there-any-statistics-about-how-much-sequence-data-is-in-igsr
  - which-reference-assembly-do-you-use
redirect_from:
    - /faq/what-format-are-your-sequence-files/
    - /faq/why-are-there-more-one-set-fastq-files-associated-individual/
    - /faq/why-sequence-data-distributed-2-or-3-files-labelled-srr1-srr2-and-srr/
---

Our sequence files are distributed in [FASTQ format](http://en.wikipedia.org/wiki/Fastq). Some are hosted on our own FTP site and some by the [sequence read archive](https://www.ebi.ac.uk/ena/browser/home).

## Format

We use Sanger style [phred scaled quality encoding](http://en.wikipedia.org/wiki/Phred_quality_score).

The files are all gzipped compressed and the format looks like this, with a four-line repeating pattern

    @ERR059938.60 HS9_6783:8:2304:19291:186369#7/2
    GTCTCCGGGGGCTGGGGGAACCAGGGGTTCCCACCAACCACCCTCACTCAGCCTTTTCCCTCCAGGCATCTCTGGGAAAGGACATGGGGCTGGTGCGGGG
    +
    7?CIGJB:D:-F7LA:GI9FDHBIJ7,GHGJBKHNI7IN,EML8IFIA7HN7J6,L6686LCJE?JKA6G7AK6GK5C6@6IK+++?5+=<;227*6054

## Files for each individual

Many of our individuals have multiple fastq files. This is because many of our individual were sequenced using more than one run of a sequencing machine.

Each set of files named like ERR001268_1.filt.fastq.gz, ERR001268_2.filt.fastq.gz and ERR001268.filt.fastq.gz represent all the sequence from a sequencing run.

The labels with \_1 and \_2 represent paired-end files; mate1 is found in a file labelled \_1 and mate2 is found in the file labelled \_2. The files which do not have a number in their name are singled ended reads, this can be for two reasons, some sequencing early in the project was singled ended, also, as we filter our fastq files as described in our [README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.sequence_data) if one of a pair of reads gets rejected the other read gets placed in the single file.

When a individual has many files with different run accessions (e.g ERR001268), this means it was sequenced multiple times. This can either be for the same experiment, some centres used multiplexing to have better control over their coverage levels for the low coverage sequencing, or because it was sequenced using different protocols or on different platforms.

For a full description of the sequencing conducted for the project please look at our [sequence.index file](/faq/what-sequence-index-file)
