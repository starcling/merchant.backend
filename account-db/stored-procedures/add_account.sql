DELIMITER $$
CREATE DEFINER=`db_service`@`localhost` PROCEDURE `add_account`(
  IN address VARCHAR(300), 
  IN pKey VARCHAR(300),
  IN keyName VARCHAR(300) 
)
BEGIN
CALL encrypt(pKey, keyName, @pKey);
INSERT INTO account (address, privateKey) VALUES(address, @pKey);
END $$
DELIMITER ;