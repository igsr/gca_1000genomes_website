---
title: "What format are your sequence files?"
faq_tags:
  - data-access
  - sequence
faq_related:
  - where-are-your-sequence-files-located
  - what-do-names-your-fastq-files-mean
  - why-sequence-data-distributed-2-or-3-files-labelled-srr1-srr2-and-srr
---
                    
Our sequence files are distributed in [FASTQ format](http://en.wikipedia.org/wiki/Fastq)

We use Sanger style [phred scaled quality encoding](http://en.wikipedia.org/wiki/Phred_quality_score)

The files are all gzipped compressed and the format looks like this, with a 4 line repeating pattern

    @ERR059938.60 HS9_6783:8:2304:19291:186369#7/2
    GTCTCCGGGGGCTGGGGGAACCAGGGGTTCCCACCAACCACCCTCACTCAGCCTTTTCCCTCCAGGCATCTCTGGGAAAGGACATGGGGCTGGTGCGGGG
    +
    7?CIGJB:D:-F7LA:GI9FDHBIJ7,GHGJBKHNI7IN,EML8IFIA7HN7J6,L6686LCJE?JKA6G7AK6GK5C6@6IK+++?5+=<;227*6054
