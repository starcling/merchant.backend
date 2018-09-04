DELIMITER ;;
CREATE DEFINER=`db_service`@`localhost` PROCEDURE `decrypt_private_key`(
  IN accountAddress VARCHAR(300),
  IN keyName VARCHAR(300),
  OUT decryptedKey VARCHAR(1000)
)
BEGIN
DECLARE accountKey VARCHAR(1000);
  SET accountKey = (SELECT privateKey FROM account
  WHERE account.address = accountAddress);
  CALL decrypt(accountKey, keyName, decryptedKey);
END;;
DELIMITER ;
