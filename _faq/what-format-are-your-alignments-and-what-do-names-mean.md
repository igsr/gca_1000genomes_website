---
layout: faq
title: "What format are your alignments in and what do the names mean?"
faq_tags:
  - bam
  - data-access
  - file-format
faq_related:
  - how-are-your-alignments-generated
  - what-bas-file
  - where-are-your-alignment-files-located
  - what-are-cram-files
---
                    
All our alignment files are in [BAM format](http://samtools.sourceforge.net/), a standard alignment format which was defined by the consortium and has since seen wide community adoption. We also provide our alignments in [CRAM Format](http://www.ebi.ac.uk/ena/about/cram_toolkit)

The bam file names look like:

**NA00000.location.platform.population.analysis_group.YYYYMMDD.bam**

The bai index and bas statistics files are also named in the same way.

The name includes the individual sample id, where the sequence is mapped to, if the file has only contains mapping to a particular chromosome that is what the name contains otherwise, mapped means the whole genome mapping and unmapped means the reads which failed to map to the reference (pairs where one mate mapped and the other didn't stay in the mapped file), platform refers to the sequencing platform, population the ethnicity of the sample using our [three letter population code](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.populations), analysis group the sequencing stratergy. The date matches the date of the sequence free used to build the bams and can also be found in the [sequence.index filename](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.sequence_data).
