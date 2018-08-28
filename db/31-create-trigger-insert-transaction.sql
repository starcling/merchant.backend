-- FUNCTION: public.fc_create_contracts_transactions(uuid, uuid);

-- DROP FUNCTION public.fc_create_contracts_transactions(uuid, uuid);

CREATE OR REPLACE FUNCTION public.fc_create_contracts_transactions()
    RETURNS TRIGGER
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

BEGIN
    INSERT INTO public.tb_contracts_transactions(
        "contractID", 
        "transactionID")
	VALUES (
        NEW."contractID", 
        NEW.id);
    RETURN NEW;
END

$BODY$;

ALTER FUNCTION public.fc_create_contracts_transactions()
    OWNER TO local_user;

CREATE TRIGGER trigger_after_insert_transactions
     AFTER INSERT ON public.tb_blockchain_transactions
     FOR EACH ROW
     EXECUTE PROCEDURE public.fc_create_contracts_transactions();

-- ALTER EVENT TRIGGER trigger_after_insert_transactions
--     OWNER TO local_user;