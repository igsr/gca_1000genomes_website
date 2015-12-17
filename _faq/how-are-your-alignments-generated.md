---
layout: faq
title: "How are your alignments generated?"
faq_tags:
  - bam
  - data-analysis
  - tools
faq_related:
  - what-format-are-your-alignments-and-what-do-names-mean
  - how-do-i-get-sub-section-bam-file
---

The 1000 genomes project has used several different alignment algorithms during its duration. For the pilot project we used [MAQ](http://maq.sourceforge.net/) for Illumina, Corona lite for SOLiD and [ssaha](http://www.sanger.ac.uk/resources/software/ssaha2/) for 454\. For the main project we use [BWA](http://bio-bwa.sourceforge.net/) for Illumina and [BFAST](http://sourceforge.net/apps/mediawiki/bfast/index.php?title=Main_Page) for SOLiD, 454 started with ssaha but the final set of 454 alignments used [smalt](http://www.sanger.ac.uk/resources/software/smalt/). The full process is described in the [README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.alignment_data)
