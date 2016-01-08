---
title: "Can I get genotypes for a specific individual/population from your vcf files?"
faq_tags:
  - data-access
  - tools
  - variants
  - vcf
faq_related:
  - can-i-convert-vcf-files-plinkped-format
  - can-i-get-haplotype-data-1000-genomes-individuals
  - how-do-i-get-sub-section-vcf-file
  - how-can-i-get-allele-frequency-my-variant
---
                    
Both by using our [Data Slicer](http://browser.1000genomes.org/tools.html) and by utlizing [tabix](http://samtools.sourceforge.net/tabix.shtml) and [vcftools](http://vcftools.sourceforge.net/) allows you to sub sample our vcf files for a particular individual or list of individuals.

Our Data Slicer, described in more detail in the [documentation](http://www.1000genomes.org/data-slicer), has a filter by both individual and population options. The individual filter takes the individual names in the vcf header and presents them as a list before giving you the final file. If you wish to filter by population you also must provide a panel file which pairs individuals with a population, again you are presented with a list to select from before being given the final file, both lists can have multiple elements selected.

To use tabix you must also use a vcftools perl script called [vcf-subset](http://vcftools.sourceforge.net/perl_module.html#vcf-subset). The command line would look like

    tabix -h ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz 17:1471000-1472000 | perl vcf-subset -c HG00098 | bgzip -c /tmp/HG00098.20100804.genotypes.vcf.gz
