---
title: "Can I access 1000 Genomes data with Globus Online?"
faq_tags:
  - data-access
  - ftp
  - globus
faq_related:
  - how-download-files-using-aspera
  - do-i-need-password-access-1000-genomes-data
  - where-most-recent-release
---
                    
The 1000 Genomes FTP site is available as an end point in the [Globus Online system](https://www.globus.org/).  In order to access the data you need to sign up for an account with Globus via their [signup page](https://www.globus.org/SignUp). You must also install the [Globus Connect Personal software](https://support.globus.org/entries/24044351) and setup a personal endpoint to download the data too.

The 1000 Genomes data is hosted at the EMBL-EBI end point called ebi#public. Data from our FTP site can then be found under the 1000g directory within the EMBL-EBI public end point.

![screen_shot](/sites/1000genomes.org/files/documents/screen_shot_2015-11-27_at_27-11-20151_.34.10_0.png)

When you have setup your personal end point you should be able to start a transfer using their web interface.

The Globus website has support for [setting up accounts](https://support.globus.org/entries/23583857-Sign-Up-and-Transfer-Files-with-Globus-Online), and [installing the globus personal connect software](https://support.globus.org/forums/22130516-Globus-Connect-Personal).
