---
title: "Are the variant calls in IGSR phased?"
faq_tags:
  - data-analysis
  - variants
  - vcf
faq_related:
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
  - do-you-have-assembled-fasta-sequences-for-samples
  - can-i-convert-vcf-files-to-plinkped-format
redirect_from:
    - /faq/are-1000-genomes-variant-calls-phased/
---

You can tell when a VCF file contains a phased genotype as the delimiter used in the GT field is a pipe symbol \| e.g

    #CHROM  POS     ID      REF     ALT     QUAL    FILTER  INFO    FORMAT  HG00096
    10   60523  rs148087467    T     G       100     PASS    AC=0;AF=0.01;AFR_AF=0.06;AMR_AF=0.0028;AN=2; GT:GL 0|0:-0.19,-0.46,-2.28

The VCF files produced by the final phase of the 1000 Genomes Project (phase 3) are phased. They can be found in the [final release directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/) from the project and in [the directory supporting the final publications](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/integrated_sv_map/).

Some other studies have also produced phased versions of their calls. These include the analysis of high-coverage data across 3,202 samples on GRCh38 completed by NYGC. Multiple sets of VCFs are available, including [phased VCFs](/data-portal/data-collection/30x-grch38), linked to from the page for that collection.
