---
layout: single_section
title: "Analysis"
permalink: /analysis/
tags: Analysis
nav_buttons:
    - announcements
    - files_formats
    - software_tools
    - pilot_paper
    - contacts
---

# Analysis

The analysis pipelines used by IGSR build on those created for the 1000 Genomes Project. For detailed information on the analysis methods used by the 1000 Genomes Project, the [pilot](http://www.nature.com/nature/journal/v467/n7319/full/nature09534.html), [phase 1](http://www.nature.com/nature/journal/v491/n7422/full/nature11632.html), [phase 3](http://www.nature.com/nature/journal/v526/n7571/full/nature15393.html) and [phase 3 structural variation](http://www.nature.com/nature/journal/v526/n7571/full/nature15394.html) publications should be referred to.

## Alignment

###GRCh38 with alternative sequences, plus decoys and HLA

IGSR is employing an alt-aware alignment strategy using the most recent version of BWA-mem to align data to GRCh38. This uses the [full GRCh38 reference, including ALT contigs, decoy and the HLA sequences](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/GRCh38_reference_genome/) compiled by Heng Li from the IMGT/HLA database provided by the Immuno Polymorphism Database (IPD).  The pipeline aligns sequence data at the run level and then merges runs belonging to the same sample together to produce sample level alignments. GATK BAM improvement steps are used, as in the 1000 Genomes phase 3 pipeline. Use of this more complete sequence set should improve read mapping accuracy, providing a better foundation for further analyses.

Information on alt-aware BWA can be found [here](https://github.com/lh3/bwa/blob/master/README-alt.md).

###GRCh37

During the 1000 Genomes Project, sequence reads were aligned to GRCh37. The FASTA file that was used for the alignments can be found on the FTP site [here](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/human_g1k_v37.fasta.gz). It represented the full chromosomes of the [GRCh37](http://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/human/index.shtml) build of the human reference.

For the 1000 Genomes Project, differing alignment algorithms were used for each sequencing technology. For the Trio and Low Coverage pilots, Illumina data were mapped using the MAQ algorithm, SOLiD data were mapped using Corona Lite, and 454 data were mapped using SSAHA2. For the Exon pilot, Illumina and 454 reads were mapped using MOSAIK.

MAQ: [http://maq.sourceforge.net/](http://maq.sourceforge.net/)  
Corona Lite: [http://solidsoftwaretools.com/gf/project/corona/](http://solidsoftwaretools.com/gf/project/corona/)  
SSAHA2: [http://www.sanger.ac.uk/resources/software/ssaha2/](http://www.sanger.ac.uk/resources/software/ssaha2/)  
MOSAIK: [http://code.google.com/p/mosaik-aligner/](http://code.google.com/p/mosaik-aligner/)

##SNP calling in the 1000 Genomes Project

Multiple SNP calling procedures were used by the 1000 Genomes Project. It was found that the consensus of multiple primary call sets from different methods proved of higher quality than any of the primary call sets themselves.

Calling was separate for three analysis panels, CEU, YRI and CHB+JPT. For each, three primary SNP call sets were generated, from the Broad Institute (Broad), the University of Michigan (Michigan) and the Sanger Institute (Sanger). Details of the methods are given in separate publications (DePristo, Banks *et al.* 2010; Le and Durbin 2010; Li, Willer *et al.* 2010). Consensus genotypes were defined using a simple majority vote among callers

The low coverage call set merging produced a set of partially phased haplotypes. We sought to "phase-finish" these haplotypes by using an LD-based method to place the remaining unphased alleles onto the haplotype scaffold that resulted from the merging. This was achieved using the IMPUTE2 software (Howie, Donnelly *et al.* 2009) to produce best-guess haplotypes from unphased genotype data. Howie *et al.* (2009) explain the basic procedure for sampling from the joint posterior distribution of haplotypes underlying the genotypes of a number of individuals: the IMPUTE model (Marchini, Howie *et al.* 2007) is embedded in a Gibbs sampler, and at each iteration every individual samples a new pair of haplotypes, conditional on the current guesses of the other individuals.

IMPUTE2: [http://mathgen.stats.ox.ac.uk/impute/impute_v2.html](http://mathgen.stats.ox.ac.uk/impute/impute_v2.html)
