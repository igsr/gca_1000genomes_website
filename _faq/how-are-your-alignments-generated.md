---
title: "How are your alignments generated?"
faq_tags:
  - bam
  - data-analysis
  - tools
faq_related:
  - what-format-are-your-alignments-and-what-do-names-mean
  - how-do-i-get-sub-section-bam-file
---

The 1000 genomes project has used several different alignment algorithms during its duration:

|Project stage|Sequencing technology|Alignment algorithm|
|-------------|---------------------|-------------------|
|Pilot|Illumina|[MAQ](http://maq.sourceforge.net/)|
|Pilot|SOLiD|Corona lite|
|Pilot|454|[ssaha](http://www.sanger.ac.uk/resources/software/ssaha2/)|
|Main|Illumina|[BWA](http://bio-bwa.sourceforge.net/)|
|Main|SOLiD|[BFAST](http://sourceforge.net/apps/mediawiki/bfast/index.php?title=Main_Page)|
|Main|454|ssaha (first set)|
|Main|454|[smalt](http://www.sanger.ac.uk/resources/software/smalt/) (final set)|

The full process is described in the [README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.alignment_data)
