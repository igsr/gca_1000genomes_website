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

We do not provide summary statistics that span the collections in IGSR. However, our index files, provided for each data collection on the FTP site, include information for each collection. The following describes the information available using the 1000 Genomes Project files as an example, however, similar files are available for the other data collections.

For raw data, a [sequence.index](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000_genomes_project/1000genomes.sequence.index) file contains base and read counts for each of the active FASTQ files.

For the aligned data all BAM and CRAM files have [BAS files](/faq/what-bas-file) associated with them.  These contain read group level statistics for the alignment. We also provide this in a collected form in alignment index files. The [alignment indices for the alignments of the 1000 Genomes Project data to GRCh38](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/data_collections/1000_genomes_project/) are available on the FTP site. There is also an historic [alignment indices](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/historical_data/former_toplevel/alignment_indices/) directory, which contains a .hsmetrics file with the results of the Picard tool [CalculateHsMetrics](http://broadinstitute.github.io/picard/command-line-overview.html#CalculateHsMetrics) for all the exome alignments and summary files, which compare statistics between old and new alignment releases during the 1000 Genomes Project.

