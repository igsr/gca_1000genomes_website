---
title: "How can I get all variants in a particular gene?"
faq_tags:
 -
 -
faq_related:
 -
 -
---

IGSR do not provide any tools for fetching data from a single gene. We recommend using [Ensembl](ensembl.org) for fetching variants for a particular gene or locus. There you can search for a gene and find a variant table ([for example](http://www.ensembl.org/Homo_sapiens/Gene/Variation_Gene/Table?db=core;g=ENSG00000108055;r=10:110567695-110606048)) which you can filter to only show variants found in 1000 Genomes. You can also use the Ensembl [Data Slicer](http://www.ensembl.org/Homo_sapiens/Tools/DataSlicer) to fetch a VCF or a BAM covering a particular genomic region.

You can also see the per-individual sequences of proteins and transcripts from 1000 Genomes in the haplotypes page ([for example](http://www.ensembl.org/Homo_sapiens/Transcript/Haplotypes?db=core;g=ENSG00000108055;r=10:110567695-110606048;t=ENST00000361804)) for an Ensembl transcript, showing the variants that co-occur in a single transcript or protein, their sequences and which individuals they have been identified in.
