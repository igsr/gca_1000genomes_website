---
title: "What is a panel file?"
faq_tags:
  - data-access
  - tools
  - vcf
faq_related:
  - can-i-get-phenotype-gender-and-family-relationship-information-samples
  - which-samples-are-you-sequencing
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
---

All our variant call releases since [20100804](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20100804/) have come with a panel file. This file lists all the individuals who are part of the release and the population they come from.

This is a tab delimited file which must in its first two columns have sample and population, some files may then have subsequent columns which describe additional info like which super population a sample comes from or what sequencing platforms have been used to generate sequence data for that sample.

The panel files have names like [integrated_call_samples.20101123.ALL.panel](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/integrated_call_samples.20101123.ALL.panel) or [integrated_call_samples_v2.20130502.ALL.panel](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/integrated_call_samples_v2.20130502.ALL.panel)

These panel files can be used by [our browser tools](http://browser.1000genomes.org/tools.html), the data slicer, variant pattern finder and vcf to ped converter to establish population groups for filtering
