---
layout: faq
title: "How do I get a sub-section of a bam file?"
faq_tags:
  - alignment
  - bam
  - data-access
  - tools
faq_related:
  - how-are-your-alignments-generated
  - what-format-are-your-alignments-and-what-do-names-mean
  - where-are-your-alignment-files-located
---
                    
There are two ways to get subsections of our bam files.

The first is to use the [Data Slicer tool](http://browser.1000genomes.org/tools.html) from our [browser](http://browser.1000genomes.org/) which is [documented here](http://www.1000genomes.org/data-slicer). This tool gives you a web interface requesting the url of any bam file and the genomic location you wish to get a sub slice for. This tool also works for VCF files.

The second it to use [samtools](http://samtools.sourceforge.net/) on the command line, e.g

    samtools view -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/data/HG00154/alignment/HG00154.mapped.ILLUMINA.bwa.GBR.low_coverage.20101123.bam 17:7512445-7513455

Samtools supports streaming files and piping commands together both using local and remote files. You can get more help with samtools from the [samtools help mailing list](http://sourceforge.net/mail/?group_id=246254)
