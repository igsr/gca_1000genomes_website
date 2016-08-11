These markdown become part of the data-collection pages in the data-portal. Editing these pages in github DO NOT trigger automatic updates of the website.

To get this content into the data portal, you must re-run the script that loads ElasticSearch.

    perl ${IGSR_CODE}/scripts/elasticsearch/load_data_collections.es.pl
