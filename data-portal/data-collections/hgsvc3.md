---
layout: angularjs_partial
---

<center>
<img src="/sites/1000genomes.org/files/images/HGSVC_logo_v5.png" width="500" height="300">
</center>

The Human Genome Structural Variation Consortium ([HGSVC](https://www.hgsvc.org/)), funded by NHGRI, have built on their earlier work published in [2019](https://pubmed.ncbi.nlm.nih.gov/30992455/) and [2021](https://science.sciencemag.org/content/early/2021/02/24/science.abf7117) exploring multiple technologies for genome sequence assembly and structural variation discovery.

HGSVC have constructed and analysed complete haplotype sequences, including fully resolved centromeres and segmental duplications, from 65 individuals of diverse ancestries. This forms the first population-scale set of human genome assemblies resolved to near T2T completeness. 

This work is described in [Logsdon, Ebert, Audano, Loftus et al.](https://www.biorxiv.org/content/10.1101/2024.09.24.614721v1)

Results include:

* [Variants](https://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections//HGSVC3/release/Variant_Calls/) called using PAV against both GRCh38 and T2T-CHM13
* [Genotypes](https://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections//HGSVC3/release/Genotyping_1kGP/) extracted using Pangenie and Locityper, with respect to T2T-CHM13
* [Mobile Element Insertions](https://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections//HGSVC3/release/Mobile_Elements/1.0/README.20240918.MEI.txt) called against both the GRCh38 and T2T-CHM13
* [Segmental duplication](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/HGSVC3/release/Segmental_Duplications) detected using Sedef
* [Assembly information](https://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/HGSVC3/release/Assembly_Info/) including QC metics
* [Centromere locations](https://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections//HGSVC3/release/Centromeres/) in the assemblies
* [Genome graphs](https://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections//HGSVC3/release/Graph_Genomes) generated using Minigraph-Cactus 


Files can be browsed by sample, population and data type below. The IGSR FTP and Globus sites host [released data, key resources](https://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/HGSVC3/release/) and [working](https://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/HGSVC3/working/) data. This data can be reached through the public Globus endpoint `EMBL-EBI Public Data` in `/1000g/ftp/data_collections/HGSVC3/` (see `release` and `working` directories for respective data).
