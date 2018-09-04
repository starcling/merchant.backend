DELIMITER $$
CREATE DEFINER=`db_service`@`localhost` PROCEDURE `add_mnemonic`(
  IN id VARCHAR(255), 
  IN mnemonic VARCHAR(2000), 
  IN keyName VARCHAR(300) 
)
BEGIN
CALL encrypt(mnemonic, keyName, @mnemonic);
INSERT INTO mnemonics (id, mnemonic) VALUES(id, @mnemonic);
END $$
DELIMITER ;