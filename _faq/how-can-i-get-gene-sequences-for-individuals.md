---
title: "How can I get gene sequences for individuals?"
faq_tags:
 -
 -
faq_related:
 -
 -
---

We do not have assembled genomes for individuals in IGSR, only FASTQ sequence reads and alignments to reference genomes in BAM or CRAM. Nor do we provide any tools for fetching data from a single gene. We recommend using [Ensembl](ensembl.org) for fetching sequences for a particular gene or locus.

You can see the per-individual sequences of proteins and transcripts from 1000 Genomes in the Ensembl haplotypes page ([for example](http://www.ensembl.org/Homo_sapiens/Transcript/Haplotypes?db=core;g=ENSG00000108055;r=10:110567695-110606048;t=ENST00000361804)) for an Ensembl transcript, showing the variants that co-occur in a single transcript or protein, their sequences and which individuals they have been identified in. You can also use the Ensembl [Data Slicer](http://www.ensembl.org/Homo_sapiens/Tools/DataSlicer) to fetch a BAM covering a particular genomic region for an individual.
