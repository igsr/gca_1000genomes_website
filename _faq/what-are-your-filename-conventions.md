---
title: "What are your filename conventions?"
faq_tags:
  - data-access
  - file-format
  - vcf
  - fastq
faq_related:
  - about-alignment-files-bam-and-cram
  - about-index-files
  - how-do-i-find-specific-sequence-read-files
  - are-there-any-statistics-about-how-much-sequence-data-is-in-igsr
  - how-do-i-get-a-genomic-region-sub-section-of-your-files
  - are-my-snps-found-1000-genomes-project
redirect_from:
    - /faq/what-are-your-filename-conventions/
    - /faq/what-do-names-your-fastq-files-mean/
    - /faq/what-do-names-your-variant-files-mean-and-what-format-are-files/
---
                    
Our filename conventions depend on the data format being named. This is described in more detail below.

## FASTQ

Our sequence files are distributed in gzipped [fastq format](http://en.wikipedia.org/wiki/Fastq)

Our files are named with the SRA run accession **E?SRR000000.filt.fastq.gz**. All the reads in the file also hold this name. The files with _1 and _2 in their names are associated with paired end sequencing runs. If there is also a file with no number it is name this represents the fragments where the other end failed qc. The .filt in the name represents the data in the file has been filtered after retrieval from the archive. This filtering process is described in a [README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/historical_data/former_toplevel/README.sequence_data){:target="_blank"}.

## VCF

Our variant files are distributed in [vcf format](http://vcftools.sourceforge.net/), a format initially designed for the 1000 Genomes Project which has seen wider community adoption.

The majority of our vcf files are named in the form:

**<span style"color:red">ALL</span>.<span style"color:blue">chrN</span>|<span style"color:green">wgs|wex</span>.<span style"color:orange">2of4intersection</span>.<span style"color:violet">20100804</span>.<span style"color:darkblue">snps|indels|sv</span>.genotypes.<span style"color:darkred">analysis_group</span>.vcf.gz**.

This name starts with the <span style"color:red">population</span> that the variants were discovered in, if ALL is specifed it means all the individuals available at that date were used. Then the <span style"color:blue">region</span> covered by the call set, this can be a chromosome, <span style"color:green">wgs</span> (which means the file contains at least all the autosomes) or <span style"color:green">wex</span> (this represents the whole exome) and a <span style"color:orange">description</span> of how the call set was produced or who produced it, the <span style"color:violet">date</span> matches the sequence and alignment freezes used to generate the variant call set. Next a field which describes what <span style"color:darkblue">type of variant</span> the file contains, then the <span style"color:darkred">analysis group</span> used to generate the variant calls, this should be low coverage, exome or integrated and finally we have either sites or genotypes. A sites file just contains the first 8 columns of the vcf format and the genotypes files contain individual genotype data as well.

Release directories should also contain panel files which also describe what individuals the variants have genotypes for and what populations those individuals are from
