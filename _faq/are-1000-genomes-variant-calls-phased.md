---
title: "Are the 1000 genomes variant calls phased?"
faq_tags:
  - data-analysis
  - variants
  - vcf
faq_related:
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
  - can-i-get-haplotype-data-1000-genomes-individuals
  - are-there-any-fasta-files-containing-1000-genomes-variants-or-haplotypes
  - can-i-convert-vcf-files-plinkped-format
---
                    
You can tell when a VCF file contains a phased genotype as the delimiter used in the GT field is a pipe symbol \| e.g

    #CHROM  POS     ID      REF     ALT     QUAL    FILTER  INFO    FORMAT  HG00096
    10   60523  rs148087467    T     G       100     PASS    AC=0;AF=0.01;AFR_AF=0.06;AMR_AF=0.0028;AN=2; GT:GL 0|0:-0.19,-0.46,-2.28

The VCF files produced by the final phase of the 1000 Genomes Project (phase 3) are phased. They can be found in the [final release directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/) from the project and in [the directory supporting the final publications](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/integrated_sv_map/).

The majority of the VCF files in [official releases](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/) over the life time of the project contained phased variants. This is also true for the [pilot](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/paper_data_sets/a_map_of_human_variation/), [phase 1](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/)  and final [phase 3](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/integrated_sv_map/) data sets. 

The [phase 1](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/) release files contain global R2 values but you can also use the VCF to plink converter if you wish to use our files with haploview or another similar tool.
