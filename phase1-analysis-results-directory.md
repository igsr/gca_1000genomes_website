---
layout: single_section
title: "Phase1 Analysis Results"
permalink: /phase1-analysis-results-directory/
---

# Phase1 Analysis Results

This page describes the Phase1 analysis results directory [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/)]

This directory contains files associated with the variant calling carried out for the phase1 of the 1000 genomes project and other ancillary files associated with the analysis for phase1.

The phase1 analysis results directory contains a number of sub directories with different content. These are listed here.

**Ancestry Deconvolution [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/ancestry_deconvolution/)]**

This directory contains information about the local ancestry inference which has been carried out on the ad-mixed populations found in the 1000 genomes phase1 samples. These are the African Americans (ASW), Colombians (CLM), Mexicans (MXL) and Puerto Ricans (PUR).

**Consensus Call Sets [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/consensus_call_sets/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/consensus_call_sets/)]**

These directories contain the consensus call sets and genotype likelihoods which were used to produce the final integrated release. Please note the indel file in this directory still contains indels which were subsequently filtered out of our integrated data release due to validation efforts. These can be identified by looking at the excluded_indel_sites list [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/supporting/excluded_indel_sites/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/supporting/excluded_indel_sites)].

**Experimental Validation [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/experimental_validation/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/experimental_validation/)]**

This directory contains information about which sites were validated for the different variant types and the results of the validation processes.

**Functional Annotation [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/functional_annotation/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/functional_annotation/)]**

This contains two directories, annotation_sets contains bed and gtf files which describe the gene and non coding annotation which our variant sets were compared with and annotation_vcfs that contains the actual variant annotation in vcf format.

**Input Call Sets [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/input_call_sets/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/input_call_sets/)]**

This directory contains all the union call sets for the snps (both low coverage and exome), indels and deletions that make up the integrated release. The directory contains several vcf files in each file any variant whose filter column reads PASS should be part of the integrated release.

**Integrated Call Sets [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/integrated_call_sets/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/integrated_call_sets/)]**

This directory contains our final variant calls for the phase1 data sets. The majority of the data in this directory is identical to what can be found in [ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20110521](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20110521) but there are also chrY calls for snps and deletions and chrMT calls for snps found here.

**Supporting [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/supporting/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/supporting/)]**

*   **accessible_genome_masks,**Mask files defining which regions of the genome are more or less accessible to the next generation methods used by the 1000 Genomes Project [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/supporting/accessible_genome_masks/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/supporting/accessible_genome_masks)]
*   **ancestral_alignments**, Ancestral fasta files based on a 32 way alignment from [Ensembl 59](http://aug2010.archive.ensembl.org/index.html) based on the [Enredo Pecan Ortheus pipeline](http://www.ncbi.nlm.nih.gov/pubmed/18849525) [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/supporting/ancestral_alignments/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/supporting/ancestral_alignments/)]
*   **axiom_genotypes**, Genotypes from the Affymetrix Axiom platform for 1000 genomes samples [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/supporting/axiom_genotypes/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/supporting/axiom_genotypes/)]
*   **cosmic_hgmd_overlap**, Ovelaps between the phase1 integrated results and the [cosmic](http://www.sanger.ac.uk/genetics/CGP/cosmic/) and [hgmd](http://www.hgmd.cf.ac.uk/ac/index.php) databases [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/supporting/cosmic_hgmd_overlap)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/supporting/cosmic_hgmd_overlap)]
*   **cryptic_relation_analysis**, The results of the Cryptic Relatedness Analysis performed by Jim Nemesh at the Broad Insititute [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/supporting/cryptic_relation_analysis/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/supporting/cryptic_relation_analysis/)]
*   **excluded_indel_sites**, The list of indels which were excluded from the v3 integrated variant release [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/supporting/excluded_indel_sites/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/supporting/excluded_indel_sites)]
*   **exome_pull_down**, The target coordinates used for both variant calling and the downstream analysis of the exome data [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/supporting/exome_pull_down/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/supporting/exome_pull_down/)]
*   **omni_haplotypes**, Genotypes from the Illumina Omni 2.5M Chip for 1000 genomes individuals [[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/supporting/omni_haplotypes/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/supporting/omni_haplotypes/)]
*   **variant_gerp_scores**, Conservation scores for all snp and indel variant sites[[EBI](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/phase1/analysis_results/supporting/variant_gerp_scores/)\|[NCBI](ftp://ftp-trace.ncbi.nih.gov/1000genomes/ftp/phase1/analysis_results/supporting/variant_gerp_scores/)]
