---
layout: single_section
title: "Phase 3 structural variant dataset"
permalink: /phase-3-structural-variant-dataset/
tags: Phase 3 structural variant dataset
---
#The phase 3 structural variant dataset

The 1000 Genomes Project SV group produced an expanded dataset of structural variation for the individuals in phase 3 of the 1000 Genomes Project.

The VCF files for the SV dataset in GRCh37 coordinates can be found in [ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/integrated_sv_map/](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/integrated_sv_map/). This directory contains a [README](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/integrated_sv_map/README_phase3_sv_callset_20150224) which explains the contents of the VCF files and supporting information, and provides a complete list of the differences between the 1000 Genomes Project Consortium Phase 3 paper and the Structural Variation Consortium Companion paper.

The 1000 Genomes Structural Variation dataset is built and validated on several different raw datasets.

{: .table .table-striped}
| Type | Archive accession | Data on the FTP site |
|:----:|:-----------------:|:--------------------:|
| Short-read Illumina WGS sequencing | * | [phase3/20130502.phase3.analysis.sequence.index](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/20130502.phase3.analysis.sequence.index) |
| Complete Genomics WGS sequencing | * | [phase3/20130725.phase3.cg_sra.index](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/20130725.phase3.cg_sra.index) |
| PCR-free Illumina WGS sequencing | [SRP047053](http://www.ebi.ac.uk/ena/data/view/SRP047053) | [release/20130502/../high_.._alignments/20141118_high_coverage.alignment.index](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/supporting/high_coverage_alignments/20141118_high_coverage.alignment.index) |
| Moleculo WGS NA12878 | | [phase3/integrated_sv_map/supporting/NA12878/moleculo](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/integrated_sv_map/supporting/NA12878/moleculo/) |
| PacBio sequencing NA12878 | [SRX638310](http://www.ncbi.nlm.nih.gov/sra/SRX638310/) | [phase3/integrated_sv_map/supporting/NA12878/pacbio](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/integrated_sv_map/supporting/NA12878/pacbio/) |
| PacBio sequencing CHM1 | [SRX533609](http://www.ncbi.nlm.nih.gov/sra/SRX533609) | [phase3/integrated_sv_map/supporting/CHM1](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/integrated_sv_map/supporting/CHM1/pacbio/) |
| Agilent 1M aCGH microarray | [GSE70188](http://www.ncbi.nlm.nih.gov/bioproject/?term=GSE70188) | [phase3/integrated_sv_map/supporting/acgh/](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/integrated_sv_map/supporting/acgh/) |
| Illumina Omni2.5 microarray | | [release/20130502/supporting/hd_genotype_chip/](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/supporting/hd_genotype_chip/) |
| Affymetrix SNP Array 6.0 | | [release/20130502/supporting/hd_genotype_chip/coriell_affy6_intensities/](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/supporting/hd_genotype_chip/coriell_affy6_intensities/) |
| Targeted PacBio sequencing | [ERS661321](http://www.ebi.ac.uk/ena/data/view/ERS661321), [ERS661355](http://www.ebi.ac.uk/ena/data/view/ERS661355), [ERS661356](http://www.ebi.ac.uk/ena/data/view/ERS661356), [ERS661358](http://www.ebi.ac.uk/ena/data/view/ERS661358)+ | |
| Targeted MinION sequencing | [ERS661358](http://www.ebi.ac.uk/ena/data/view/ERS661358), [ERS661406](http://www.ebi.ac.uk/ena/data/view/ERS661406)+ | |

* Rows with '*' represent many differents archive runs, experiments and accessions. A full set or archive accessions can be found in the index files the FTP links point to.
* Rows with '+' were all submitted together under the same study [ERP009552](http://www.ebi.ac.uk/ena/data/view/ERP009552).

The Phase 3 Structural variants can also be found mapped to GRCh38 coordinates in the FTP directory [ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/integrated_sv_map/supporting/GRCh38_positions/](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase3/integrated_sv_map/supporting/GRCh38_positions/).
