---
title: "Are there any statistics about how much sequence data is in IGSR?"
faq_tags:
  - data-access
  - statistics
faq_related:
  - how-many-individuals-have-been-sequenced-in-igsr-projects-and-how-were-they-selected
  - what-completion-criteria-samples-project
  - is-there-gene-expression-andor-functional-annotation-available-for-the-samples
redirect_from:
    - /faq/are-there-any-statistics-about-how-much-sequence-data-has-been-generated-project/
    - /faq/how-much-sequence-data-has-been-generated-single-individuals/
---

Statistics about how much data the 1000 Genomes Project produced are accessible in several different ways. Information on some of the formats used for this information is available on the [FTP site](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README_file_formats_and_descriptions.md).

For raw data, a [sequence.index](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000_genomes_project/1000genomes.sequence.index) file contains base and read counts for each of the active FASTQ files.

During the 1000 Genomes Project, summery statistics were provided in a [sequence indices directory](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/historical_data/former_toplevel/sequence_indices/), which is now located with historical data from the project. This contains four summary files, two exome and two low coverage. Both of these analysis groups have a .stats file providing numbers of runs withdrawn for different reasons, base count and coverage statistics for each study, population level summaries and a stats.csv file which provides a comparison to the previous index in terms of number of runs, bases and similar metrics. Since late 2012, the 1000 Genomes Project also produced analysis.sequence.index files, which only consider Illumina runs of 70bp read length or longer, and also have statistics files.

For the aligned data all BAM and CRAM files have [BAS files](/faq/what-bas-file) associated with them.  These contain read group level statistics for the alignment. We also provide this in a collected form in alignment index files. The [alignment indices for the alignments of the 1000 Genomes Project data to GRCh38](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000_genomes_project/) are available on the FTP site. There is also an historic [alignment indices](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/historical_data/former_toplevel/alignment_indices/) directory, which contains a .hsmetrics file with the results of the Picard tool [CalculateHsMetrics](http://broadinstitute.github.io/picard/command-line-overview.html#CalculateHsMetrics) for all the exome alignments and summary files, which compare statistics between old and new alignment releases during the 1000 Genomes Project.

**How much sequence data has been generated for single individuals?**

NA12878 the CEU child from our high coverage trio represents our largest amount of sequence data with 4.2 Tbases of sequence, the majority of this sequence data is from 2008 and short read length (~36bp) so is not the highest quality we have. You can see how many bases we have sequenced for all our samples by looking in our [sequence index](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.sequence_data) file. The 25th column of this file is the base count in each fastq file.
