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
                    
Our data is in standard formats like SAM and VCF, which have tools associated with them. To manipulate SAM/BAM files look at [SAMtools](http://www.htslib.org/) for a C based toolkit and links to APIs in other languages. To interact with VCF files look at [VCFtools](https://vcftools.github.io/index.html) which is a set of Perl and C++ code.
