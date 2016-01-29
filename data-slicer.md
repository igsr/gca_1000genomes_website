---
layout: single_section
title: "Data Slicer"
permalink: /data-slicer/
---

# Data Slicer

The Data Slicer provides an interface which allows users to get subsections of either VCF ([VCFtools](http://vcftools.sourceforge.net/specs.html)) or BAM ([SAMtools](http://samtools.sourceforge.net/)) files based on genomic coordinates.

In the browser, you can access the [Data Slicer](http://browser.1000genomes.org/Homo_sapiens/UserData/SelectSlice) from either the tools link in the menu bar at the top of every page or from the manage your data link which is on the left hand menu of many pages.

The input interface is shown below.

![data slicer input field](/sites/1000genomes.org/files/resize/documents/data_slicer_input_test-722x306.jpg "data slicer input")

You must provide a publicly visible URL for your BAM or VCF file which must be accompanied by either a tabix index (.tbi) or BAM index (.bai) of the same name. All 1000 genomes VCF and BAM files on the FTP site have these indices with them. Please note that this service will only work for other BAM files over http.

If you are slicing a VCF file you can also subset the data by individual and population. If you are going to subset by population you much also provide a file like [20100804.ALL.panel](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20100804/20100804.ALL.panel).

The format should be: **sample name population name**

The two columns should be tab separated.

If you have asked for the file to be subset by individual or population you need next see this interace.

![select individuals](/sites/1000genomes.org/files/resize/documents/ds_select_sample-722x244.jpg "select individuals")

You can now either put a comma separated list of individuals or populations in the box or select individuals or populations from the dropdown list, if you wish to select multiple individuals or populations please hold the ctrl key (on Windows/Linux) or the cmd key (Macs).

After clicking next the system produces your final file.

![data slicer output](/sites/1000genomes.org/files/resize/documents/ds_final-741x307.jpg "data slicer output")

This presents a link to your file slice which should contain both the location you requested and the name of the original in its name. If you right click on this link and select save target you will be able to download this file. You also get a summary of the first few lines of the file in the window so you can check it has produced something close to expectation.

There is also [documentation for our Variation Pattern finder](http://www.1000genomes.org/variation-pattern-finder) which looks at shared patterns of variation between individuals from VCF files.

If you have any questions about this system please email [info@1000genomes.org](mailto:info@1000genomes.org)
