---
layout: faq
title: "What is the depth of coverage of your Phase1 variants?"
faq_tags:
  - data-access
  - data-analysis
  - data-slicer
  - depth
  - vcf
faq_related:
  - how-do-i-get-sub-section-vcf-file
  - can-i-convert-vcf-files-plinkped-format
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
---
                    
The [Phase1 integrated variant](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/) set does not report the depth of coverage for each individual at each site. We instead report genotype likelihoods and dosage. If you would like to see depth of coverage numbers you will need to calculate them directly.

The [bedtools](http://code.google.com/p/bedtools/) suite provides a method to do this. 

**genomeCoverageBed** is a tool which can provide a bed file which specifies coverage for every base in the genome and **i****ntersectBed** which will provide an intersection between two vcf/bed/bam files

These commands also require [samtools](http://samtools.sourceforge.net/), [tabix](http://sourceforge.net/projects/samtools/files/tabix/)  and [vcftools](http://vcftools.sourceforge.net/) to be installed

An example set of commands would be

    samtools view -b  ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data/HG01375/alignment/HG01375.mapped.ILLUMINA.bwa.CLM.low_coverage.20120522.bam 2:1,000,000-2,000,000 | genomeCoverageBed -ibam stdin -bg > coverage.bg

This command gives you a bedgraph file of the coverage of the HG01375 bam between 2:1,000,000-2,000,000

    tabix -h http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/ALL.chr2.integrated_phase1_v3.20101123.snps_indels_svs.genotypes.vcf.gz 2:1,000,000-2,000,000 | vcf-subset -c HG01375 | bgzip -c > HG01375.vcf.gz

This command gives you the vcf file for 2:1,000,000-2,000,000 with just the genotypes for HG01375

To get the coverage for all those sites you would use

    intersectBed -a HG01375.vcf.gz -b coverage.bg -wb > depth_numbers.vcf

You can find more information about bed file formats please see the [UCSC File Formats Help](http://genome.ucsc.edu/FAQ/FAQformat.html)

For more information you may wish to look at our documentation about [data slicing](http://www.1000genomes.org/faq/how-do-i-get-slice-your-vcf-files)
