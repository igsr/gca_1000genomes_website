---
title: "How do I get a genomic region sub-section of your files?"
faq_tags:
  - data-access
  - tabix
  - tools
  - variants
  - vcf
  - alignment
  - bam
faq_related:
  - can-i-convert-vcf-files-to-plinkped-format
  - what-is-the-coverage-depth
  - how-do-i-find-out-information-about-a-single-variant
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
  - can-i-get-individual-genotype-information-browser1000genomesorg
  - what-methods-were-used-for-generating-alignments
  - about-alignment-files-bam-and-cram
  - how-do-i-find-specific-alignment-files
redirect_from:
    - /faq/how-do-i-get-sub-section-bam-file/
    - /faq/how-do-i-get-sub-section-vcf-file/
---

**How do I get a sub-section of a VCF file?**

There are two ways to get a subset of a VCF file.

The first is to use the [Data Slicer tool]({{site.browser_url}}/tools.html) from our [browser]({{site.browser_url}}/) which is [documented here](/data-slicer). This tool gives you a web interface requesting the URL of any VCF file and the genomic location you wish to get a sub-slice for. This tool also works for BAM files. This tool also allows you to filter the file for particular individuals or populations if you also provide a panel file.

The second method is using [tabix](http://sourceforge.net/projects/samtools/files/tabix/) on the command line. e.g 

    tabix -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz 2:39967768-39967768

Specifications for the VCF format, and a C++ and Perl tool set for VCF files can be found at [vcftools on sourceforge](http://vcftools.sourceforge.net/)

Please note that all our VCF files using straight intergers and X/Y for their chromosome names in the Ensembl style rather than using chr1 in the UCSC style. If you request a subsection of a vcf file using a chromosome name in the style chrN as shown below it will not work.

    tabix -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz chr2:39967768-39967768
    
 **How do I get a sub-section of a BAM file?**

There are two ways to get subsections of our BAM files.

The first is to use the [Data Slicer tool](http://grch37.ensembl.org/Homo_sapiens/Tools/DataSlicer) from the [Ensembl GRCh37 browser](http://grch37.ensembl.org/index.html) which is [documented here](/data-slicer). This tool gives you a web interface requesting the URL of any BAM file and the genomic location you wish to get a sub-slice for. This tool also works for VCF files.

The second it to use [samtools](http://samtools.sourceforge.net/) on the command line, e.g

    samtools view -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/data/HG00154/alignment/HG00154.mapped.ILLUMINA.bwa.GBR.low_coverage.20101123.bam 17:7512445-7513455

Samtools supports streaming files and piping commands together both using local and remote files. You can get more help with samtools from the [samtools help mailing list](http://sourceforge.net/mail/?group_id=246254) 
