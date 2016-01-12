---
layout: single_section
title: "tools"
permalink: /tools/
nav_buttons:
    - announcements
    - files_formats
    - software_tools
    - pilot_paper
    - contacts
---

# Software Tools

Major tools used by the 1000 Genomes Project to process data are detailed on this page. Many tools may be published and are certainly in active development and it is possible that for many tools the most current version downloaded from the developers web sites is up dated from the version that was used to create the relevant 1000 Genomes release files.

## Recalibration

Quality scores form mulitple centers and platforms must be callibrated for data to be used together for combined analysis. For example, due to a number of experimental and technical valiables, bases with reported quality of Q25 may actually mismatch the reference at a rate of 1 in 1000 and so should be recorded as Q30\. The recalibration procedure aligns reads from a given run, determines the empirical mismatch rates and produces re-calibrated quality values from the analysis.

The recalibration tool used by the 1000 Genomes project is imbedded in the [Genome Analysis Tool Kit](http://www.broadinstitute.org/gsa/wiki/index.php/The_Genome_Analysis_Toolkit) (GATK) developed by the Broad Institute.

Further information on the recalibration tool and how it is used is avalibale [here](http://www.broadinstitute.org/gsa/wiki/index.php/Quality_scores_recalibration).

## Alignment

The 1000 Genomes Pilot Project used the following alignment programs:

*   MAQ: [[Pubmed](http://www.ncbi.nlm.nih.gov/pubmed/18714091)] [[Homepage/Source Code](http://maq.sourceforge.net/)]
*   MOSAIK [[Homepage/Source code](http://bioinformatics.bc.edu/marthlab/Mosaik)]
*   SSAHA2 [[Pubmed](http://www.ncbi.nlm.nih.gov/pubmed/11591649)] [[Homepage/Source code](http://www.sanger.ac.uk/resources/software/ssaha/)]
*   Corona lite [[Homepage/Source code](http://solidsoftwaretools.com/gf/project/corona/)]
*   cross_match [[Homepage/Source code](http://www.phrap.org/phredphrapconsed.html)]

For pilots 1 and 2, MAQ was used to align Illumina data, Corona lite was used to align SOLiD data and SSAHA2 for 454 data. All pilot 3 data was aligned MOSAIK. Depending on the production center, other pilot 3 data was aligned with SSAHA2, cross_match, MAQ or Corona lite.

The 1000 genomes full project is using the following aligners:

*   BWA: [[Pubmed](http://www.ncbi.nlm.nih.gov/pubmed/20080505)] [[Homepage/Source Code](http://bio-bwa.sourceforge.net/)]
*   BFAST: [[Pubmed](http://www.ncbi.nlm.nih.gov/pubmed/19907642)] [[Homepage/Source Code](http://sourceforge.net/apps/mediawiki/bfast/index.php?title=Main_Page)]
*   MOSAIK: [[Homepage/Source code](http://bioinformatics.bc.edu/marthlab/Mosaik)]

For the low coverage project the low coverage Illumina runs are aligned independently using both BWA and MOSAIK and the SOLiD runs are aligned using BFAST

## Assembly

Efforts to create _de novo_ assemblies of 1000 Genomes data are currently underway, but no assemblies have been released by the project.

The Gerstein Lab at Yale University has created a version of the NA12878 genome based on NCBI build 36 and incororating SNPs, indels and SVs identified by the 1000 Genomes project. This genome sequence is available at [http://sv.gersteinlab.org/NA12878_diploid](http://sv.gersteinlab.org/NA12878_diploid). Users of this assembly are requested to cite: Rozowsky J et al._Coordination between Allele Specific Expression and Binding in a Network Framework. (submitted)_

## SNP calling

*   GATK: [[Pubmed](http://www.ncbi.nlm.nih.gov/pubmed/20644199)] [[Homepage/Source code](http://www.broadinstitute.org/gsa/wiki/index.php/The_Genome_Analysis_Toolkit)]
*   GlfMultiples: [[Homepage/Source code](http://genome.sph.umich.edu/wiki/GlfMultiples)]
*   FreeBayes: [[Homepage/Source code](https://github.com/ekg/freebayes)]
*   bcftools/mpileup: [[Homepage/Source code](http://samtools.sourceforge.net/mpileup.shtml)]

## CNV discovery

## Phasing

