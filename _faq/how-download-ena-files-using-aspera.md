---
title: "How to download ENA files using aspera?"
faq_tags:
  - aspera
  - data-access
  - tools
  - ENA
faq_related:
  - where-most-recent-release
  - how-download-files-using-aspera
  - can-i-access-1000-genomes-data-globus-online
---

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
     
###Further details

For further information, please contact info@1000genomes.org.
