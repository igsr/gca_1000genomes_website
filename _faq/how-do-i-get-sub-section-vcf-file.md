---
title: "How do I get a sub-section of a VCF file?"
faq_tags:
  - data-access
  - tabix
  - tools
  - variants
  - vcf
faq_related:
  - can-i-convert-vcf-files-plinkped-format
  - what-depth-coverage-your-phase1-variants
  - can-i-find-genomic-position-list-dbsnp-rs-numbers-0
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
  - can-i-get-individual-genotype-information-browser1000genomesorg
---
                    
There are two ways to get a subset of a VCF file.

The first is to use the [Data Slicer tool]({{site.browser_url}}/tools.html) from our [browser]({{site.browser_url}}/) which is [documented here](/data-slicer). This tool gives you a web interface requesting the URL of any VCF file and the genomic location you wish to get a sub-slice for. This tool also works for BAM files. This tool also allows you to filter the file for particular individuals or populations if you also provide a panel file.

The second method is using [tabix](http://sourceforge.net/projects/samtools/files/tabix/) on the command line. e.g 

    tabix -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz 2:39967768-39967768

Specifications for the VCF format, and a C++ and Perl tool set for VCF files can be found at [vcftools on sourceforge](http://vcftools.sourceforge.net/)

Please note that all our VCF files using straight intergers and X/Y for their chromosome names in the Ensembl style rather than using chr1 in the UCSC style. If you request a subsection of a vcf file using a chromosome name in the style chrN as shown below it will not work.

    tabix -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz chr2:39967768-39967768
