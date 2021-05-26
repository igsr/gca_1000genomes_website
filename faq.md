---
layout: single_section
title: "FAQ"
permalink: /faq/
tags: FAQ
exclude_from_search: true
redirect_from:
    - /node/503/
faq_category_1:
    - "How were the populations defined?"
    - "Where were the sampling locations?"
    - "Do you have any ancient or prehistoric genomes?"
    - "Have you calculated linkage disequilibrium from these variants?"
    - "What are the phases of 1000 Genomes and how do I access the data from them?"
    - "Do you have assembled FASTA sequences for samples?"
    - "Can I query IGSR programmatically?"
    - "Can I get phased genotypes and haplotypes for the individual genomes?"
    - "Can I get phenotype, gender and family relationship information for the individuals?"
    - "Is there gene expression and/or functional annotation available for the samples?"
    - "What types of genotyping data do you have?"
    - "Are there any genomic regions that have not been studied?"
    - "Do you have structural variation data?"    
faq_category_2:
    - "About VCF variant files"
    - "About FASTQ sequence read files"
    - "About alignment files (BAM and CRAM)"
    - "About index files"
    - "About variant identifiers"
    - "How are allele frequencies calculated?"
    - "Where can I find a list of the sequencing and analysis done for each individual?"
faq_category_3:
    - "Why are there chr 11 and chr 20 alignment files, and not for other chromosomes?"
    - "Were the same analysis tools used for every sample in one data collection?"
    - "Are the variant calls in IGSR phased?"
    - "What methods were used for generating alignments?"
    - "How was imputation used in 1000 Genomes to fill in gaps in sequencing?"
    - "What sequencing platforms and methods were used by different projects within IGSR?"
    - "How was exome and exon targetted sequencing used?"
    - "Was HLA Diversity studied in IGSR?"
    - "What is the coverage depth?"
    - "What was the source of the DNA for sequencing?"    
    - "How do you calculated ancestral alleles?"
    - "Which populations are part of your study?"
    - "Which reference assembly do you use?"
    - "Why are there differences between the different analyses of the 1000 Genomes samples?"
faq_category_4:
    - "Is there any fee associated with using and/or reproducing the data?"
    - "Can I get cell lines for IGSR samples?"
    - "Can I use the IGSR data for imputation?"
    - "Do I need a password to access IGSR data?"
    - "Do I need permission to use IGSR data in my own scientific research?"
    - "How do I find out about new releases?"
    - "Can I map your variant coordinates between different genome assemblies?"
    - "How do I cite IGSR?"
faq_category_5:
    - "Can I volunteer to be part of the 1000 genomes project?"
    - "How do I contact one of the individuals whose genome you have sampled?"
    - "Help me to interpret or understand more about my personal genomics data."
    - "Help me to interpret or understand more about a genetic disease diagnosis."
faq_category_6:
    - "How can I get VCFs of a single population or individual?"
    - "How can I get all variants in a particular gene?"
    - "How can I get gene sequences for individuals?"
    - "Are the IGSR variants available in dbSNP?"
    - "What tools can I use to download IGSR data?"
    - "Can I BLAST against the sequences in IGSR?"
    - "How do I find out information about a single variant?"
    - "How do I get a genomic region sub-section of your files?"
    - "Are the IGSR variants available in genome browsers?"
    - "How do I find specific alignment files?"
    - "How do I find specific variant files?"
    - "How do I find specific sequence read files?"
    - "How do I find the reference genomes files?"
    - "Where can I get consequence annotations for the IGSR variants?"
    - "How do I find the most up-to-date data?"
    - "Can I convert VCF files to PLINK/PED format?"    
    - "Can I search the website?"
faq_category_7:
    - "Why are there gaps in the X and Y chromosome?"
    - "Is the sequencing data in IGSR contaminated with mycoplasma?"
    - "Why are the coordinates of some variants different to what is displayed in other databases?"
    - "Why are there duplicate calls in the phase 3 call set?"
    - "Why is the allele frequency different from allele count/allele number?"
    - "Why can't I find one of your variants in another database?"
    - "There is a corrupt file on your ftp site."
    - "Why do some of your vcf genotype files have genotypes of ./. in them?"
    - "Why do some variants in the phase1 release have an zero Allele Frequency?"
    - "Why does a tabix fetch fail?"
