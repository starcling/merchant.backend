DELIMITER $$
CREATE DEFINER=`db_service`@`localhost` PROCEDURE `get_mnemonic`(
  IN _id VARCHAR(255)
)
BEGIN
  SELECT mnemonic FROM mnemonics
  WHERE id = _id;
END $$
DELIMITER ;