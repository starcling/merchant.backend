DELIMITER ;;
CREATE DEFINER=`db_service`@`localhost` PROCEDURE `decrypt_mnemonic`(
  IN id VARCHAR(255),
  IN keyName VARCHAR(300),
  OUT decryptedKey VARCHAR(1000)
)
BEGIN
DECLARE mnemonicKey VARCHAR(1000);
  SET mnemonicKey = (SELECT mnemonic FROM mnemonics
  WHERE mnemonics.id = id);
  CALL decrypt(mnemonicKey, keyName, decryptedKey);
END;;
DELIMITER ;
