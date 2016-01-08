---
title: "Are the 1000 genomes variants in dbSNP?"
faq_tags:
  - data-access
  - dbsnp
  - dgva
  - variants
faq_related:
  - can-i-find-genomic-position-list-dbsnp-rs-numbers-0
  - can-i-access-databases-associated-browser
  - "why-isn't-snp-dbsnp-or-hapmap"
---
                    
The 1000 genomes snp and short indel all get submitted to [dbSNP](http://www.ncbi.nlm.nih.gov/snp/) and longer structural variants get submitted to the [D GVa](http://www.ebi.ac.uk/dgva/)

Both the [pilot](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/paper_data_sets/a_map_of_human_variation/) and the majority of [phase1 data](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/) have now been archived by [dbSNP](http://www.ncbi.nlm.nih.gov/snp/) and the [DGVa](http://www.ebi.ac.uk/dgva/) respectively. Where possible our release vcf files contain the appropriate IDs in the ID column.

Please note that archiving these variants is a long process so there can be a delay of a few months between new variants being discovered and then being loaded into one of the archives. The absence of a 1000 genomes variant from an archive probably means it has not yet been accessioned by that archive. The 1000 genomes project has also discovered many novel snps which were not part of previous studies like HapMap.
