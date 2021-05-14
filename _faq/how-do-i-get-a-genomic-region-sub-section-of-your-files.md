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

You can get a subsection of the VCF or BAM files using the [Ensembl Data Slicer tool](http://www.ensembl.org/Homo_sapiens/Tools/DataSlicer). This tool gives you a web interface requesting the URL of any VCF file and the genomic location you wish to get a sub-slice for. This tool also works for BAM files. This tool also allows you to filter the file for particular individuals or populations if you also provide a panel file.

You can also subset VCFs using [tabix](http://www.htslib.org/doc/tabix.html) on the command line, e.g.

    tabix -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz 2:39967768-39967768

Specifications for the VCF format, and a C++ and Perl tool set for VCF files can be found at [vcftools on sourceforge](https://vcftools.github.io/)

Please note that all our VCF files using straight intergers and X/Y for their chromosome names in the Ensembl style rather than using chr1 in the UCSC style. If you request a subsection of a vcf file using a chromosome name in the style chrN as shown below it will not work.

    tabix -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz chr2:39967768-39967768
    
You can subset alignment files with [samtools](http://www.htslib.org/) on the command line, e.g.

    samtools view -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/data/HG00154/alignment/HG00154.mapped.ILLUMINA.bwa.GBR.low_coverage.20101123.bam 17:7512445-7513455

Samtools supports streaming files and piping commands together both using local and remote files. You can get more help with samtools from the [samtools help mailing list](http://sourceforge.net/mail/?group_id=246254) 
