---
title: "About alignment files (BAM and CRAM)"
faq_tags:
  - alignment
  - bam
  - data-analysis
  - bas
  - file-format
  - cram
  - data-access
faq_related:
  - why-are-there-chr-11-and-chr-20-alignment-files-and-not-for-other-chromosomes
  - what-methods-were-used-for-generating-alignments
  - how-do-i-find-specific-alignment-files
redirect_from:
    - /faq/what-are-cram-files/
    - /faq/what-are-unmapped-bams/
    - /faq/what-format-are-your-alignments-and-what-do-names-mean/
    - /faq/what-bas-file/
---

All our alignment files are in [BAM](http://samtools.sourceforge.net/) or [CRAM](http://www.ebi.ac.uk/ena/about/cram_toolkit) format. BAM is a standard alignment format which was defined by the 1000 Genomes consortium and has since seen wide community adoption, whereas CRAM is a compressed version of this. This compression is driven by the reference the sequence data is aligned to.

The CRAM file format was designed by the [EBI](http://www.ebi.ac.uk/ena/about/cram_toolkit) to reduce the disk footprint of alignment data in these days of ever-increasing data volumes. 

The CRAM files the 1000 Genomes project distributes are lossy cram files which reduce the base quality scores using the Illumina 8-bin compression scheme as described in the lossy compression section on the [cram usage page](http://www.ebi.ac.uk/ena/about/cram_usage)

There is a [github page](https://github.com/samtools/hts-specs) where the format of CRAM file is discussed and help can be found.

CRAM files can be read using many Picard tools and work is being done to ensure samtools can also read the file format natively.

## BAM file names

The bam file names look like:

**NA00000.location.platform.population.analysis_group.YYYYMMDD.bam**

The bai index and bas statistics files are also named in the same way.

The name includes the individual sample ID, where the sequence is mapped to, if the file has only contains mapping to a particular chromosome that is what the name contains otherwise, mapped means the whole genome mapping and unmapped means the reads which failed to map to the reference (pairs where one mate mapped and the other didn't stay in the mapped file), the sequencing platform, the ethnicity of the sample using our [three letter population code](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README_populations.md), the sequencing strategy. The date matches the date of the sequence used to build the bams and can also be found in the [sequence.index filename](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.sequence_data).

## Unmapped bams

The unmapped bams contain all the reads for the given individual which could not be placed on the [reference genome](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/phase2_reference_assembly_sequence/). It contains no mapping information

Please note that any paired end sequence where one end successfully maps but the other does not both reads are found in the mapped bam

## Bas files

Bas files are statistics we generate for our alignment files which we distribute alongside our alignment files. 

These are readgroup level statistics in a tab delimited manner and are described in this [README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README_file_formats_and_descriptions.md)

Each mapped and unmapped bam file has an associated bas file and we provide them collected together into a single file in the alignment_indices directory, dated to match the alignment release.
