---
title: "How to download files using aspera?"
faq_tags:
  - aspera
  - data-access
  - tools
faq_related:
  - where-most-recent-release
  - where-are-your-alignment-files-located
  - can-i-access-1000-genomes-data-globus-online
---

Aspera provides a fast method of downloading data. To use the Aspera service you need to download the [Aspera connect](http://asperasoft.com/software/transfer-clients/connect-web-browser-plug-in/) software. This provides both a browser plug in for downloading data and a bulk download client called ascp.

If you visit http://www.1000genomes.org/aspera with your web browser after installing
aspera connect, it should automatically launch the plugin and you should be ready to go.

For the command line tool ascp, for versions 3.3.3 and newer, you need to use a command line like:

         ascp -i bin/aspera/etc/asperaweb_id_dsa.openssh -Tr -Q -l 100M -L- fasp-g1k@fasp.1000genomes.ebi.ac.uk:vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz ./

For versions 3.3.2 and older, you need to use a command line like:

         ascp -i bin/aspera/etc/asperaweb_id_dsa.putty -Tr -Q -l 100M -L- fasp-g1k@fasp.1000genomes.ebi.ac.uk:vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz ./

Note, the only change between these commands is that for newer versions of ascp asperaweb_id_dsa.openssh replaces asperaweb_id_dsa.putty. This change is noted by Aspera [here](https://support.asperasoft.com/entries/38675468-Command-line-ascp-transfer-asking-for-a-passphrase-after-Connect-plugin-upgrade). You can check the version of ascp you have using:

       ascp --version

The argument to -i may also be different depending on the location of the default key file. The command should not ask you for a password. All the IGSR data is accessible without a password but you do need to give ascp the ssh key to complete the command.

For the above commands to work with your network's firewall you need to open ports 22/tcp (outgoing) and 33001/udp (both incoming and outgoing) to the following EBI IPs:

- 193.62.192.6
- 193.62.193.6

If the firewall has UDP flood protection, it must be turned off for port 33001.

All data provided by IGSR is available via the [EBI Aspera site](http://dev.1000genomes.org/aspera). During the 1000 Genomes Project, NCBI provided an Aspera service. The [NCBI Aspera site](http://www.ncbi.nlm.nih.gov/projects/faspftp/1000genomes/) provides access to the data as it was when the main 1000 Genomes Project conlcuded and does not include any updates to the data.

For further information, please contact info@1000genomes.org.
