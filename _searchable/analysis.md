---
layout: single_section
title: "Analysis"
permalink: /analysis/
tags: Analysis
---

# Analysis

The analysis pipelines used by IGSR build on those created for the 1000 Genomes Project. For more detailed information about the analysis methods used by the 1000 Genomes Project in its different phases, please refer to our publications. 

##Publications

- [Pilot](http://www.nature.com/nature/journal/v467/n7319/full/nature09534.html)
- [Phase 1](http://www.nature.com/nature/journal/v491/n7422/full/nature11632.html)
- [Phase 3](http://www.nature.com/nature/journal/v526/n7571/full/nature15393.html) 
- [Phase 3 structural variation](http://www.nature.com/nature/journal/v526/n7571/full/nature15394.html)

## Alignment

###GRCh38 with alternative sequences, plus decoys and HLA

IGSR is employing an alt-aware alignment strategy using the most recent version of BWA-mem when aligning data to GRCh38. This uses the [full GRCh38 reference, including ALT contigs, decoy and the HLA sequences](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/GRCh38_reference_genome/). The HLA sequenced were compiled by Heng Li from the IMGT/HLA database provided by the [Immuno Polymorphism Database (IPD)](https://www.ebi.ac.uk/ipd/). 

The pipeline aligns sequence data at the run level and then merges runs belonging to the same sample together to produce sample level alignments. GATK BAM improvement steps are used, as in the 1000 Genomes phase 3 pipeline. By using the complete GRCh38 genome, we should have improved read mapping accuracy, providing a better foundation for further analyses.

Information on alt-aware BWA can be found [on the bwa site](https://github.com/lh3/bwa/blob/master/README-alt.md).

###GRCh37

During the main 1000 Genomes Project, sequence reads were aligned to GRCh37. In phase 1, reference as providing by the Genome Reference Consortium was used, in phase 3, decoy sequence was added to the reference to reduce the rate of mismapping. 

The phase1 reference FASTA can be found in [technical/reference directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/human_g1k_v37.fasta.gz) . It represented the full chromosomes of the [GRCh37](http://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/human/index.shtml) build of the human reference. The phase 3 reference can be found in the [phase2_reference_assembly_sequence directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/phase2_reference_assembly_sequence/) . This contains both the full reference and the additional decoy sequence.

###NCBI36

In the pilot phase of the 1000 Genomes Project, the data was mapped to sex matched copies of NCBI36. Our reference files can be found under the [pilot_data directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/pilot_data/technical/reference/)

###Mapping Algorithms

During the 1000 Genomes Project, different mapping algorithms were used for data types. The table below describes which algorithms were used for the different data types and technology combinations in the different phases of the project.

{: .table .table-striped}
| Phase   | Techology | Low Coverage | Exome/Exon Targetted | High Coverage |
|:-------:|:---------:|:------------:|:--------------------:|:-------------:|
| Pilot   | Illumina  | MAQ          | MOSAIK               | MAQ           |
|         | 454       | MAQ          | MOSAIK               | MAQ           |
|         | SOLiD     | corona       | N/A                  | corona        |
| Phase 1 | Illumina  | bwa          | bfast                | N/A           |
|         | 454       | bwa          | bfast                | N/A           |
|         | SOLiD     | bfast        | bfast                | N/A           |
| Phase 3 | Illumina  | bwa          | N/A                  | N/A           |


MAQ: [http://maq.sourceforge.net/](http://maq.sourceforge.net/)  
Corona Lite: [http://solidsoftwaretools.com/gf/project/corona/](http://solidsoftwaretools.com/gf/project/corona/)  
MOSAIK: [http://code.google.com/p/mosaik-aligner/](http://code.google.com/p/mosaik-aligner/)
bwa: [http://bio-bwa.sourceforge.net/](http://bio-bwa.sourceforge.net/)
bfast: [http://sourceforge.net/projects/bfast/](http://sourceforge.net/projects/bfast/)

##SNP calling in the 1000 Genomes Project

Over the course of the 1000 Genomes Project, how variants were called from the samples changed quite dramatically. Two clear lessons from the project were, when considering low coverage data, calling from multiple samples at once produces more, higher quality variants and considering the sites discovered from multiple algorithms improved the discovery rate and accuracy of discovery. Many different programs and strategies were developed over the duration of the project. The publications referred to at the top of this page are the best place to get a description of what programs were used and how the 1000 Genomes variant calling pipeline was run.
