---
layout: single_section
title: "VCF (Variant Call Format) version 4.0"
permalink: /wiki/Analysis/vcf4.0/
redirect_from:
    - /node/101/
---

## {{page.title}}
    
Please see [VCF_4.0_sv](/wiki/Analysis/Variant%20Call%20Format/VCF%20%28Variant%20Call%20Format%29%20version%204.0/encoding-structural-variants) for the conventions and extensions adopted by the 1000 Genomes Project for encoding structural variations in VCF 4.0 format.

### 0\. Example
{: #example}

VCF is a text file format (most likely stored in a compressed manner). It contains meta-information lines, a header line, and then data lines each containing information about a position in the genome.

There is an option whether to contain genotype information on samples for each position or not.

Example:

    ##fileformat=VCFv4.0
    ##fileDate=20090805
    ##source=myImputationProgramV3.1
    ##reference=1000GenomesPilot-NCBI36
    ##phasing=partial
    ##INFO=<ID=NS,Number=1,Type=Integer,Description="Number of Samples With Data">
    ##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
    ##INFO=<ID=AF,Number=.,Type=Float,Description="Allele Frequency">
    ##INFO=<ID=AA,Number=1,Type=String,Description="Ancestral Allele">
    ##INFO=<ID=DB,Number=0,Type=Flag,Description="dbSNP membership, build 129">
    ##INFO=<ID=H2,Number=0,Type=Flag,Description="HapMap2 membership">
    ##FILTER=<ID=q10,Description="Quality below 10">
    ##FILTER=<ID=s50,Description="Less than 50% of samples have data">
    ##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
    ##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">
    ##FORMAT=<ID=DP,Number=1,Type=Integer,Description="Read Depth">
    ##FORMAT=<ID=HQ,Number=2,Type=Integer,Description="Haplotype Quality">
    #CHROM POS     ID        REF ALT    QUAL FILTER INFO                              FORMAT      NA00001        NA00002        NA00003
    20     14370   rs6054257 G      A       29   PASS   NS=3;DP=14;AF=0.5;DB;H2           GT:GQ:DP:HQ 0|0:48:1:51,51 1|0:48:8:51,51 1/1:43:5:.,.
    20     17330   .         T      A       3    q10    NS=3;DP=11;AF=0.017               GT:GQ:DP:HQ 0|0:49:3:58,50 0|1:3:5:65,3   0/0:41:3
    20     1110696 rs6040355 A      G,T     67   PASS   NS=2;DP=10;AF=0.333,0.667;AA=T;DB GT:GQ:DP:HQ 1|2:21:6:23,27 2|1:2:0:18,2   2/2:35:4
    20     1230237 .         T      .       47   PASS   NS=3;DP=13;AA=T                   GT:GQ:DP:HQ 0|0:54:7:56,60 0|0:48:4:51,51 0/0:61:2
    20     1234567 microsat1 GTCT   G,GTACT 50   PASS   NS=3;DP=9;AA=G                    GT:GQ:DP    0/1:35:4       0/2:17:2       1/1:40:3

This example shows in order a good simple SNP, a possible SNP that has been filtered out because its quality is below 10, a site at which two alternate alleles are called, with one of them (T) being ancestral (possibly a reference sequencing error), a site that is called monomorphic reference (i.e. with no alternate alleles), and a microsatellite with two alternative alleles, one a deletion of 3 bases (TCT), and the other an insertion of one base (A). Genotype data are given for three samples, two of which are phased and the third unphased, with per sample genotype quality, depth and haplotype qualities (the latter only for the phased samples) given as well as the genotypes. The microsatellite calls are unphased.

### 1\. Meta-information lines
{: #meta-information_lines}

File meta-information is included after the ## string, often as key=value pairs.

The 'fileformat' field is always required and should detail the VCF format version number. For example, for VCF version 4.0, this line should read:

\##fileformat=VCFv4.0

It is strongly encouraged that information lines describing the INFO, FILTER and FORMAT entries used in the body of the VCF file be included in the meta-information section. Although they are optional, if these lines are present then they must be completely well-formed.

INFO fields should be described as follows (all keys are required):

\##INFO=<ID=_ID_,Number=_number_,Type=_type_,Description=”_description_”>

Possible Types for INFO fields are: Integer, Float, Flag, Character, and String.

The Number entry is an Integer that describes the number of values that can be included with the INFO field. For example, if the INFO field contains a single number, then this value should be 1\. However, if the INFO field describes a pair of numbers, then this value should be 2 and so on. If the number of possible values varies, is unknown, or is unbounded, then this value should be '.'. Possible Types are: Integer, Float, Character, String and Flag. The 'Flag' type indicates that the INFO field does not contain a Value entry, and hence the Number should be 0 in this case. The Description value must be surrounded by double-quotes.

FILTERs that have been applied to the data should be described as follows:

\##FILTER=<ID=_ID_,Description=”_description_”>

Likewise, Genotype fields specified in the FORMAT field should be described as follows:

\##FORMAT=<ID=_ID_,Number=_number_,Type=_type_,Description=”_description_”>

Possible Types for FORMAT fields are: Integer, Float, Character, and String.

### 2\. The header line syntax
{: #the_header_line_syntax}

The header line names the 8 fixed, mandatory columns. These columns are as follows:

1.  \#CHROM
2.  POS
3.  ID
4.  REF
5.  ALT
6.  QUAL
7.  FILTER
8.  INFO

If genotype data is present in the file, these are followed by a FORMAT column header, then an arbitrary number of sample IDs. The header line is tab-delimited.

### 3\. Data lines
{: #data_lines}

##### Fixed fields
{: #fixed_fields}

There are 8 fixed fields per record. All data lines are tab-delimited. In all cases, missing values are specified with a dot (”.”). Fixed fields are:

1.  CHROM chromosome: an identifier from the reference genome. All entries for a specific CHROM should form a contiguous block within the VCF file.(Alphanumeric String, Required)
2.  POS position: The reference position, with the 1st base having position 1\. Positions are sorted numerically, in increasing order, within each reference sequence CHROM. (Integer, Required)
3.  ID semi-colon separated list of unique identifiers where available. If this is a dbSNP variant it is encouraged to use the rs number(s). No identifier should be present in more than one data record. If there is no identifier available, then the missing value should be used. (Alphanumeric String)
4.  REF reference base(s): Each base must be one of A,C,G,T,N. Bases should be in uppercase. Multiple bases are permitted. The value in the POS field refers to the position of the first base in the String. For InDels, the reference String must include the base before the event (which must be reflected in the POS field). (String, Required).
5.  ALT comma separated list of alternate non-reference alleles called on at least one of the samples. Options are base Strings made up of the bases A,C,G,T,N, or an angle-bracketed ID String (*"\<ID\>"*). If there are no alternative alleles, then the missing value should be used. Bases should be in uppercase. (Alphanumeric String; no whitespace, commas, or angle-brackets are permitted in the ID String itself)
6.  QUAL phred-scaled quality score for the assertion made in ALT. i.e. give -10log_10 prob(call in ALT is wrong). If ALT is ”.” (no variant) then this is -10log_10 p(variant), and if ALT is not ”.” this is -10log_10 p(no variant). High QUAL scores indicate high confidence calls. Although traditionally people use integer phred scores, this field is permitted to be a floating point to enable higher resolution for low confidence calls if desired. (Numeric)
7.  FILTER filter: PASS if this position has passed all filters, i.e. a call is made at this position. Otherwise, if the site has not passed all filters, a semicolon-separated list of codes for filters that fail. e.g. “q10;s50” might indicate that at this site the quality is below 10 and the number of samples with data is below 50% of the total number of samples. “0” is reserved and should not be used as a filter String. If filters have not been applied, then this field should be set to the missing value. (Alphanumeric String)
8.  INFO additional information: (Alphanumeric String) INFO fields are encoded as a semicolon-separated series of short keys with optional values in the format: \<key\>=\<data\>[,data]. Arbitrary keys are permitted, although the following sub-fields are reserved (albeit optional):
    *   AA ancestral allele
    *   AC allele count in genotypes, for each ALT allele, in the same order as listed
    *   AF allele frequency for each ALT allele in the same order as listed: use this when estimated from primary data, not called genotypes
    *   AN total number of alleles in called genotypes
    *   BQ RMS base quality at this position
    *   CIGAR cigar string describing how to align an alternate allele to the reference allele
    *   DB dbSNP membership
    *   DP combined depth across samples, e.g. DP=154
    *   END end position of the variant described in this record (esp. for CNVs)
    *   H2 membership in hapmap2
    *   MQ RMS mapping quality, e.g. MQ=52
    *   MQ0 Number of MAPQ == 0 reads covering this record
    *   NS Number of samples with data
    *   SB strand bias at this position
    *   SOMATIC indicates that the record is a somatic mutation, for cancer genomics
    *   VALIDATED validated by follow-up experiment

etc. The exact format of each INFO sub-field should be specified in the meta-information (as described above).

Example for an INFO field: DP=154;MQ=52;H2\. Keys without corresponding values are allowed in order to indicate group membership (e.g. H2 indicates the SNP is found in HapMap 2). It is not necessary to list all the properties that a site does NOT have, by e.g. H2=0.

##### Genotype fields
{: #genotype_fields}

If genotype information is present, then the same types of data must be present for all samples. First a FORMAT field is given specifying the data types and order. This is followed by one field per sample, with the colon-separated data in this field corresponding to the types specified in the format. The first sub-field must always be the genotype (GT).

As with the INFO field, there are several common, reserved keywords that are standards across the community:

*   GT genotype, encoded as alleles values separated by either of ”/” or “\|”, e.g. The allele values are 0 for the reference allele (what is in the reference sequence), 1 for the first allele listed in ALT, 2 for the second allele list in ALT and so on. For diploid calls examples could be 0/1 or 1\|0 etc. For haploid calls, e.g. on Y, male X, mitochondrion, only one allele value should be given. All samples must have GT call information; if a call cannot be made for a sample at a given locus, ”.” must be specified for each missing allele in the GT field (for example ./. for a diploid). The meanings of the separators are:
    *   / : genotype unphased
    *   \| : genotype phased
*   DP read depth at this position for this sample (Integer)
*   FT sample genotype filter indicating if this genotype was “called” (similar in concept to the FILTER field). Again, use PASS to indicate that all filters have been passed, a semi-colon separated list of codes for filters that fail, or ”.” to indicate that filters have not been applied. These values should be described in the meta-information in the same way as FILTERs (Alphanumeric String)
*   GL : three floating point log10-scaled likelihoods for AA,AB,BB genotypes where A=ref and B=alt; not applicable if site is not biallelic. For example: GT:GL 0/1:-323.03,-99.29,-802.53 (Numeric)
*   GQ genotype quality, encoded as a phred quality -10log_10p(genotype call is wrong) (Numeric)
*   HQ haplotype qualities, two phred qualities comma separated (Numeric)

If any of the fields is missing, it is replaced with the missing value. For example if the format is GT:GQ:DP:HQ then A\|A:.:23:23,34 indicates that GQ is missing. Trailing fields can be dropped (with the exception of the GT field, which should always be present).

Additional Genotype fields can be defined in the meta-information. However, software support for such fields is not guaranteed.

### 4\. Understanding the VCF format and the haplotype representation
{: #understanding_the_vcf_format_and_the_haplotype_representation}

VCF records use a single general system for representing genetic variation data composed of:

*   Allele: representing single genetic haplotypes (A, T, ATC).
*   Genotype: an assignment of alleles for each chromosome of a single named sample at a particular locus.
*   VCF record: a record holding all segregating alleles at a locus (as well as genotypes, if appropriate, for multiple individuals containing alleles at that locus).

VCF records use a simple haplotype representation for REF and ALT alleles to describe variant haplotypes at a locus. ALT haplotypes are constructed from the REF haplotype by taking the REF allele bases at the POS in the reference genotype and replacing them with the ALT bases. In essence, the VCF record specifies a-REF-t and the alternative haplotypes are a-ALT-t for each alternative allele.

#### How do I represent example variation in VCF records?
{: #how_do_i_represent_example_variation_in_vcf_records}

For example, suppose we are looking at a locus in the genome:

    Ref: a t C g a // C is the reference base
       : a t G g a // C base is a G in some individuals
       : a t - g a // C base is deleted w.r.t. the reference
       : a t CAg a // A base is inserted w.r.t. the reference sequence

In the above cases, what are the alleles and how would they be represented as a VCF record?

\* First is a SNP polymorphism of C/G → { C , G } → C is the reference allele

    20     3 .         C      G       .   PASS  DP=100

\* Second, 1 base deletion of C → { tC , t } → tC is the reference allele

    20     2 .         TC      T      .   PASS  DP=100

\* Third, 1 base insertion of A → { tC ; tCA } → tC is the reference allele

    20     2 .         TC      TCA    .   PASS  DP=100

Suppose I see a the following in a population of individuals and want to represent these three segregating alleles:

    Ref: a t C g a // C is the reference base
       : a t G g a // C base is a G in some individuals
       : a t - g a // C base is deleted w.r.t. the

How do I represent this? There are three segregating alleles: { tC , tG , t } with a corresponding VCF record:

    20     2 .         TC      TG,T    .   PASS  DP=100

Now suppose I have this more complex example:

    Ref: a t C g a // C is the reference base
       : a t - g a
       : a t - - a
       : a t CAg a

There are actually four segregating alleles: { tCg , tg, t, and tCAg } over bases 2-4\. This complex set of allele is represented in VCF as:

    20     2 .         TCG      TG,T,TCAG    .   PASS  DP=100

Note that in VCF records, the molecular equivalence explicitly listed above in the per-base alignment is discarded, so the actual placement of equivalent g isn't retained.

For completeness, VCF records are dynamically typed, so whether a VCF record is a SNP, Indel, Mixed, or Reference site depends on the properties of the alleles in the record.

#### What do example VCF records indicate as variation from the reference?
{: #what_do_example_vcf_records_indicate_as_variation_from_the_reference}

##### SNP VCF record
{: #snp_vcf_record"}

Suppose I receive the following VCF record:

    20     3 .         C      T    .   PASS  DP=100

This is a SNP since its only single base substitution and there are only two alleles so I have the two following segregating haplotypes:

    Ref: a t C g a // C is the reference base
       : a t T g a // C base is a T in some individuals

##### Insertion VCF record
{: #insertion_vcf_record}

Suppose I receive the following VCF record:

    20     3 .         C      CTAG    .   PASS  DP=100

This is a insertion since the reference base C is being replaced by C [the reference base] plus three insertion bases TAG. Again there are only two alleles so I have the two following segregating haplotypes:

    Ref: a t C - - - g a // C is the reference base
       : a t C T A G g a // following the C base is an insertion of 3 bases

##### Deletion VCF record
{: #deletion_vcf_record}

Suppose I receive the following VCF record:

    20     2 .         TCG      T    .   PASS  DP=100

This is a deletion of two reference bases since the reference allele TCG is being replaced by just the T [the reference base]. Again there are only two alleles so I have the two following segregating haplotypes:

    Ref: a t C g a // C is the reference base
       : a t - - a // following the C base is a deletion of 2 bases

##### Mixed VCF record for a microsatellite
{: #mixed_vcf_record_for_a_microsatellite}

Suppose I receive the following VCF record:

    20     2 .         TCGCG      TCG,TCGCGCG    .   PASS  DP=100

This is a mixed type record containing a 2 base insertion and a 2 base deletion. There are are three segregating alleles so I have the three following haplotypes:

    Ref: a t c g c g - - a // C is the reference base
       : a t c g - - - - a // following the C base is a deletion of 2 bases
       : a t c g c g c g a // following the C base is a insertion of 2 bases

Note that in all of these examples dashes have been added to make the haplotypes clearer but of course the equivalence among bases isn't provided by the VCF. Technically the following is an equivalent alignment:

    Ref: a t c g - - c g a // C is the reference base
       : a t c g - - - - a // following the C base is a deletion of 2 bases
       : a t c g c g c g a // following the C base is a insertion of 2 bases
