---
title: "GRCh38 mapping of the 1000 Genomes low coverage data is now available"
---
                    
We have realigned the low coverage 1000 Genomes sequence data to GRCh38\. We aligned to the full assembly including the GRC maintained alternate loci sequences and decoy and [additional HLA sequences from the IMGT](https://www.ebi.ac.uk/ipd/imgt/hla/), our fasta file can be found in [our reference directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/GRCh38_reference_genome/). The alignment was carried out using a new alt-aware version of [BWA-mem](https://github.com/lh3/bwa/tree/master/bwakit) 

The alignment files themselves can be found in the [data_collections/1000_genomes_project/data](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000_genomes_project/data) directory.

The [alignment index](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000_genomes_project/1000genomes.low_coverage.GRCh38DH.alignment.index) and [sequence.index](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000_genomes_project/1000genomes.sequence.index) can be found in the [data_collections/1000_genomes_project](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000_genomes_project/)directory.

Please note, these files are now being distributed in CRAM format, rather than BAM format. You can find more details about CRAM in this [README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README_using_1000genomes_cram.md)

Full details of our alignment pipeline can be found in the [alignment pipeline README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000_genomes_project/README.1000genomes.GRCh38DH.alignment)

If you have any questions please email [info@1000genomes.org](mailto:info@1000genomes.org)
