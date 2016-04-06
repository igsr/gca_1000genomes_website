---
title: "Why are the coordinates of your pilot variants different to what is displayed in Ensembl or UCSC?"
faq_tags:
  - assembly
  - data-access
  - ensembl
  - ucsc
  - variants
faq_related:
  - which-reference-assembly-do-you-use
  - how-are-your-alignments-generated
  - 1000-genomes-data-available-genome-browsers
---
                    
The pilot data for the 1000 genomes project was all mapped to NCBI36/hg18 build of the human assembly. When the data was been loaded into dbSNP it was mapped to GRCh37/hg19 which is accessible from both [Ensembl](http://grch37.ensembl.org/index.html) and [UCSC](http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19) but this does mean that the coordinates from the pilot data on the 1000 Genomes ftp site will be different to the coordinates presented in Ensembl and UCSC.

You can also view 1000 Genomes variants mapped to GRCh38 on [Ensembl](http://www.ensembl.org/index.html) and [UCSC](http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38).
