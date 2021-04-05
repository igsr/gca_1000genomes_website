---
title: "How do I find specific variant files?"
faq_tags:
  - data-access
  - variants
  - dgva
faq_related:
  - how-do-i-get-a-genomic-region-sub-section-of-your-files
  - about-vcf-variant-files
  - can-i-get-phased-genotypes-and-haplotypes-for-the-individual-genomes
  - what-are-your-filename-conventions
  - how-do-i-find-specific-alignment-files
  - how-do-i-find-the-reference-genomes-files
  - how-do-i-find-the-most-up-to-date-data
  - are-pilot-project-snps-dbsnp
  - are-the-igsr-variants-available-in-dbsnp 
redirect_from:
    - /faq/where-are-snps-xymitochondrial-chr/
    - /faq/where-are-pilot-structural-variants-archived/
    - /faq/where-are-your-variant-files-located/
---

**Where are your variant files located?**

Our variant files are released via our [release directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/) in directories named for the sequence index freeze they are based on.

You may find information about the final 1000 Genomes release in contained in [20130502](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/) and is described in [where is your most recent release?](/faq/where-most-recent-release)

A stable earlier release based on 1092 unrelated samples is phase 1 data release, it can be found under [phase1/analysis_results/integrated_call_sets](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/). The phase 1 data set contains information on all autosomes and chrX, Y and chrMT. The [phase 1 publication](http://www.nature.com/nature/journal/v491/n7422/full/nature11632.html) is based on this data set. 

The pilot release represents results obtained in the three pilot studies of the project (low coverage, high coverage trios and exome). The release data can be found at [here](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/paper_data_sets/a_map_of_human_variation).  The publication about the findings of pilot studies is in [this pdf](/sites/1000genomes.org/files/docs/nature09534.pdf). 

You may also find variant files in our [technical/working](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/working/) directory but please be aware these are experimental files which represent a work in progress and should always be treated with caution

**Where are the pilot structural variants archived?**

The longer structural variants predicted as part of the pilot project were submitted to the [DGVa](http://www.ebi.ac.uk/dgva) and given the accession [estd59](ftp://ftp.ebi.ac.uk/pub/databases/dgva/estd59_1000_Genomes_Consortium_Pilot_Project/).

**Where are the SNPs for the X/Y/Mitochondrial chr?**

Chromosome X, Y and MT variants are available for the [phase 3 variant set](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/). The [chrX calls](
http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chrX.phase3_shapeit2_mvncall_integrated_v1b.20130502.genotypes.vcf.gz) were made in the same manner as the autosome variant calls and as such are part of the integrated call set and include SNPs, indels and large deletions, note the males in this call set are show as haploid for any chrX SNP not in the Pseudo Autosomal Region (PAR). The chrY and MT calls were made independently. Both call sets are presented in an integrated file in the phase3 FTP directory, [chrY](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chrY.phase3_integrated_v2a.20130502.genotypes.vcf.gz) and [chrMT](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/ALL.chrMT.phase3_callmom-v0_4.20130502.genotypes.vcf.gz). ChrY has snps, indels and large deletions. ChrMT only has snps and indels.  For more details about how these call sets were made please see the [phase 3 paper](http://www.nature.com/nature/journal/v526/n7571/full/nature15393.html).
