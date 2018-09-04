DELIMITER ;;
CREATE DEFINER=`db_service`@`localhost` PROCEDURE `get_decrypted_mnemonic`(
  IN _id VARCHAR(255),
  IN keyName VARCHAR(300)
)
BEGIN
DECLARE mnemonicKey VARCHAR(1000);

set @a = (select mnemonic from mnemonics where id = _id);
if @a is null then 
signal sqlstate '02000'
set message_text = 'Provided id is not found in the mnemonic table';
end if;

CALL decrypt_mnemonic(_id, keyName, @mnemonicKey);

if @mnemonicKey is null then 
	signal sqlstate '02000'
  set message_text = 'mnemonic_id not found in mnemonic table.';
end if;

SELECT @mnemonicKey;
END;;
DELIMITER ;
