DELIMITER ;;
CREATE DEFINER=`db_service`@`%` PROCEDURE `rotate_account_keys`(
	IN oldKeyName VARCHAR(100),
	IN newKeyName VARCHAR(100)
)
BEGIN
 
 DECLARE v_finished INTEGER DEFAULT 0;
 DECLARE v_address varchar(100) DEFAULT "";
 
 -- declare cursor for employee email
 DEClARE address_cursor CURSOR FOR 
 SELECT address FROM account;
 
 -- declare NOT FOUND handler
 DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET v_finished = 1;
 
 OPEN address_cursor;
 
 get_address: LOOP
 
 FETCH address_cursor INTO v_address;
 
 IF v_finished = 1 THEN 
 LEAVE get_address;
 END IF;
 
 CALL decrypt_private_key(v_address, oldKeyName, @privateKeyDecrypted);
  if @privateKeyDecrypted is not null then 
    CALL encrypt(@privateKeyDecrypted, newKeyName, @newPrivateKeyEncrypted);
    if @newPrivateKeyEncrypted is not null then
      UPDATE account SET privateKey = @newPrivateKeyEncrypted WHERE address = v_address;
    end if;
  end if;

 END LOOP get_address;
 
 CLOSE address_cursor;
 
END;;
DELIMITER ;