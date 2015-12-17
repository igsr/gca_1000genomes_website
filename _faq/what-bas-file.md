---
layout: faq
title: "What is a bas file?"
faq_tags:
  - alignment
  - bam
  - bas
  - file-format
faq_related:
  - how-are-your-alignments-generated
  - what-format-are-your-alignments-and-what-do-names-mean
  - where-are-your-alignment-files-located
---
                    
Bas files are statistics we generate for our alignment files which we distribute alongside our alignment files. 

These are readgroup level statistics in a tab delimited manner and they contain these columns also described in this [README](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/README.alignment_data)

Column 1 'bam_filename': The DCC bam file name in which the readgroup data can be found.

Column 2 'md5': The md5 checksum of the bam file named in column 1.

Column 3 'study': The SRA study id this readgroup belongs to.

Column 4 'sample': The sample (individual) identifier the readgroup came from.

Column 5 'platform': The sequencing platform (technology) used to sequence the readgroup.

Column 6 'library': The name of the library used for the readgroup.

Column 7 'readgroup': The readgroup identifier. This is unique per .bas file. The remaining columns summarise data for reads with this RG tag in the bam file given in column 1.

Column 8 '#_total_bases': The sum of the length of all reads in this readgroup.

Column 9 '#_mapped_bases': The sum of the length of all reads in this readgroup that did not have flag 4 (== unmapped).

Column 10 '#_total_reads': The total number of reads in this readgroup.

Column 11 '#_mapped_reads': The total number of reads in this readgroup that did not have flag 4 (== unmapped).

Column 12 '#_mapped_reads_paired_in_sequencing': As for column 10, but also requiring flag 1 (== reads paired in sequencing).

Column 13 '#_mapped_reads_properly_paired': As for column 10, but also requiring flag 2 (== mapped in a proper pair, inferred during alignment).

Column 14 '%_of_mismatched_bases': Calculated by summing the read lengths of all reads in this readgroup that have an NM tag, summing the edit distances obtained from the NM tags, and getting the percentage of the latter out of the former to 2 decimal places.

Column 15 'average_quality_of_mapped_bases': The mean of all the base qualities of the bases counted for column 8, to 2 decimal places.

Column 16 'mean_insert_size': The mean of all insert sizes (ISIZE field) greater than 0 for properly paired reads (as counted in column 12) and with a mapping quality (MAPQ field) greater than 0\. Rounded to the nearest whole number.

Column 17 'insert_size_sd': The standard deviation from the mean of insert sizes considered for column 15\. To 2 decimal places.

Column 18 'median_insert_size': The median insert size, using the same set of insert sizes considered for column 15.

Column 19 'insert_size_median_absolute_deviation': The median absolute deviation of the column 17 data.

Column 20 '#_duplicate_reads': The number of reads which were marked as duplicates

Column 21' #_duplicate_bases': The number of bases which were marked as duplicated

Each mapped and unmapped bam file has an assocaited bas file and we provide them collected together into a single file in the [alignment_indices](http://ftp.1000genomes.ebi.ac.uk/vol1/ftp/alignment_indices/) directory, dated to match the alignment release.
