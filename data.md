---
layout: single_section
title: "Data"
permalink: /data/
tags: Data
---

#Using data from IGSR (test5)

IGSR provides open data to support the community's research efforts. You can see our terms of use in our [data disclaimer](/IGSR_disclaimer).

#[Data portal](/data-portal)  
We have developed a [data portal](/data-portal) to make it easier to find and browse data in IGSR. Let us know what you think at info@1000genomes.org.
 
[![data portal image](/sites/1000genomes.org/files/images/portal.png)](/data-portal)



#Available data

##1000 Genomes Project

{: .table .table-striped}
| 1000 Genomes Release | Variants |	Individuals	| Populations |	VCF	| Alignments |	Supporting Data |
|:--------------------:|:--------:|:-----------:|:-----------:|:---:|:----------:|:---------------:|
|Phase 3 | 84.4 million | 2504 | 26 | [VCF](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/) | [Alignments](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3) | [Supporting Data](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/supporting/) |
|Phase 1 | 37.9 million | 1092 | 14 | [VCF](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/) | [Alignments](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/data/) | [Supporting Data](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/) |
| Pilot | 14.8 million | 179 | 4 | [VCF](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/paper_data_sets/a_map_of_human_variation/low_coverage) | [Alignments](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/data) | [Supporting Data](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/paper_data_sets/a_map_of_human_variation/) |



## Lists of samples from the 1000 Genomes Project

A summary of sequencing done for each of the three pilot projects is available [here](/sites/1000genomes.org/files/docs/PilotsSummary.pdf). 

The list of samples collected by the project and what sequence data or other assay data that has been generated for them is available in this [spreadsheet](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/working/20130606_sample_info/20130606_sample_info.xlsx).

## Variant Calls

Our variant calls are always released in [VCF format](https://samtools.github.io/hts-specs/). The released calls from the final phase of the 1000 Genomes Project can be found in the release directory for 2nd May 2013 on the [EBI FTP site](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502).

## Alignments

Alignments are available in [BAM or CRAM](https://samtools.github.io/hts-specs/) format. Within IGSR, data are grouped in data collections, such as the [1000 Genomes Project](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000_genomes_project/) or the [Illumina Platinum Genomes](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/illumina_platinum_pedigree/). A list of the alignment files currently available for a given data collection can be found in the alignment index  for that collection on the [EBI FTP site](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/). Information on the contents of the index file can be found in the file header.

## Raw sequence files

Sequence data is available from the ENA. A list of files currently available can be found in the sequence.index file for each data collection on the [EBI FTP site](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/). These files contain the FTP url for each sequence fastq file, as well as other metadata information about the sequencing run and file. More information on the contents of the index file can be found in the file header.

## Sample Availability

All the samples studied by the 1000 Genomes Project are available as DNA and cell lines to scientific investigators for research projects. Samples are currently available from the non-profit [Coriell Institute for Medical Research](http://ccr.coriell.org/sections/Collections/NHGRI/hapmap.aspx?PgId=266&coll=GM). Details of the population collections available from Coriell can be found on the [cell lines and DNA page](/cell-lines-and-dna-coriell)

# How to Access Data

## Browse data

Data from the 1000 Genomes Project can be viewed in genomic context in genome browsers. Further details about browsing the data in this way can be found [here](/1000-genomes-browsers).

##<a name="download"></a>Download data

The data contained in IGSR can be downloaded from the FTP site hosted at the EBI [ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/).

The data can be downloaded via FTP, Aspera and Globus GridFTP. More information about using Aspera or Globus can be found in our FAQ.

[How to download files using Aspera](/faq/how-download-files-using-aspera)  
[How to download files using Globus](/faq/can-i-access-1000-genomes-data-globus-online)

####FTP Hierarchy

The FTP structure was changed in September 2015. The new structure is described in the [FTP site structure README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README_ftp_site_structure.md). 

During the main 1000 Genomes project, the NCBI acted as a mirror of the EBI hosted 1000 Genomes FTP site and also uploaded alignments and variant calls to an Amazon S3 bucket. This mirroring process stopped in September 2015. The NCBI FTP site and the Amazon S3 bucket still host 1000 Genomes data but no longer mirror new data. Both these locations reflect the structure of the FTP site in August 2015 and hold all the pilot, phase 1 and phase 3 data. NCBI and Amazon do not hold new alignments based on GRCh38, the current reference genome.

NCBI FTP Site : [ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp)  
Amazon S3 : [s3://1000genomes](denied:s3://1000genomes)

Information on Amazon Web Services can be found on 1000 Genomes [public data set page](http://aws.amazon.com/datasets/4383) or directly on [http://s3.amazonaws.com/1000genomes](http://s3.amazonaws.com/1000genomes).






