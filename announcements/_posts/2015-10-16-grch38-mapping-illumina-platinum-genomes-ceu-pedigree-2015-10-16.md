---
title: "GRCh38 mapping of the Illumina Platinum Genomes CEU pedigree"
---
                    
We have aligned the [Illumina Platinum pedigree](https://www.illumina.com/platinumgenomes.html) sequence data to GRCh38\. The data was aligned to the full assembly including the GRC maintained alternate loci along with decoy and [additional HLA sequences from the IMGT](https://www.ebi.ac.uk/ipd/imgt/hla/). A copy of the FASTA file can be found in [our reference directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/reference/GRCh38_reference_genome/). The alignment was carried out using a new alt-aware version of BWA-mem. 

The alignment files themselves can be found in the [data_collections/illumina_platinum_pedigree/data](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/illumina_platinum_pedigree/data) directory.

The [alignment index](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/illumina_platinum_pedigree/illumina_platinum_ped.GRCh38DH.alignment.index) and [sequence index](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/illumina_platinum_pedigree/illumina_platinum_ped.sequence.index) can be found in the [data_collections/illumina_platinum_pedigree](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/illumina_platinum_pedigree/) directory.

Please note, alignment files are now being distributed in CRAM format, rather than BAM format. You can find more details about CRAM in this [README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README_using_1000genomes_cram.md)

Further details of our alignment pipeline can be found in the [data collection README](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/illumina_platinum_pedigree/README_illumina_platinum_pedigree.md).

If you have any questions please email [info@1000genomes.org](mailto:info@1000genomes.org).
