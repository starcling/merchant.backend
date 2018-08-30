DELIMITER $$
CREATE DEFINER=`db_service`@`localhost` PROCEDURE `encrypt`(
  IN input VARCHAR(300),
  IN keyName VARCHAR(300),
  OUT cipher VARCHAR(1000)
)
BEGIN
CALL get_key(keyName, @a);
SELECT HEX(AES_ENCRYPT(input, @a)) into cipher;
END $$
DELIMITER ;