---
layout: faq
title: "Why are phase 1 sites missing from the phase 3 dataset?"
faq_tags:
  - data-analysis
  - phase-1
  - phase-3
  - variants
faq_related:
  - are-1000-genomes-variant-calls-phased
  - are-1000-genomes-variants-dbsnp
  - where-are-your-variant-files-located
---
                    

The phase 1 variants list released in 2012 and the phase 3 variants list released in 2014 overlap but phase 3 is not a complete superset of phase 1\.  The variant positions between phase 3 and phase 1 releases were compared using their positions. This shows that 2.3M phase 1 sites are not present in phase 3.  Of the 2.3M sites, 1.92M are SNPs, the rest are either indels or structural variations (SVs).  

The difference between the two lists can be explained by a number of different reasons.

1\. Some phase 1 samples were not used in phase 3 for various reasons. If a sample was not part of phase 3, variants private to this sample are not be part of the phase 3 set.  

2\.  Our input sequence data is different. In phase 1 we had a mixture of both read lengths 36bp to >100bp and a mixture of sequencing platforms, Illumina, ABI SOLiD and 454\. In phase 3 we only used data from the Illumina sequencing platform and we only used read lengths of 70bp+

Reasons 1 and 3, the absent samples and non-Illumina data can explain 548K missing SNPs, leaving 1.37M SNPs still to be explained

3\.  The phase 1 and phase 3 variant calling pipelines are different. Phase 3 had an expanded set of variant callers, used haplotype aware variant callers and variant callers that used de novo assembly. It considered low coverage and exome sequence together rather than independently. Our genotype calling was also different using ShapeIt2 and MVNcall, allowing integration of multi allelic variants and complex events that weren't possible in phase 1\.  

891K of the 1.37M sites missing from phase 1 were not identified by any phase 3 variant caller. These 891K SNPs have relatively high Ts/Tv ratio (1.84), which means these were likely missed in phase 3 because they are very rare, not because they are wrong; the increase in sample number in phase 3 made it harder to detect very rare events especially if the extra 1400 samples in phase 3 did not carry the alternative allele.

481K SNPs of these snps were initially called in phase 3\. 340K of them failed our initial SVM filter so were not included in our final merged variant set. 57K overlapped with larger variant events so were not accurately called. 84K sites did not make it into our final set of genotypes due to losses in our pipeline. Some of these sites will be false positives but we have no strong evidence as to which of these sites are wrong and which were lost for other reasons.

4\.  The reference genomes used for our alignments are different. Phase 1 alignments were aligned to the standard GRCh37 primary reference including unplaced contigs. In phase 3 we added EBV and a decoy set to the reference to reduce mismapping. This will have reduced our false positive variant calling as it will have reduced mismapping leading to false SNP calls. We cannot quantify this effect.

We have made no attempt to eludcidate why our SV and indel numbers changed. Since the release of phase 1 data, the algorithms to detect and validate indels and SVs have improved dramatically. By and large, we assume the indels and SVs in phase 1 that are missing from phase 3 are false positive in phase 1.  

You can get more details about our comparison from [ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/supporting/phase1_sites_missing_in_phase3/](file://localhost/vol1/ftp/release/20130502/supporting/phase1_sites_missing_in_phase3)
