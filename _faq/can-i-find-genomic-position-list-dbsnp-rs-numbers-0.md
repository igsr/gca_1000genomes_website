---
layout: faq
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
                    
This is not a service that the 1000 genomes project provides itself but it is a query you can do with [Ensembl Biomart](http://www.ensembl.org/biomart/martview){:target="_blank"}.

This [youtube](http://www.youtube.com/watch?v=paC3sOANSJA&feature=youtu.be){:target="_blank"} video gives a tutorial on how to do it

The basic steps are:

1.  Select the Ensembl Variation Database
2.  Select the Homo Sapiens Variation (dbSNP) dataset
3.  Select the Filters menu from the left hand side
4.  Select the General Variation Filters section
5.  Check the Filter by Variation ID box
6.  Add your list of rs numbers to the box or browse for a file which contains this list.
7.  Click on the Results Button in the headline section
8.  This should provide you with a table of results which you can also download in excel or csv format.
