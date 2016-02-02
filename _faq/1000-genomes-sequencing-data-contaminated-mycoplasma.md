---
title: "Is the 1000 Genomes sequencing data contaminated with mycoplasma?"
faq_tags:
  - data-analysis
  - mycoplasma
  - quality-control
faq_related:
  - are-there-any-statistics-about-how-much-sequence-data-has-been-generated-project
  - what-sequence-index-file
---
                    
William Langdon published in [April 2014 in BioData Mining](http://www.biodatamining.org/content/7/1/3){:target="_blank"} about mycoplasma reads in the 1000 Genomes sequencing data. He tested 2% of the total runs produced by the project (3982/187720) and found 7% of them (269/3982) to be contamintated with mycoplasma. A full description of the analysis can be found in his [paper](http://www.biodatamining.org/content/7/1/3){:target="_blank"}.

A full list of the runs Langdon tested and their contamination status can be found on [our FTP site](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/working/20140508_langdon_mycoplasma_test/).

We recognise that there are mycoplasma sequence reads in some of the 1000 Genomes Project raw data sets but we do not believe that they have affected any of the published results and analyses, nor the use of data from the project by additional users.

The primary outcome from the 1000 Genomes Project is a collection of more than 35 million human genetic variants. These are obtained from reads that map to the human reference genome. As Langdon points out, the mycoplasma reads identified by Langdon do not map to the human reference genome, so they do not contaminate the results on human genetic variation. The 1000 Genomes Project makes its raw data sets available for reanalysis, and the complete read sets include mycoplasma reads, as well as reads from Epstein-Barr virus (EBV) and potentially from other non-human organisms that may have been present in the starting material. However the project also makes aligned data sets available and the vast majority of users only examine the reads aligned to the human reference, along with the inferred individual genome sequences derived from them. We make all the original raw data available as a matter of policy, both for transparency with respect to our data processing, and also to support those who would like to examine additional technical or biological phenomena that can be derived from the data.

Most of the DNA used for 1000 Genomes Project sequencing was obtained from immortalised cell lines and, although mycoplasmal infection of laboratory cell lines is undesirable, it is not a great surprise that some of these had mycoplasma infections, especially given that some of the cell lines and DNA were prepared a long time ago.
