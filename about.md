---
layout: single_section
title: "About"
permalink: /about/
tags: About
redirect_from:
    - /node/3/
---

# About IGSR and the 1000 Genomes Project

The [1000 Genomes Project](/1000-genomes-summary) ran between 2008 and 2015, creating the largest public catalogue of human variation and genotype data. As the project ended, the Data Coordination Centre at [EMBL-EBI](http://www.ebi.ac.uk/) received funding from [the Wellcome Trust](http://www.wellcome.ac.uk/) to maintain and expand the resource. The International Genome Sample Resource (IGSR) was set up to do this with the following aims:

1. [Ensure the future access to and usability of the 1000 Genomes reference data](#aim1)
2. [Incorporate additional published genomic data on the 1000 Genomes samples](#aim2)
3. [Expand the data collection to include new populations not represented in the 1000 Genomes Project](#aim3)

##IGSR

IGSR was set up to ensure the future usability and accessibility of data from the 1000 Genomes Project and to extend the data set to include new data on the 1000 Genomes samples and new populations where sampling has been carried out in line with IGSR sampling principles.

###<a name="aim1"></a>1. Ensuring the future usability of the 1000 Genomes reference data

In 2014, the [Genome Reference Consortium](http://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/) released an update of the human assembly, GRCh38. This update to the human reference assembly shows a significant improvement in the quantity of alternative loci represented. It now contains 178 genomic regions with associated alternative loci (2% of chromosomal sequence (61.9 Mb)). This is made up from 261 alternative loci (containing 3.6 Mb novel sequence relative to chromosomes). The GRC were also able to resolve more than 1000 issues from the previous version of the assembly.

Taking advantage of the alternative loci when identifying variation and calling genotypes is an important step in improving our ability to discover human variation. Currently, very few tools can use the alternative loci data. IGSR has remapped the [phase 3 1000 Genomes data](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/) to GRCh38 in an alternative loci aware manner using [BWA mem](http://bio-bwa.sourceforge.net/). This provides the method development community with a source of alignments that can drive new methods forward, as well as providing the wider community with up to date alignments, ensuring everyone can benefit from the data in the context of the new assembly. The IGSR plans to recall variants on these new alignments.

In addition, further sets of genomic sequence data are being aligned to GRCh38, with the [Platinum Genomes data from Illumina](https://www.illumina.com/platinumgenomes.html) being the first new collection of data to be aligned.

###<a name="aim2"></a>2. Incorporate published genomic data on the 1000 Genomes samples

The 1000 Genomes samples have proved a popular resource for molecular phenotyping experiments and investigating the associations between genetic variation and expression or measurements of epigenetic state. Large datasets have been generated on these samples by projects such as [GEUVADIS](http://www.geuvadis.org/web/geuvadis), who generated [RNA-Seq data](http://www.geuvadis.org/web/geuvadis/rnaseq-project) on the 1000 Genomes European samples and the YRI population, and [ENCODE](https://www.encodeproject.org/), who have carried out extensive assays on the [NA12878](https://www.encodeproject.org/search/?searchTerm=GM12878) cell line. Many other groups have also conducted assays on the 1000 Genomes samples. The IGSR would like to present all this information in a unified manner so the community can benefit from all the data which exists on these samples.

###<a name="aim3"></a>3. Expand the data collection to include new populations

The IGSR recognises that the current 1000 Genomes Project samples do not reflect all populations. An important aim for IGSR is to expand the populations represented in the collection and ensure the available public data represents the maximum possible population diversity. This will ensure the 1000 Genomes dataset remains a valuable open resource for the community over the next five years. The IGSR will work with the groups who were unable to contribute samples to the 1000 Genomes Project before it finished sample collection and investigate collaborations with other groups to ensure the population diversity gaps are filled. You can find more details about this on our [sample collection principles page](/sample_collection_principles).

Please email questions about any of the above to [info@1000genomes.org](mailto:info@1000genomes.org).
