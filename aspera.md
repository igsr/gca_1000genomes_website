---
layout: single_section
title: "Aspera"
permalink: /aspera/
tags: aspera
---
#Aspera

The updated 1000 Genomes website no longer supports the Aspera web interface. You can continue to use aspera with the command line tool ascp. The tool itself is available from [Aspera](http://asperasoft.com/software/transfer-clients/connect-web-browser-plug-in/). 

An example command line for ascp is:

      ascp -i bin/aspera/etc/asperaweb_id_dsa.putty -Tr -Q -l 100M -L- fasp-g1k@fasp.1000genomes.ebi.ac.uk:vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz ./

If you would like to continue to use a web interface to transfer files you can use our [Globus interface](https://gridcf.org/gct-docs/latest/gridftp/pi/index.html). You can find out more details about how to use Globus in our [Globus FAQ](/faq/can-i-access-1000-genomes-data-globus-online).

If you have any questions about Aspera or any other aspect of accessing the 1000 Genomes data, please email [info@1000genomes.org](mailto:info@1000genomes.org).
