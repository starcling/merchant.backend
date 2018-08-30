DELIMITER $$
CREATE DEFINER=`db_service`@`localhost` PROCEDURE `get_key`(
  IN keyName VARCHAR(100),
  OUT myKey VARCHAR(1000)
)
BEGIN
SELECT HEX(keyring_key_fetch(keyName)) into myKey;
END $$
DELIMITER ;