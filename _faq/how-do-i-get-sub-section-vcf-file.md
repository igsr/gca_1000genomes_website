---
layout: faq
title: "How do I get a sub-section of a vcf file?"
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
                    
The first is to use the [Data Slicer tool](http://browser.1000genomes.org/tools.html) from our [browser](http://browser.1000genomes.org/) which is [documented here](http://www.1000genomes.org/data-slicer). This tool gives you a web interface requesting the url of any vcf file and the genomic location you wish to get a sub slice for. This tool also works for BAM files. This tool also allows you to filter the file for particular individuals or populations if you also provide a panel file.

The second method is using [tabix](http://sourceforge.net/projects/samtools/files/tabix/) on the command line. e.g 

    tabix -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz 2:39967768-39967768

The VCF format and a c++ and perl tool set for vcf files can be found at [vcftools on sourceforge](http://vcftools.sourceforge.net/)

Please note all our vcf files using straight intergers and X/Y for their chromosome names in the Ensembl style rather than using chr1 in the UCSC style. If you request a subsection of a vcf file using a chromosome name in the style chrN as shown below it will not work.

    tabix -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz chr2:39967768-39967768
