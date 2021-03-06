
GRANT EXECUTE ON *.* TO db_service;

/***CREATING ALL TABLES*/
CREATE TABLE account (
  id   INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  address  VARCHAR(100) UNIQUE                 NOT NULL,
  privateKey     VARCHAR(2000)                    NULL
);

CREATE TABLE mnemonics (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  mnemonic VARCHAR(2000) UNIQUE NOT NULL
);
