INSTALL PLUGIN keyring_udf SONAME 'keyring_udf.so';

CREATE FUNCTION keyring_key_generate RETURNS INTEGER SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_fetch RETURNS STRING SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_length_fetch RETURNS INTEGER SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_type_fetch RETURNS STRING SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_store RETURNS INTEGER SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_remove RETURNS INTEGER SONAME 'keyring_udf.so';

GRANT EXECUTE ON *.* TO db_service;

/***CREATING ALL TABLES*/
CREATE TABLE account (
  id   INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  address  VARCHAR(100) UNIQUE                 NOT NULL,
  privateKey     VARCHAR(2000)                    NULL
)
  ENGINE = INNODB ENCRYPTION='Y';

CREATE TABLE mnemonics (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  mnemonic VARCHAR(2000) UNIQUE NOT NULL
)
  ENGINE = INNODB ENCRYPTION='Y';
