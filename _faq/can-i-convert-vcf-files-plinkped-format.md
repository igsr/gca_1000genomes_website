---
title: "Can I convert VCF files to PLINK/PED format?"
faq_tags:
  - data-access
  - file-format
  - tools
  - vcf
faq_related:
  - can-i-get-haplotype-data-1000-genomes-individuals
  - are-there-any-fasta-files-containing-1000-genomes-variants-or-haplotypes
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
---
                    
We provide a [VCF to PED tool]({{site.browser_url}}/Homo_sapiens/UserData/Haploview) to convert from VCF to [PLINK](http://pngu.mgh.harvard.edu/~purcell/plink/index.shtml) PED format. This tool has documentation for both the [web interface](/vcf-ped-converter#Online) and the [Perl script](/vcf-ped-converter#API%20Script).

An example Perl command to run the script would be:

    perl vcf_to_ped_converter.pl -vcf ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20110521/ALL.chr13.phase1_integrated_calls.20101123.snps_indels_svs.genotypes.vcf.gz
        -sample_panel_file ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20110521/phase1_integrated_calls.20101123.ALL.sample_panel
        -region 13:32889611-32973805 -population GBR -population FIN
