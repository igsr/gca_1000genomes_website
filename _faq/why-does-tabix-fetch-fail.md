---
layout: faq
title: "Why does a tabix fetch fail?"
faq_tags:
  - data-access
  - tools
  - variants
faq_related:
  - how-do-i-get-sub-section-vcf-file
  - what-do-names-your-variant-files-mean-and-what-format-are-files
  - what-tools-can-i-use-download-1000-genomes-data
---
                    
There are two main reasons a tabix fetch might fail.

All our vcf files using straight intergers and X/Y for their chromosome names in the Ensembl style rather than using chr1 in the UCSC style. If you request a subsection of a vcf file using a chromosome name in the style chrN as shown below it will not work.

   tabix -h ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20100804 ALL.2of4intersection.20100804.genotypes.vcf.gz chr2:39967768-39967768

Also tabix does not fail when streaming remote files but instead just stops streaming. This can lead to incomplete lines with final rows with unexpected numbers of columns when trying to stream large sections of the file. The only way to avoid this is to download the file and work with it locally.
