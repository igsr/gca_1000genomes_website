---
title: "Do you have assembled FASTA sequences for samples?"
faq_tags:
  - assembly
  - data-access
  - variants
faq_related:
  - can-i-convert-vcf-files-to-plinkped-format
  - how-do-i-get-a-genomic-region-sub-section-of-your-files
  - how-do-i-find-the-most-up-to-date-data
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
redirect_from:
    - /faq/are-there-any-fasta-files-containing-1000-genomes-variants-or-haplotypes/
    - /faq/are-there-any-assemblies-available-1000-genomes-samples/    
---
                    
Recent projects, such as the second phase of the Human Genome Structural Variation Consortium (HGSVC) have produced assemblies. These are [linked to from the page for that data collection](/data-portal/data-collection/hgsvc2). These are haplotype resolved assemblies. More details can be found in the accompanying publication.

The 1000 Genomes Project did not create any assemblies from the genome sequence data it generated.  

The Gerstein Lab at Yale University created a diploid version of the NA12878 sequence, which is available from the [Gerstein website](http://sv.gersteinlab.org/) under [NA12878_diploid](http://sv.gersteinlab.org/NA12878_diploid/). When used, groups should cite [AlleleSeq: analysis of allele-specific expression and binding in a network framework, Rozowsky *et al.*, Molecular Systems Biology 7:522](http://www.nature.com/msb/journal/v7/n1/full/msb201154.html).

You can create a FASTA file incorporating the variants from an individual with a [VCFtools](http://vcftools.github.io/) Perl script called [vcf-consensus](http://vcftools.github.io/perl_module.html#vcf-consensus).

An example set of command lines would be:

    #Extract the region and individual of interest from the VCF file you want to produce the consensus from
    tabix -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20110521/ALL.chr17.phase1_release_v3.20101123.snps_indels_svs.genotypes.vcf.gz 17:1471000-1472000 | perl vcf-subset -c HG00098 | bgzip -c > HG00098.vcf.gz
    
    #Index the new VCF file so it can be used by vcf-consensus
    tabix -p vcf HG00098.vcf.gz
    
    #Run vcf-consensus
    cat ref.fa | vcf-consensus HG00098.vcf.gz > HG00098.fa

You can get more support for VCFtools on their [help mailing list](http://sourceforge.net/p/vcftools/mailman/).
