---
title: "How to download files using aspera?"
faq_tags:
  - aspera
  - data-access
  - tools
faq_related:
  - can-i-search-ftp-site
  - where-most-recent-release
  - where-are-your-alignment-files-located
  - can-i-access-1000-genomes-data-globus-online
---

The data is available via an Aspera server from both the EBI and NCBI. To be able to use this service you need to download the [Aspera connect](http://asperasoft.com/software/transfer-clients/connect-web-browser-plug-in/) software. This provides both a browser plug in for downloading data and a bulk download client called ascp

The plugin should automatically start when you visit either the [EBI Aspera site](http://dev.1000genomes.org/aspera) or [NCBI Aspera site](http://www.ncbi.nlm.nih.gov/projects/faspftp/1000genomes/).

An example command line for ascp looks like:

    ascp -i bin/aspera/etc/asperaweb_id_dsa.putty -Tr -Q -l 100M -L- fasp-g1k@fasp.1000genomes.ebi.ac.uk:vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz .

The argument to -i may be different depending on the location of the default key file. This command should not ask you for a password. All the 1000 genomes data is freely accessible but you do need to give ascp the ssh key to complete the command.
