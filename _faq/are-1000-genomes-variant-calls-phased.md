---
layout: faq
title: "Are the 1000 genomes variant calls phased?"
faq_tags:
  - data-analysis
  - variants
  - vcf
faq_related:
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
  - can-i-get-haplotype-data-1000-genomes-individuals
  - are-there-any-fasta-files-containing-1000-genomes-variants-or-haplotypes
---
                    
The majority of our [official release](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/) vcf files contain phased variants. This is also true for both our [pilot](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/paper_data_sets/a_map_of_human_variation/) and [phase1](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/) data sets. You can tell when a VCF file contains a phased genotype as the delimited used in the GT field is a pipe symbol | e.g

    #CHROM  POS     ID      REF     ALT     QUAL    FILTER  INFO    FORMAT  HG00096
    10   60523  rs148087467    T     G       100     PASS    AC=0;AF=0.01;AFR_AF=0.06;AMR_AF=0.0028;AN=2; GT:GL 0|0:-0.19,-0.46,-2.28

The [phase1](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/) release file do contain global R2 values but you can also use our vcf to plink converter if you wish to use our files with haploview or another similar tool.
