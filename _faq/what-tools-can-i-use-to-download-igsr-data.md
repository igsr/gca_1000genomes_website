---
title: "What tools can I use to download IGSR data?"
faq_tags:
  - aspera
  - data-access
  - ftp
  - tools
  - globus
  - amazon
  - ENA
  - torrent
faq_related:
  - there-is-a-corrupt-file-on-your-ftp-site
  - do-i-need-a-password-to-access-igsr-data
  - how-do-i-find-the-most-up-to-date-data
  - how-do-i-find-specific-alignment-files
redirect_from:
    - /faq/are-there-torrents-available-1000-genomes-data-sets/
    - /faq/can-i-access-1000-genomes-data-globus-online/
    - /faq/can-i-get-1000-genomes-data-amazon-cloud/
    - /faq/how-download-ena-files-using-aspera/
    - /faq/how-download-files-using-aspera/
    - /faq/what-tools-can-i-use-download-1000-genomes-data/
---

**What tools can I use to download 1000 Genomes data?**

The 1000 Genomes data is available via [ftp](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/), [http](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/) and [Aspera](/aspera). Any standard tool like wget or ftp should be able to download from our ftp or http mounted sites. [To use Aspera](/faq/how-download-files-using-aspera) you need to download their client.

**Are there torrents available for the 1000 Genomes data sets?**

There are no official torrents of the 1000 Genomes Project data sets.

**How to download files using aspera?**

###Download Aspera

Aspera provides a fast method of downloading data. To use the Aspera service you need to download the [Aspera connect](http://asperasoft.com/software/transfer-clients/connect-web-browser-plug-in/) software. This provides a bulk download client called ascp.

###Command line

For the command line tool ascp, for versions 3.3.3 and newer, you need to use a command line like:

         ascp -i bin/aspera/etc/asperaweb_id_dsa.openssh -Tr -Q -l 100M -P33001 -L- fasp-g1k@fasp.1000genomes.ebi.ac.uk:vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz ./

For versions 3.3.2 and older, you need to use a command line like:

         ascp -i bin/aspera/etc/asperaweb_id_dsa.putty -Tr -Q -l 100M -P33001 -L- fasp-g1k@fasp.1000genomes.ebi.ac.uk:vol1/ftp/release/20100804/ALL.2of4intersection.20100804.genotypes.vcf.gz ./

Note, the only change between these commands is that for newer versions of ascp asperaweb_id_dsa.openssh replaces asperaweb_id_dsa.putty. This change is noted by Aspera [here](https://support.asperasoft.com/entries/38675468-Command-line-ascp-transfer-asking-for-a-passphrase-after-Connect-plugin-upgrade). You can check the version of ascp you have using:

       ascp --version

The argument to -i may also be different depending on the location of the default key file. The command should not ask you for a password. All the IGSR data is accessible without a password but you do need to give ascp the ssh key to complete the command.

###Files on the ENA FTP

Some of the data we provide URLs for is hosted on the ENA FTP site. [ENA provide information on using Aspera with their FTP site](https://www.ebi.ac.uk/ena/browse/read-download).

As an example of downloading a file from ENA, you could use a command line like:

    ascp -i bin/aspera/etc/asperaweb_id_dsa.openssh -Tr -Q -l 100M -P33001 -L- 
    era-fasp@fasp.sra.ebi.ac.uk:/vol1/fastq/ERR008/ERR008901/ERR008901_1.fastq.gz ./

###Key files

If you are unsure of the location of asperaweb_id_dsa.openssh or asperaweb_id_dsa.putty, Aspera provide some [documentation](https://support.asperasoft.com/hc/en-us/articles/216125898-Downloading-data-from-NCBI-via-the-command-line) on where these will be found on different systems.

###Ports

For the above commands to work with your network's firewall you need to open ports 22/tcp (outgoing) and 33001/udp (both incoming and outgoing) to the following EBI IPs:

- 193.62.192.6
- 193.62.193.6
- 193.62.193.135

If the firewall has UDP flood protection, it must be turned off for port 33001.

###Browser

Our aspera browser interace no longer works. If you wish to download files using a web interface we recommend using the [Globus interface we present](/faq/can-i-access-1000-genomes-data-globus-online/). If you are previously relied on the aspera web interface and wish to discuss the matter please email us at [info@1000genomes.org](mailto:info@1000genomes.org) to discuss your options. 

**How to download ENA files using aspera?**

The International Genome Sample Resource (IGSR) has stopped mirroring sequence files from the ENA but instead using the sequence.index files to point to the FTP location for the fastq file.

    e.g ftp://ftp.sra.ebi.ac.uk/vol1/fastq/ERR008/ERR008901/ERR008901_1.fastq.gz

These files can also be downloaded using aspera. You will need to get the ascp program as described in [how to download files using aspera](http://www.internationalgenome.org/faq/how-download-files-using-aspera/)

Then you will need to change the ENA FTP host to the ENA Aspera host.

This means you need to change the FTP url to something suitable for the ascp command:

    e.g ftp://ftp.sra.ebi.ac.uk/vol1/fastq/ERR008/ERR008901/ERR008901_1.fastq.gz
    
becomes
    
    fasp@fasp.sra.ebi.ac.uk:/vol1/fastq/ERR008/ERR008901/ERR008901_1.fastq.gz
    
You aspera command would need to look like

     ascp -i bin/aspera/etc/asperaweb_id_dsa.openssh -Tr -Q -l 100M -L- fasp@fasp.sra.ebi.ac.uk:/vol1/fastq/ERR008/ERR008901/ERR008901_1.fastq.gz ./
     
Full documentation about how to use aspera to download files from the ENA please see their document [Downloading sequence files](https://www.ebi.ac.uk/ena/browse/read-download#downloading_files_aspera)

**Can I access 1000 Genomes data with Globus Online?**

The 1000 Genomes FTP site is available as an end point in the [Globus Online system](https://www.globus.org/).  In order to access the data you need to sign up for an account with Globus via their [signup page](https://www.globus.org/SignUp). You must also install the [Globus Connect Personal software](https://support.globus.org/entries/24044351) and setup a personal endpoint to download the data too.

The 1000 Genomes data is hosted at the EMBL-EBI end point called "Shared EMBL-EBI public endpoint". Data from our FTP site can then be found under the 1000g directory within the EMBL-EBI public end point.

![screen_shot](/sites/1000genomes.org/files/documents/globus_screenshot_20190812.png)

When you have setup your personal end point you should be able to start a transfer using their web interface.

The Globus website has support for [setting up accounts](https://support.globus.org/entries/23583857-Sign-Up-and-Transfer-Files-with-Globus-Online), and [installing the globus personal connect software](https://support.globus.org/forums/22130516-Globus-Connect-Personal).

**Can I get 1000 Genomes data on the Amazon Cloud?**

At the end of the 1000 Genomes Project, a large volume of the 1000 Genomes data (the majority of the FTP site) was available on the Amazon AWS cloud as a [public data set](http://aws.amazon.com/datasets/4383).

At the end of the 1000 Genomes Project, the [IGSR](/about) was established and the [FTP site has been further developed](/announcements/our-plan-rearrange-1000-genomes-ftp-site-2015-09-07/) since the conclusion of the 1000 Genomes Project, adding additional data sets. The Amazon AWS cloud reflects the data as it was at the end of the 1000 Genomes Project and does not include any updates or new data.

You can find more information about how to use the data in the Amazon AWS cloud on our [AWS help page](/using-1000-genomes-data-amazon-web-service-cloud).

**Further details**

For further information, please contact info@1000genomes.org.
