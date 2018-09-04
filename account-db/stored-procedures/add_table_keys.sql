DELIMITER $$
CREATE DEFINER=`db_service`@`localhost` PROCEDURE `add_table_keys`(in keyName varchar(256) )
BEGIN
DECLARE key1 varchar(256);
SET key1 = (SELECT keyring_key_type_fetch(keyName));
if key1 is null then
  SELECT keyring_key_generate(keyName, 'DSA', 256);
end if;

END $$
DELIMITER ;