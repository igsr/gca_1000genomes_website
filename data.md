---
layout: single_section
title: "Data"
permalink: /data/
tags: Data
redirect_from:
 - /1000-genomes-browsers/
 - /analysis/
---

# Using data from IGSR

IGSR provides open data to support the community's research efforts. You can see our terms of use in our [data disclaimer](/IGSR_disclaimer). Please also consult the associated data reuse statements and cite associated publications appropriately. To cite IGSR, please use our [NAR paper](https://academic.oup.com/nar/article/45/D1/D854/2770649).

#Explore the data sets in IGSR through our [data portal](/data-portal)  

IGSR shares data files from many studies via our FTP site. To make it easier to find the files you want, we present key data sets in our [data portal](/data-portal).

Files can be browsed by:

* sample (i.e. NA12878)
* population (i.e. Yoruba in Ibadan, Nigeria)
* technology (i.e. PacBio HiFi)
* data type (i.e. alignment)
* collection (i.e. 1000 Genomes Project phase three)

Our portal provides an [overview of the available collections and their associated publications](https://www.internationalgenome.org/data-portal/data-collection).
 
#View variants in genomic context in [EnsEMBL](https://www.ensembl.org/index.html)

IGSR works alongside the [EnsEMBL genome browser](https://www.ensembl.org/index.html). EnsEMBL presents some of the key call sets in IGSR, placing the variation data in genomic context and adding up-to-date annotation of the variant data in their displays for [individual variations](https://www.ensembl.org/Homo_sapiens/Variation/Explore?r=1:230709548-230710548;v=rs699;vdb=variation;vf=94).

In EnsEMBL you can:

* Browse the 1000 Genomes Project phase three call set on [GRCh37](https://www.ensembl.org/info/website/tutorials/grch37.html)
* Browse data from the 1000 Genomes Project samples and other data sets on [GRCh38](https://www.ensembl.org/Homo_sapiens/Info/Index)
* View data for a [specific variation](https://www.ensembl.org/Homo_sapiens/Variation/Explore?r=1:230709548-230710548;v=rs699;vdb=variation;vf=94) and search by rsID
* View [population frequency](https://www.ensembl.org/Homo_sapiens/Variation/Population?db=core;r=1:230709548-230710548;v=rs699;vdb=variation;vf=94) data
* Use a selection of [tools](https://www.ensembl.org/Homo_sapiens/Variation/Population?db=core;r=1:230709548-230710548;v=rs699;vdb=variation;vf=94) to retrieve subsets of data, convert VCF to PED and calculate linkage disequilibrium

#<a name="download"></a>Download data from the IGSR [FTP site](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/)

The full set of files hosted by IGSR are available on our [FTP site](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/). This includes data shared pre-publication and intermediate and working data for projects where we contribute to the project's data management. A set of README files provides additional information.

The data can be downloaded via FTP, Aspera and Globus GridFTP. More information about using Aspera or Globus can be found in our FAQ.

[How to download files using Aspera](/faq/how-download-files-using-aspera)  
[How to download files using Globus](/faq/can-i-access-1000-genomes-data-globus-online)

####FTP Hierarchy

The FTP structure was changed in September 2015. The revised structure is described in the [FTP site structure README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README_ftp_site_structure.md). 

####Other data sources

During the main 1000 Genomes Project, the NCBI acted as a mirror of the EBI hosted 1000 Genomes Project FTP site and also uploaded alignments and variant calls to an Amazon S3 bucket. This mirroring process stopped in September 2015. The NCBI FTP site and the Amazon S3 bucket still host 1000 Genomes Project data but no longer mirror new data. Both these locations reflect the structure of the FTP site in August 2015 and hold all the pilot, phase 1 and phase 3 data. NCBI and Amazon do not hold new alignments based on GRCh38, the current reference genome.

NCBI FTP Site : [ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp)  
Amazon S3 : [s3://1000genomes](denied:s3://1000genomes)

Information on Amazon Web Services can be found on 1000 Genomes [public data set page](http://aws.amazon.com/datasets/4383) or directly on [http://s3.amazonaws.com/1000genomes](http://s3.amazonaws.com/1000genomes).

For a small number of newer data sets, data has been added to AWS and AnVIL. Where this is the case, this is mentioned in our portal.




