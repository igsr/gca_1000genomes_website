---
layout: single_section
title: "Using 1000 Genomes Data in the Amazon Web Service Cloud"
permalink: /using-1000-genomes-data-amazon-web-service-cloud/
---

# Using 1000 Genomes Data in the Amazon Web Service Cloud

Here are some basic instructions on how to use the 1000 genomes data that is available in the Amazon Web Service Cloud (AWS) and how to run our [tutorial](/using-1000-genomes-data).

Amazon provides lots of useful documentation about [setting up accounts](http://aws.amazon.com/ec2/), [launching instances](http://docs.amazonwebservices.com/AWSEC2/latest/GettingStartedGuide/LaunchInstance.html?r=3051) and [starting sessions](http://docs.amazonwebservices.com/AWSEC2/latest/GettingStartedGuide/ConnectToInstanceLinux.html). General documentation for getting started can also be found in their [Getting Started Guide](http://docs.amazonwebservices.com/AWSEC2/latest/GettingStartedGuide/)

### The Data Set

The dataset is provided as an S3 "bucket" (located at: s3://1000genomes), so access via S3 methods are available and described here ([http://aws.amazon.com/documentation/s3/](http://aws.amazon.com/documentation/s3/)). Using native S3 methods, data can be programmatically accessed via Perl, Ruby and other languages. Access to this data can also be accomplished via command line tools provided by others, such as s3cmd ([http://s3tools.org/s3cmd](http://s3tools.org/s3cmd)), or aws ([http://timkay.com/aws/](http://timkay.com/aws/)). Using command line methods, files can thus be retrieved from S3 and fed directly into existing pipelines.

### The Tutorial

**Getting Started**

We have provided an instance containing all the software needed to run our tutorial. To find this instance you need to search for **ami-fad40b93**

Once you have your instance setup an example command to connect to the instance would look like:

    ssh -i ~/.ssh/my1000tutorial.pem onekgenomes@ec2-23-20-189-94.compute-1.amazonaws.com

Replace “my1000tutorial.pem” with the path to the key pair file you generated/downloaded when launching the instance.

**Running the Tutorial**

Complete tutorial documentation for our web-based and command line based tutorials can be found in

    /home/onekgenomes/tutorial

Before starting the tutorial it may be convenient to amend the PATH ENV to include the location of the samtools, tabix and vcftools executables. If you are using the default bash shell you can use

    PATH=$PATH:/home/onekgenomes/bin/:/home/onekgenomes/vcftools/bin

To check everything has worked you should test the command line

    tabix ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/working/20120131_omni_genotypes_and_intensities/Omni25_genotypes_2141_samples.b37.vcf.gz 6:31830969-31834280 6:31830969-31834280 | cut -f 1-5

This should return results similar to:

    onekgenomes@ip-10-194-26-207:~/tutorial$ tabix ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/technical/working/20120131_omni_genotypes_and_intensities/Omni25_genotypes_2141_samples.b37.vcf.gz 6:31830969-31834280 | cut -f 1-5
    6 31833221  G A
    6 31833504  G A
    6 31834197  C T
    onekgenomes@ip-10-194-26-207:~/tutorial$

You can now begin the command line based tutorial described in:

    /home/onekgenomes/tutorialG1K_commandline_based_tutorial_exercises_20120217.pdf
    /home/onekgenomes/tutorialG1K_commandline_based_tutorial_exercises_20120217.doc

You can also get these documents from [{{site.url}}/using-1000-genomes-data](/using-1000-genomes-data)

### Other Tools

Access to the 1000 genomes S3 bucket is also preconfigured in Cloudbiolinux ([http://cloudbiolinux.org](http://cloudbiolinux.org)). So instantiating an instance on Amazon EC2 will provide direct access to the data, as well as provide a host of tools for analysis. Instructions to do so are on the Cloudbiolinux site.
