---
title: "What methods were used for generating alignments?"
faq_tags:
  - bam
  - data-analysis
  - tools
faq_related:
  - about-alignment-files-bam-and-cram
  - how-do-i-get-a-genomic-region-sub-section-of-your-files
redirect_from:
    - /faq/how-are-your-alignments-generated/
---

The 1000 Genomes Project has used several different alignment algorithms during its duration:

|Project stage|Sequencing technology|Alignment algorithm|
|-------------|---------------------|-------------------|
|Pilot|Illumina|[MAQ](http://maq.sourceforge.net/)|
|Pilot|SOLiD|Corona lite|
|Pilot|454|[ssaha](http://www.sanger.ac.uk/resources/software/ssaha2/)|
|Main|Illumina|[BWA](http://bio-bwa.sourceforge.net/)|
|Main|SOLiD|[BFAST](http://sourceforge.net/apps/mediawiki/bfast/index.php?title=Main_Page)|
|Main|454|ssaha (first set)|
|Main|454|[smalt](http://www.sanger.ac.uk/resources/software/smalt/) (final set)|

The full process is described in the [README](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/historical_data/former_toplevel/README.alignment_data.md)
