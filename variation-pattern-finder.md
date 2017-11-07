---
layout: single_section
title: "Variation Pattern Finder"
permalink: /variation-pattern-finder/
---

# Variation Pattern Finder

This is documentation about our [Variation Pattern Finder]({{site.browser_url}}/Homo_sapiens/UserData/VariationsMapVCF) tool

[About](#bout)  
[Input Data Formats](input-data-formats)  
[Finder Interface](#finder-interface)  
[Output Formats](#output-format)  
[Using the tool with other data](#own-data)  
[Additional Info](#additional-info)  
[API Script](#api-script)

## About

The variation data discovered by the 1000 genomes project are organised in VCF files. The Variation Pattern Finder allows one to look for patterns of shared variation between individuals in the same vcf file. To be more specific, in any user-specified chromosomal regions, different samples would have different combination of variations. The finder looks for distinct variation combinations within the region, as well as individuals associated with each variation combination pattern. The finder only focuses on variations that change protein coding sequences such as non-synonymous coding SNPs, splice site changes.

## Input

You can access the online version of the [variation pattern finder tool](http://grch37.ensembl.org/Homo_sapiens/Tools/VariationPattern?db=core) from the tools link in the menu bar at the top of every page in the [Ensembl GRCh37 browser](http://grch37.ensembl.org/).

The input interface of the online version looks like:

![VPF input field](variation_pattern_finder_input.png "VPF input")

The tool allows you to pick which phase of the 1000 Genomes Project you want to get data from. If you have a publicly visible VCF file, corresponding tabix index (.tbi) and a corresponding sample-population mapping file in the same folder, you could get data from these by selecting "Provide file URLs".

The pattern finder must be given a genomic interval to search within. For the web-based tool we recommend an interval shorter than 5 Mb to ensure the tool returns in a reasonable time frame.

## Finder Interface

The [interface for the Finder]({{site.browser_url}}/Homo_sapiens/UserData/VariationsMapVCF) can be navigated to either from the [tools]({{site.browser_url}}/tools.html) link which should be in the top right hand corner of each page below the logo or on any view page via the "Manage your data" link in the left hand menu.

When you read the pattern finders interface you will be presented with a form in which to enter your data. The form itself has 3 input boxes

*   VCF File URL: This should be the http or ftp url for the location of the vcf file. The vcf file needs to have a tabix index in the same location. By default, the finder uses the most up-to-date 1000 genomes project data release as variation VCF input.
*   Sample Population Mapping URL: This again should be a http or ftp url to the location of the sample mapping file. This file should be in the text format as described above. By default, the finder uses the sample-population mapping associated with the latest data release as input.
*   Region: This should be the genomic location you wish to view. This works best with regions of less than 500bp as the number of variation patterns is more manageable.

## Output Format

The Finder offers a collapsed view and an expanded view. The collapsed view does not distinguish sites of homozygous reference with those with no data, therefore the number of distinctive combinations of variations is minimized; it offers a simplified and clear variation landscape in the region. The expanded view treats homozygous reference sites and no genotype data sites differently; allows one to see the data with more accuracy. The two views have the same layout as explained below.

The picture shows a snapshot of a result page. The right shows the functional variations found in the region with individual genotypes; the variations are sorted by chromosomal coordinate and the functional consequences of them are annotated in the headers. The right panel shows individual samples carrying each combination of variations, organized by population. The panels can be scrolled to view more data. The results can be exported in either csv or Excel format. Sections annotated by <span style="color: #ff0000;">red</span> numbers are described in greater details below.

![screen shot of variation pattern finder output](/sites/1000genomes.org/files/resize/documents/vpf_shot-730x351.jpg "variation pattern finder output")

1.  Variation Header:
    *  line 1, variation rs number and the reference allele for the site, separated by ":". When rs number is not available, chromosomal position of the site is given.
    *  line 2, chromosome and chromosomal position of the variation, separated by ":"
    *  line 3 and more, functional consequences of the SNP on transcript specified, one transcript per line. When it is non-synonymous coding, the amino acid changes are also displayed.

2.  Freq column: it gives the frequency of the given variant genotype combination in the file
3.  Sample panel: it displays the first 2 samples for a particular population who have this pattern of variation and the heading shows which population that sample group is from
4.  Genotype Panel: this is the individual genotypes as given by the VCF file. Please note if the delimiter symbol is \| this means the genotype is phased; otherwise un-phased. "./." in the expanded view represents sites with no genotype data. "-" in the collapsed view represent genotypes that are either homozygous reference or no data.
5.  View Switch: this allows you to switch between the collapsed view and expanded view.
6.  Export: results can be saved as Excel or CSV files.


## Using the Variation Pattern Finder with other data

The Variation Pattern Finder will work with any publicly visible remove (over http or ftp) vcf file which also has a tabix index. For more information about creating tabix indexes please look at [Tabix: fast retrieval of sequence features from generic TAB-delimited files](http://bioinformatics.oxfordjournals.org/content/27/5/718.short?rss=1) for more information about creating these indexes.

## Additional Info

In addition to use the Finder to mine the VCF file, you may look into a VCF file directly. Rather than download the entire VCF file for the whole genome, you may slice out the piece of VCF file that contains data in a user-specified chromosomal region using another tool called Data Slicer. Data Slicer can also slice BAM files. Please see more instruction [here](/wiki/DCC/data-slicer-documentation).

## API Script

You can also find a perl script version of this tool [on the ftp site](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/browser/variation_pattern_finder/version_1.0/) and documentation [here](/variation-pattern-finder-api-documentation)
