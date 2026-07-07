CREATE TABLE sample (
  sample_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name CHAR(16) NOT NULL,
  biosample_id CHAR(12),
  population_id INT UNSIGNED,
  sex CHAR(1),
  UNIQUE (name)
);

CREATE TABLE superpopulation (
  superpopulation_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code CHAR(3) NOT NULL,
  name VARCHAR(255),
  UNIQUE (code)
);

CREATE TABLE population (
  population_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  superpopulation_id INT UNSIGNED,
  code CHAR(3) NOT NULL,
  name VARCHAR(255),
  description VARCHAR(255),
  UNIQUE (code),
  CONSTRAINT FOREIGN KEY (superpopulation_id) references superpopulation(superpopulation_id)
);

CREATE TABLE data_collection (
  data_collection_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(255) NOT NULL,
  title VARCHAR(256) NOT NULL,
  short_title VARCHAR(256) NOT NULL,
  display_order TINYINT UNSIGNED,
  reuse_policy VARCHAR(256),
  reuse_policy_precedence TINYINT UNSIGNED,
  website VARCHAR(256),
  publication VARCHAR(256),
  UNIQUE(code)
);

CREATE TABLE analysis_group (
  analysis_group_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(255) NOT NULL,
  description VARCHAR(256) NOT NULL,
  short_title VARCHAR(255) NOT NULL,
  table_display_order TINYINT UNSIGNED,
  UNIQUE(code)
);

CREATE TABLE data_type (
  data_type_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(255) NOT NULL,
  UNIQUE(code)
);

CREATE TABLE file (
  file_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(256) NOT NULL,
  url_crc INT UNSIGNED NOT NULL,
  md5 VARCHAR(32),
  data_type_id INT UNSIGNED,
  analysis_group_id INT UNSIGNED,
  foreign_file TINYINT(1),
  in_current_tree TINYINT(1),
  indexed_in_elasticsearch TINYINT(1),
  UNIQUE(url_crc, url),
  CONSTRAINT FOREIGN KEY (data_type_id) references data_type(data_type_id),
  CONSTRAINT FOREIGN KEY (analysis_group_id) references analysis_group(analysis_group_id)
);

CREATE TABLE sample_synonym (
  sample_id INT UNSIGNED NOT NULL,
  synonym VARCHAR(255) NOT NULL
);

CREATE TABLE sample_relationship (
  subject_sample_id INT UNSIGNED NOT NULL,
  relation_sample_id INT UNSIGNED NOT NULL,
  type VARCHAR(255) NOT NULL,
  UNIQUE (subject_sample_id,relation_sample_id)
);

CREATE TABLE sample_file (
  sample_id INT UNSIGNED NOT NULL,
  file_id INT UNSIGNED NOT NULL,
  UNIQUE (sample_id,file_id),
  CONSTRAINT FOREIGN KEY (sample_id) references sample(sample_id),
  CONSTRAINT FOREIGN KEY (file_id) references file(file_id)
);

CREATE TABLE file_data_collection (
  file_id INT UNSIGNED NOT NULL,
  data_collection_id INT UNSIGNED NOT NULL,
  UNIQUE (data_collection_id,file_id),
  CONSTRAINT FOREIGN KEY (data_collection_id) references data_collection(data_collection_id),
  CONSTRAINT FOREIGN KEY (file_id) references file(file_id)
);

CREATE TABLE current_tree_log (
  current_tree_log_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  current_tree_mtime TIMESTAMP,
  loaded_into_db TIMESTAMP,
  loaded_into_elasticsearch TIMESTAMP
);
