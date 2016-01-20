---
layout: single_section
title: "Variation Pattern Finder API documentation"
permalink: /variation-pattern-finder-api-documentation/
---

# Variation Pattern Finder API documentation

### INTRODUCTION:

Variation Pattern Finder (VPF) API is a perl script based on a set of perl modules. The script allows one to look for patterns of shared variation between individuals in the same vcf file.  To be more specific, in any user-specified chromosomal regions, different samples would have different combination of variations.  The finder looks for distinct variation combinations within the region, as well as individuals associated with each variation  combination pattern. The finder can handle SNPs, short indels and structural variations (SV). It uses Ensembl annotations to assess  functional consequences of the variants, the assessment method is more mature for SNPs and indels but less so for SVs.  Users have the option to output all variants or functional significant variants (non-synonymous coding, frame-shift etc.).

If the entire input VCF file is phased, the phasing information of any found pattern is accurate. When the input VCF has both phased and unphased variants, it is important to output ALL variants in the region using the -print_all option, in order to interpret accurately the phase in the found pattern ("/" and "\|").  Please see website [http://www.broadinstitute.org/gsa/wiki/index.php/Read-backed_phasing_algorithm](http://www.broadinstitute.org/gsa/wiki/index.php/Read-backed_phasing_algorithm "http://www.broadinstitute.org/gsa/wiki/index.php/Read-backed_phasing_algorithm")

### DOWNLOAD

The script can be downloaded at [ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/browser/variation_pattern_finder/version_1.0](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/browser/variation_pattern_finder/version_1.0)

### DEPENDENCIES

Before you can run the script, the following software packages are required to be installed and their path be put in appropriate $PATH or $PERL5LIB

1.  At least version 65 of the Ensembl Core and Variation APIs and their relevant dependencies to be installed to use the script. See [http://www.ensembl.org/info/docs/api/index.html](http://www.ensembl.org/info/docs/api/index.html) for installation details.

2.  The perl API of VCFtools - Vcf.pm.  Please refer to VCFtools' page for downloading details.  http://vcftools.sourceforge.net/perl_module.html  Once installed, please specify the module paths in the PERL5LIB.

3.  If the script is run using the -cache option, Ensembl variation archvie file needs to be downloaded before hand; see [http://www.ensembl.org/info/docs/variation/vep/vep_script.html#cacheopt](http://www.ensembl.org/info/docs/variation/vep/vep_script.html#cacheopt) for details  Use the -cache_dir option to point to the location of the archive files.

4.  Software 'tabix' needs to be downloaded from [http://sourceforge.net/projects/samtools/files/tabix/](http://sourceforge.net/projects/samtools/files/tabix/; "http://sourceforge.net/projects/samtools/files/tabix/") the path should be put in your $PATH

### REQUIRED INPUT ARGUMENTS

 -vcf Path to a locally or remotely accessible tabix indexed vcf file. The vcf format is a tab delimited format for presenting variation sites and  genotypes data and is described at [http://vcftools.sourceforge.net/specs.html](http://vcftools.sourceforge.net/specs.html "http://vcftools.sourceforge.net/specs.html"). This tool takes both vcf4.0 and vcf4.1 format  files.

-region Chromosomal region in the format of chr:start-end (1:1000000-100500). As the longer the region is, the more distinctive variant  patterns may exist, it is best to work with small regions shorter than several kb.  

-sample_panel_file Path to a tab-delimited file containing sample to population mapping; the file can be either local or remotely accessible. This information  helps to organize the output by population.  A few lines of example is below:

HG00098 GBR     ILLUMINA

HG00100 GBR     ILLUMINA

HG00106 GBR     ILLUMINA

### OPTIONAL INPUT ARGUMENTS

-host Ensembl database host to which you want to connection, default is 'ensembldb.ensembl.org'

-user user name to connect to Ensembl database; default is 'anonymous'

-output_dir Directory where you want the output file be 

-output_file Output file name, if not specified, the script will create output file name based on rule below 

-print_all By default, only variants that change a coding sequence would be considered. If -print_all is set, all variants will be considered. 

-expanded_view By default -expanded_view is OFF and the finder does not distinguish sites of homozygous reference with those with no data,  therefore the number of distinctive combinations of variations is minimized; it offers a simplified and clear variation landscape  in the region. The expanded view treats homozygous reference sites and no genotype data sites differently; allows one to see the  data with more accuracy. 

-cache When database connection is not stable or not desired, the script can be run at -cache mode.  Ensembl variation archive file needs  to be downloaded before hand to run in the cache mode, see [http://www.ensembl.org/info/docs/variation/vep/vep_script.html#cacheopt](http://www.ensembl.org/info/docs/variation/vep/vep_script.html#cacheopt "http://www.ensembl.org/info/docs/variation/vep/vep_script.html#cacheopt") for details

-cache_dir Directory where the Ensembl archive file is

-verbose print progress along the way

-help Print out help menu

### OUTPUT FILE

The output file is a tab delimited file. If user did not specify an output file name, an output file can be found in the output_dir with this naming convention: chr_start-end.txt.  An example is chr17_41256206-41257206.txt.  It has two lines of headers.

Header line 1, chromosome and chromosomal position of the variation, separated by ":", followed by variation rs number and the reference allele in a  square parenthesis.  When rs number is not available, a "." is used instead. example: 17:41256702_rs12345[G] or 17:5123456_.[A] 

Header line 2, functional consequences of the SNP on transcript specified. If multiple transcripts are affected by the variant, they are all  listed. The amino acid change is annotated in a square parenthesis at the end. example: ENST00000461719-NON_SYNONYMOUS_CODING[T/I]

After the first two header lines, the rest are data content. It has a freq column, a genotype section and a sample section.  

**Freq column:** it gives the frequency of the given variant genotype combination in the file

**Genotype section:** this section contains individual genotypes. Each column corresponding to one variant.   By default, "-" represents genotypes that are either homozygous reference or no data. When -expanded_view is set, "./." represents  sites with no genotype data and REF\|REF for homozygous reference sites.  

**Sample section:** This section contains samples that have the given pattern of variants. The samples are organized by population. 

### EXAMPLES

Running the script with database connection to Ensembl database:

    perl ~/ReseqTrack/scripts/variation_data/variant_pattern_finder.pl -vcf ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20110521/ALL.chr14.phase1_integrated_calls.20101123.snps_indels_svs.genotypes.vcf.gz -sample_panel_file ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20110521/phase1_integrated_calls.20101123.ALL.panel -region 14:106329408-106329468 -verbose

Running the script in cache mode and print all variants:

    perl ~/ReseqTrack/scripts/variation_data/variant_pattern_finder.pl -vcf ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20110521/ALL.chr14.phase1_integrated_calls.20101123.snps_indels_svs.genotypes.vcf.gz -sample_panel_file ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20110521/phase1_integrated_calls.20101123.ALL.panel -region 14:106329408-106329468 -verbose -cache -cache_dir /nfs/1000g-work/G1K/work/zheng/.vep/homo_sapiens/65 -print_all

### LICENSE

Copyright (c) 1999-2011 The European Bioinformatics Institute and Genome Research Limited.  All rights reserved.  
This software is distributed under a modified Apache license. For license details, please see  
http://www.ensembl.org/info/about/code_licence.html

### CONTACT

Please email comments or questions to the 1000 genomes project information  list at <info@1000genomes.org>
