---
layout: angularjs_partial
---

The Human Pangenome Reference Consortium [(HPRC)](https://humanpangenome.org/hprc-data-release-2/) is an NIH-funded project that aims to engage scientists and bioethicists in creating a human pangenome reference and resources that represent global human genomic variation. HPRC Release 2 includes sequencing data and high-quality phased genomes from over 200 individuals, a nearly fivefold increase over Release 1. 

Highlights of HPRC Release 2 Sequencing Data:

 * Multiple Data Types: PacBio HiFi, ONT Ultralong, Dovetail/Illumina Hi-C, PacBio Kinnex RNA, and Illumina WGS data are available for over 200 samples.
 * High Coverage: Samples have uniformly high sequencing coverage with 60X PacBio HiFi and 30X Oxford Nanopore over 100kb.
 * Modern and Standardized: All HiFi is basecalled with DeepConsensus, off-instrument for Sequel II and on-instrument for Revio. ONT R9 and R10 data were uniformly basecalled to produce consistent, high-quality reads. Both HiFi and ONT data include 5-methylcytosine predictions.

Highlights of HPRC Release 2 Assemblies:

* Expanded Number of Assemblies: Release 2 includes assemblies from an increased number of diverse individuals, significantly expanding the representation of global human genomic variation compared to Release 1. This release incorporates genomes from a total of 232 individuals.
* Improved Assembly Quality: The assemblies in Release 2 benefit from the use of advanced algorithms that integrate long-read sequencing from PacBio HiFi and ONT as well as phasing from Illumina trio-WGS or Hi-C data. This integration has resulted in significantly more continuous and structurally accurate assemblies, reducing misassemblies by approximately threefold and enabling a substantial number of complete, telomere-to-telomere chromosome assemblies.
* Enhanced Accuracy: A novel deep learning based base-level assembly polishing step, developed primarily by Google Research in collaboration with the UC Santa Cruz Genomics Institute, has been incorporated into the Release 2 processing pipeline. Coupled with sequencing technology improvements, this reduces single-nucleotide and short insertion and deletion errors by a factor of two, resulting in an estimated error rate of less than one base error per half a million assembled bases.


Data files can be browsed by sample, population and data type below. All data are held in INSDC databases as well as via AWS S3 and Google Cloud buckets. See the HPRC [GitHub repository](https://github.com/human-pangenomics/hprc_intermediate_assembly/tree/main/data_tables/sequencing_data) for further information.