---
title: "Can I query IGSR programmatically?"
faq_tags:
  - bam
  - data-access
  - tools
  - vcf
faq_related:
  - can-i-access-databases-associated-browser
  - are-the-igsr-variants-available-in-genome-browsers
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
redirect_from:
    - /faq/are-there-any-scripts-or-apis-use-1000-genomes-data-sets/
---
                    
There are a number of tools available in the [Tools page]({{site.browser_url}}/tools.html) of the 1000 Genomes Browser.

Our data is in standard formats like SAM and VCF, which have tools associated with them. To manipulate SAM/BAM files look at [SAMtools](http://samtools.sourceforge.net/) for a C based toolkit and links to APIs in other languages. To interact with VCF files look at [VCFtools](http://vcftools.sourceforge.net) which is a set of Perl and C++ code.

We also provide a public MySQL instance with copies of the databases behind the 1000 Genomes Ensembl browsers. These databases are described [on our public instance page](/node/517).
