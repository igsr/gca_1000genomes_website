---
title: "Can I find the genomic position for a list of dbSNP rs numbers?"
faq_tags:
  - data-access
  - dbsnp
  - variants
faq_related:
  - can-i-access-databases-associated-browser
  - are-there-any-scripts-or-apis-use-1000-genomes-data-sets
  - are-my-snps-found-1000-genomes-project
---
                    
This can be done using [Ensembl's Biomart](http://www.ensembl.org/biomart/martview).

This [YouTube](http://www.youtube.com/watch?v=paC3sOANSJA&feature=youtu.be) video gives a tutorial on how to do it.

The basic steps are:

1.  Select the *Ensembl Variation* Database
2.  Select the *Homo sapiens Short Variants (SNPs and indels excluding flagged variants)* dataset
3.  Select the *Filters* menu from the left hand side
4.  Expand the *General Variant Filters* section
5.  Check the *Filter by Variant Name (e.g. rs123, CM000001) [Max 500 advised]* box
6.  Add your list of rs numbers to the box or browse for a file which contains this list
7.  Click on the *Results* Button in the headline section
8.  This should provide you with a table of results which you can also download in Excel or CSV format

If you would like the coordinates on GRCh38, you should use the [main Ensembl site](http://www.ensembl.org/biomart/martview/), however if you would like the coordinates on GRCh37, you should use the [dedicated GRCh37 site](http://grch37.ensembl.org/biomart/martview).
