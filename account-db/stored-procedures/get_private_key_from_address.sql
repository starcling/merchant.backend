DELIMITER ;;
CREATE DEFINER=`db_service`@`localhost` PROCEDURE `get_private_key_from_address`(
  IN accountAddress VARCHAR(300)
)
BEGIN
DECLARE accountKey VARCHAR(1000);

set @accountKey = (select privateKey from account  where address = accountAddress);
if @accountKey is null then 
signal sqlstate '02000'
set message_text = 'Provided address is not found in the account table';
end if;

SELECT @accountKey;
END;;
DELIMITER ;