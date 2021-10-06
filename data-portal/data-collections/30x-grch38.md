---
layout: angularjs_partial
---

The [New York Genome Center (NYGC)](https://www.nygenome.org), funded by [NHGRI](https://www.genome.gov), has sequenced 3202 samples from the 1000 Genomes Project sample collection to 30x coverage. Initially, the 2504 unrelated samples from the phase three panel from the 1000 Genomes Project were sequenced. Thereafter, an additional 698 samples, related to samples in the 2504 panel, were also sequenced. NYGC [aligned the data to GRCh38](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000G_2504_high_coverage/20190405_NYGC_b38_pipeline_description.pdf) and those alignments are publicly available along with a [data reuse statement](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000G_2504_high_coverage/20200526_1000G_2504plus698_high_cov_data_reuse_README.txt). Details, including URLs for the data in ENA, are in our data portal (below) and are listed on our [FTP site](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000G_2504_high_coverage). The alignments can be accessed at the following locations:

* ENA - [tab delimited file list for the 2504 panel](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000G_2504_high_coverage/1000G_2504_high_coverage.sequence.index) or 2504 ENA Study at https://www.ebi.ac.uk/ena/data/view/PRJEB31736 and a [tab delimited file list for the 698 related samples](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000G_2504_high_coverage/1000G_698_related_high_coverage.sequence.index) or 698 ENA Study at https://www.ebi.ac.uk/ena/browser/view/PRJEB36890
* [AnVIL](https://anvilproject.org) - https://app.terra.bio/#workspaces/anvil-datastorage/1000G-high-coverage-2019  
* AWS - s3://1000genomes/1000G_2504_high_coverage/ and s3://1000genomes/1000G_2504_high_coverage/additional_698_related/
* NCBI FTP - ftp://ftp-trace.ncbi.nlm.nih.gov/1000genomes/ftp/1000G_2504_high_coverage/ and ftp://ftp-trace.ncbi.nlm.nih.gov/1000genomes/ftp/1000G_2504_high_coverage/additional_698_related/

NYGC have performed variant calling on the data and the resulting call sets are available on our [FTP site](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000G_2504_high_coverage/). These include:

* [Genotype VCFs](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000G_2504_high_coverage/working/20201028_3202_raw_GT_with_annot/) - these include the genotypes for all samples in the "recalibrated_variants.vcf.gz" files (also listed below)
* [Phased VCFs](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000G_2504_high_coverage/working/20201028_3202_phased/) - the phased calls for the 3202 samples
* [Structural Variation VCFs](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000G_2504_high_coverage/working/20210124.SV_Illumina_Integration/) - Structural Variation calls for the 3202 samples
* Sample metadata file listing pedigree and sex information for the 3,202 1kGP samples is available [here](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000G_2504_high_coverage/working/1kGP.3202_samples.pedigree_info.txt).

The [initial GATK call set for the 2504 unrelated samples](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000G_2504_high_coverage/working/20190425_NYGC_GATK/) remains available.

A [preprint](https://www.biorxiv.org/content/10.1101/2021.02.06.430068v1) is available describing this work, which can be used for citation purposes.