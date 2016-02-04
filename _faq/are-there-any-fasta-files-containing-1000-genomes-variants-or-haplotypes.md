---
title: "Are there any FASTA files containing 1000 Genomes variants or haplotypes?"
faq_tags:
  - assembly
  - data-access
  - variants
faq_related:
  - can-i-convert-vcf-files-plinkped-format
  - are-there-any-assemblies-available-1000-genomes-samples
  - how-do-i-get-sub-section-vcf-file
  - where-most-recent-release
---
                    
We do not provide FASTA files annotated for 1000 Genomes variants. You can create such a file with a [VCFtools](http://vcftools.github.io/) perl script called [vcf-consensus](http://vcftools.github.io/perl_module.html#vcf-consensus).

An example set of command lines would be:

    tabix -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20110521/ALL.chr17.phase1_release_v3.20101123.snps_indels_svs.genotypes.vcf.gz 17:1471000-1472000 | perl vcf-subset -c HG00098 | bgzip -c > HG00098.vcf.gz
    tabix -p vcf HG00098.vcf.gz
    cat ref.fa | vcf-consensus HG00098.vcf.gz > HG00098.fa

You can get more support for VCFtools on their [help mailing list](http://sourceforge.net/p/vcftools/mailman/).
