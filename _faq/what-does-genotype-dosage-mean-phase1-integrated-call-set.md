---
title: "What does Genotype Dosage mean in the phase1 integrated call set?"
faq_tags:
  - data-analysis
  - dosage
  - genotypes
faq_related:
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
  - can-i-get-haplotype-data-1000-genomes-individuals
  - how-do-i-get-sub-section-vcf-file
---
                    
The Genotype Dosage value comes from [Mach/Thunder](http://genome.sph.umich.edu/wiki/UMAKE), imputation engine used for genotype refinement in the [phase1 data set](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/). 

The Dosage represents the predicted dosage of the non reference allele given the data available, it will always have a value between 0 and 2.

The formula is **Dosage = Pr(Het|Data) + 2*Pr(Alt|Data)**

The dosage value gives an indication of how well the genotype is supported by the imputation engine. The genotype likelihood gives an indication of how well the genotype is supported by the sequence data.
