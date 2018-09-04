DELIMITER $$
CREATE DEFINER=`db_service`@`localhost` PROCEDURE `decrypt`(
  IN cipher VARCHAR(1000),
  IN keyName VARCHAR(300),
  OUT content VARCHAR(300)
)
BEGIN
CALL get_key(keyName, @a);
SELECT AES_DECRYPT(UNHEX(cipher), @a) into content;
END $$
DELIMITER ;
