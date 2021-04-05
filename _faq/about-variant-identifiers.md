---
title: "About variant identifiers"
faq_tags:
  - assembly-conversion
  - data-access
  - identifiers
  - identifier
  - id
  - vcf
faq_related:
  - are-my-snps-found-1000-genomes-project
  - are-the-igsr-variants-available-in-dbsnp
  - can-i-map-your-variant-coordinates-between-different-genome-assemblies
redirect_from:
    - /faq/what-are-kgp-identifiers/
    - /faq/what-does-this-sv-id-mean/
---

**What does this variant identifier mean?**

All of the 1000 Genomes SNPs and indels have been submitted to [dbSNP](http://www.ncbi.nlm.nih.gov/SNP/), and will have rsIDs in the main 1000 Genomes release files. The SVs have all been submitted to [DGVa](http://www.ebi.ac.uk/dgva) and have esvIDs in the main files.

If you are using some of the older working files that were used during the data gathering phase of the 1000 Genomes Project, you may find some variants with other kinds of identifiers, such as *Alu_umary_Alu_###*. These identifiers were created internally by the groups that did that set of particular variant calling, and are not found anywhere other than these files, as they will have been replaced by official IDs in the later files.

**What are the kgp identifiers?**

kgp identifiers were not created by the 1000 Genomes Project. We also do not maintain them. They were created by Illumina for their genotyping platform before some variants identified during the pilot phase of the project had been assigned rs numbers.

We do not possess a mapping of these identifiers to current rs numbers. As far as we are aware no such list exists.
