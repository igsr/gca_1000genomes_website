---
title: "What is a sequence index file?"
faq_tags:
  - data-access
  - meta-data
  - sequence
faq_related:
  - what-do-names-your-fastq-files-mean
  - how-much-sequence-data-has-been-generated-single-individuals
  - where-are-your-sequence-files-located
---
                    
We describe our sequence meta data in sequence index files. The index for data from the 1000 Genomes Project can be found in the [1000 Genomes data collection directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000_genomes_project/). Additional indices are present for data in other data collections. Our old index files which describe the data used in the main project can be found in the [historical_data directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/historical_data/former_toplevel/)

Sequence index files are tab delimited files and frequently contain these columns:

| Column | Title                | Description                                                                                |
| ------ | -------------------- | -------------------------------------------------------------------------------------------|
| 1 | FASTQ_FILE | path to fastq file on ftp site or ENA ftp site |
| 2 | MD5 | md5sum of file |
| 3 | RUN_ID | SRA/ERA run accession |
| 4 | STUDY_ID | SRA/ERA study accession |
| 5 | STUDY_NAME | Name of study |
| 6 | CENTER_NAME | Submission centre name |
| 7 | SUBMISSION_ID | SRA/ERA submission accession |
| 8 | SUBMISSION_DATE | Date sequence submitted, YYYY-MM-DD |
| 9 | SAMPLE_ID | SRA/ERA sample accession |
| 10 | SAMPLE_NAME | Sample name |
| 11 | POPULATION | Sample population, this is a 3 letter code as defined in README_populations.md |
| 12 | EXPERIMENT_ID | Experiment accession |
| 13 | INSTRUMENT_PLATFORM | Type of sequencing machine |
| 14 | INSTRUMENT_MODEL | Model of sequencing machine |
| 15 | LIBRARY_NAME | Library name |
| 16 | RUN_NAME | Name of machine run |
| 17 | RUN_BLOCK_NAME | Name of machine run sector (This is no longer recorded so this column is entirely null, it was left in so as not to disrupt existing sequence index parsers) |
| 18 | INSERT_SIZE | Submitter specified insert size |
| 19 | LIBRARY_LAYOUT | Library layout, this can be either PAIRED or SINGLE |
| 20 | PAIRED_FASTQ | Name of mate pair file if exists (Runs with failed mates will have a library layout of PAIRED but no paired fastq file) |
| 21 | WITHDRAWN | 0/1 to indicate if the file has been withdrawn, only present if a file has been withdrawn |
| 22 | WITHDRAWN_DATE | This is generally the date the file is generated on |
| 23 | COMMENT | comment about reason for withdrawal |
| 24 | READ_COUNT | read count for the file |
| 25 | BASE_COUNT | basepair count for the file |
| 26 | ANALYSIS_GROUP | the analysis group of the sequence, this reflects sequencing strategy. For 1000 Genomes Project data, this includes low coverage, high coverage, exon targeted and exome to reflect the two non low coverage pilot sequencing strategies and the two main project sequencing strategies used by the 1000 Genomes Project. |
