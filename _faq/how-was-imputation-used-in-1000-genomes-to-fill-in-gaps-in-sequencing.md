---
title: "How was imputation used in 1000 Genomes to fill in gaps in sequencing?"
faq_tags:
  - data-analysis
  - depth
  - imputation
  - variants
faq_related:
  - how-are-allele-frequencies-calculated
  - why-is-the-allele-frequency-different-from-allele-countallele-number
redirect_from:
    - /faq/what-does-individual-have-genotype-location-where-it-has-no-sequence-coverage/
    - /faq/which-your-phase1-variant-sites-have-imputed-genotypes/
---

In the original phase 1 and 3 sequencing of the 1000 Genomes individuals, many genomes were only sequenced in full at low coverage, so some individuals some genotypes will be based on imputation.  

This means that if an individual has no coverage at a particular location but overall we have been able to determine there is variation at that location then we can statistically infer the genotype for that variant in that individual using haplotype information. This means we are able to provide complete haplotypes for all the variation we discover.

The process used to create our genotypes first gave our merged sites and genotype likelihoods sets to [Beagle](http://faculty.washington.edu/browning/beagle/beagle.html) to generate initial haplotypes (using 50 interations across all samples) and these were refined using a modified version of [Thunder](http://genome.sph.umich.edu/wiki/Thunder) (it used 300 states chosen by longest matching haplotype at each iteration in addition to 100 randomly chosen states).  

This process means we are unable to precisely identify which sites used imputation to generate their genotype. Without this process the approximate error rate for our heterozygous sites would be 20% so you can estimate that 20% of our heterozgous sites will have been changed on the basis of imputation. The sites covered by our exome sequencing represent our highest accuracy sites and these are the least likely to have been changed by this process. The converse is also true any site without any sequence alignment will have been imputed. You can find the [depth of coverage at any site](/faq/what-depth-coverage-your-phase1-variants) using our bam files. Other sites may have been given greater evidence on the basis of the imputation and refinement process.  

You can find out more about this in our [Phase 1 paper](/announcements/integrated-map-genetic-variation-1092-human-genomes-2012-10-31).
