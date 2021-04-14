---
title: "Can I get phased genotypes and haplotypes for the individual genomes?"
faq_tags:
  - data-access
  - tools
  - variants
  - vcf
  - data-analysis
  - genotypes
  - imputation
faq_related:
  - can-i-convert-vcf-files-to-plinkped-format
  - how-do-i-get-a-genomic-region-sub-section-of-your-files
  - how-do-i-find-out-information-about-a-single-variant
  - do-you-have-assembled-fasta-sequences-for-samples
redirect_from:
    - /faq/can-i-get-genotypes-specific-individualpopulation-your-vcf-files/
    - /faq/can-i-get-haplotype-data-1000-genomes-individuals/
---

The phase 3 integrated data set of the 1000 Genomes project contains fully phased haplotypes for 2,504 individuals. Full details can be found in the [1000 Genomes project phase 3 publication](http://www.nature.com/nature/journal/v526/n7571/full/nature15393.html).

You can obtain individual phased genotypes through either the [Ensembl Data Slicer](http://www.ensembl.org/Homo_sapiens/Tools/DataSlicer) or using a combination of [tabix](http://www.htslib.org/doc/tabix.html) and [VCFtools](https://vcftools.github.io/) allows you to sub sample VCF files for a particular individual or list of individuals.

The Data Slicer has both filter by individual and population options. The individual filter takes the individual names in the VCF header and presents them as a list before giving you the final file. If you wish to filter by population, you also must provide a panel file which pairs individuals with populations, again you are presented with a list to select from before being given the final file, both lists can have multiple elements selected.

To use tabix you must also use a VCFtools Perl script called [vcf-subset](https://vcftools.github.io/perl_module.html#vcf-subset). The command line would look like:

    tabix -h ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz 17:1471000-1472000 | perl vcf-subset -c HG00098 | bgzip -c /tmp/HG00098.20100804.genotypes.vcf.gz