faq_category_8:
    - "How do I find the familial relationships between the individuals?"
    - "Do you have any job vacancies?"
    - "Which datasets include related individuals?"
    - "Does the 1000 Genomes Project use HapMap data?"
    - "How do I contact you?"
    - "Are there any statistics about how much sequence data is in IGSR?"
    - "How many individuals have been sequenced in IGSR projects and how were they selected?"
    - "What are the different data collections available for 1000 Genomes?"
    - "What do the population codes mean?"
    - "How do I navigate the FTP site to find the files I need?"
    - "What are your filename conventions?"
---

## {{page.title}}

This is the FAQ from the 1000 Genomes Project. This list of questions is not exhaustive. If you have any other questions you can't find the answer to please email [info@1000genomes.org](mailto:info@1000genomes.org) to ask.

<!--
IGSR 519 - Update website FAQ
Author: ranjits@ebi.ac.uk
Date: 02 April 2021
-->

{% assign sorted_faq = (site.faq | sort: 'title') %}
<!--Add categories to main FAQ page-->

### What data do you have?
<ul style="PADDING-LEFT: 30px"> 	<!--Add indent to bullet list-->
{% for faq in sorted_faq %}
{% for title_in_category in page.faq_category_1 %}
{% if faq.title  contains title_in_category %}
<li><a href="{{faq.url}}">{{faq.title}}</a></li>{% endif %}{% endfor %}{% endfor %}
</ul>

### What data format?	
<ul style="PADDING-LEFT: 30px"> 	<!--Add indent to bullet list-->
{% for faq in sorted_faq %}
{% for title_in_category in page.faq_category_2 %}
{% if faq.title  contains title_in_category %}
<li><a href="{{faq.url}}">{{faq.title}}</a></li>{% endif %}{% endfor %}{% endfor %}
</ul>

### How did you process the data?	
<ul style="PADDING-LEFT: 30px"> 	<!--Add indent to bullet list-->
{% for faq in sorted_faq %}
{% for title_in_category in page.faq_category_3 %}
{% if faq.title  contains title_in_category %}
<li><a href="{{faq.url}}">{{faq.title}}</a></li>{% endif %}{% endfor %}{% endfor %}
</ul>

### Working with the data	
<ul style="PADDING-LEFT: 30px"> 	<!--Add indent to bullet list-->
{% for faq in sorted_faq %}
{% for title_in_category in page.faq_category_4 %}
{% if faq.title  contains title_in_category %}
<li><a href="{{faq.url}}">{{faq.title}}</a></li>{% endif %}{% endfor %}{% endfor %}
</ul>

### My data vs 1000 Genomes Project
<ul style="PADDING-LEFT: 30px"> 	<!--Add indent to bullet list-->
{% for faq in sorted_faq %}
{% for title_in_category in page.faq_category_5 %}
{% if faq.title  contains title_in_category %}
<li><a href="{{faq.url}}">{{faq.title}}</a></li>{% endif %}{% endfor %}{% endfor %}
</ul>

### How to get the data?	
<ul style="PADDING-LEFT: 30px"> 	<!--Add indent to bullet list-->
{% for faq in sorted_faq %}
{% for title_in_category in page.faq_category_6 %}
{% if faq.title  contains title_in_category %}
<li><a href="{{faq.url}}">{{faq.title}}</a></li>{% endif %}{% endfor %}{% endfor %}
</ul>

### Data problems?	
<ul style="PADDING-LEFT: 30px"> 	<!--Add indent to bullet list-->
{% for faq in sorted_faq %}
{% for title_in_category in page.faq_category_7 %}
{% if faq.title  contains title_in_category %}
<li><a href="{{faq.url}}">{{faq.title}}</a></li>{% endif %}{% endfor %}{% endfor %}
</ul>

### About
<ul style="PADDING-LEFT: 30px"> 	<!--Add indent to bullet list-->
{% for faq in sorted_faq %}
{% for title_in_category in page.faq_category_8 %}
{% if faq.title  contains title_in_category %}
<li><a href="{{faq.url}}">{{faq.title}}</a></li>{% endif %}{% endfor %}{% endfor %}

<!--Commented below lines of code--> 
<!--
{% assign sorted_faq = (site.faq | sort: 'title') %}
{% for faq in sorted_faq %}
* [{{ faq.title }}]({{ faq.url }}){% endfor %}
--> 
<!--END OF IGSR 519 - Update website FAQ--> 
