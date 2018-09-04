DELIMITER $$
CREATE DEFINER=`db_service`@`localhost` PROCEDURE `get_mnemonic`(
  IN id VARCHAR(255)
)
BEGIN
  SELECT mnemonic FROM mnemonics
  WHERE id = id;
END $$
DELIMITER ;