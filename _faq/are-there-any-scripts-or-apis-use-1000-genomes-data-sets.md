---
title: "Are there any scripts or apis for use with the 1000 genomes data sets?"
faq_tags:
  - bam
  - data-access
  - tools
  - vcf
faq_related:
  - can-i-access-databases-associated-browser
  - 1000-genomes-data-available-genome-browsers
  - can-i-get-genotypes-specific-individualpopulation-your-vcf-files
---
                    
There are no 1000 genomes specific apis or tools. Our data is all in standard formats like SAM and VCF and these do have tools associated with them.

To manipulate SAM/BAM files look at [samtools](http://samtools.sourceforge.net/) for a C based toolkit and links to apis in other languages.

To interact with VCF files look at [vcftools](http://vcftools.sourceforge.net) which is a set of perl and c++ code.

We also provide a public mysql instance with copies of the databases behind our Ensembl browser for 1000 genomes data. These databases are described [on our public instance page](/node/517)
