---
title: "How can I get the allele frequency of my variant?"
faq_tags:
  - data-access
  - tools
  - variants
  - vcf
faq_related:
  - how-do-i-get-sub-section-vcf-file
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
  - can-i-convert-vcf-files-plinkped-format
---
                    

Our VCF files contain global and super population alternative allele frequencies. You can see this in our [most recent release](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/). For multi allelic variants, each alternative allele frequency is presented in a comma separated list.

An example info column which contains this information looks like

    1 15211 rs78601809 T G 100 PASS AC=3050;AF=0.609026;AN=5008;NS=2504;DP=32245;EAS_AF=0.504;AMR_AF=0.6772;AFR_AF=0.5371;EUR_AF=0.7316;SAS_AF=0.6401;AA=t|||;VT=SNP

If you want population specific allele frequencies you have three options:
* For a single variant you can look at the [population genetics page for a variant in our browser]({{site.browser_url}}/Homo_sapiens/Variation/Population?r=1:14711-15711;source=dbSNP;v=rs78601809;vdb=variation;vf=22041749). This gives you piecharts and a table for a single site.
* For a genomic region you can use our [allele frequency calculator](/allele-frequency-calculator-documentation) tool which gives a set of allele frequencies for selected populations
* If you would like sub population allele frequences for a whole file, you are best to use the vcftools command line tool.

This is done using a combination of two [vcftools ](http://vcftools.sourceforge.net/) commands called [vcf-subset](http://vcftools.sourceforge.net/perl_module.html#vcf-subset) and [fill-an-ac](http://vcftools.sourceforge.net/perl_module.html#fill-an-ac)

An example command set using files from our [phase 1 release](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/) would look like 

    grep CEU integrated_call_samples.20101123.ALL.panel | cut -f1 > CEU.samples.list

    vcf-subset -c CEU.samples.list ALL.chr13.integrated_phase1_v3.20101123.snps_indels_svs.genotypes.vcf.gz | fill-an-ac |
        bgzip -c > CEU.chr13.phase1.vcf.gz
        </pre>

Once you have this file you can calculate your frequency by dividing AN (allele number) by AC (allele count)

Please note that some early VCF files from the main project used LD information and other variables to help estimate the allele frequency. This means in these files the AF does not always equal AC/AN. In the phase 1 and phase 3 releases, AC/AN should always match the allele frequency quoted.
