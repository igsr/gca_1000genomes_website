---
layout: single_section
title: "Public Ensembl Mysql instance"
permalink: /public-ensembl-mysql-instance/
tags: About
redirect_from:
    - /node/517/
---

# Public Mysql Instance

Like the main [Ensembl project](http://www.ensembl.org/info/data/mysql.html), we now have a public mysql instance containing copies of the databases which sit behind both [http://browser.1000genomes.org](http://browser.1000genomes.org) and [http://pilotbrowser.1000genomes.org](http://pilotbrowser.1000genomes.org)


| Server | User | Password | Port |
|:--:|:--:|:--:|:--:|
|mysql-db.1000genomes.org | anonymous | - | 4272 |

These databases can be accessed using the [Ensembl API](http://www.ensembl.org/info/data/api.html). We provide tarballs of the required apis and the registry files which allow connection to the databases on our ftp site [here](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/browser/). You can also get the code directly from [Ensembl via CVS](http://www.ensembl.org/info/docs/api/api_cvs.html).

Currently this instance on two different schemas.

| Database name | Ensembl Schema | Assembly | Release |
|:--:|:--:|:--:|:--:|
| homo_sapiens_%_60_36p | 60 | NCBI36 | Pilot |
| homo_sapiens_%_73_37 | 73 | GRCh37 | Phase 1 Integrated Variant set |

If you have any questions about 1000 genomes data please email [info@1000genomes.org](mailto:info@1000genomes.org). For questions about the Ensembl api and databases you can also email the [Ensembl dev mailing list](http://www.ensembl.org/info/about/contact/mailing.html)

The [ftp directory](ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/browser/) also contains schema dumps for the databases in case you wish to setup your own instance of the Ensembl database

