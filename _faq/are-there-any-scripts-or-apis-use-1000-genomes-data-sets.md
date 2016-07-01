---
title: "Are there any scripts or APIs for use with the 1000 Genomes data sets?"
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
                    
There are a number of tools available in the [Tools page]({{site.browser_url}}/tools.html) of the 1000 Genomes Browser.

Our data is in standard formats like SAM and VCF, which have tools associated with them. To manipulate SAM/BAM files look at [SAMtools](http://samtools.sourceforge.net/) for a C based toolkit and links to APIs in other languages. To interact with VCF files look at [VCFtools](http://vcftools.sourceforge.net) which is a set of Perl and C++ code.

We also provide a public MySQL instance with copies of the databases behind the 1000 Genomes Ensembl browsers. These databases are described [on our public instance page](/node/517).
