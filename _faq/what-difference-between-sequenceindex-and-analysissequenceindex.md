---
layout: faq
title: "What is the difference between the sequence.index and the analysis.sequence.index?"
faq_tags:
  - alignment
  - data-access
  - sequence
faq_related:
  - how-many-individuals-will-be-sequenced
  - how-much-sequence-data-has-been-generated-single-individuals
---

The sequence.index file contains a list of all the sequence data produced by the project, pointers to the file locations on the ftp site and also all the meta data associated with each sequencing run. 

For the phase 3 analysis the consortium has decided to only use Illumina platform sequence data with reads of 70base pairs or longer. The analysis.sequence.index file contain only the active runs which match this criteria. There are withdrawn runs in this index. These runs are withdrawn either because they have insufficient raw sequence to meet our 3x non duplicated aligned coverage criteria for low coverage alignments or because after the aligned has been run they have failed our post alignment quality controls for short indels or contaimination or they do not meet our coverage criteria.

From the [alignment release based on 20120522](http://www.1000genomes.org/announcements/new-alignment-release-2012-12-11) going forward we will only release alignments based on the analysis.sequence.index
