-- FUNCTION: public.fc_create_transaction(text, integer, integer, uuid, bigint);

-- DROP FUNCTION public.fc_create_transaction(text, integer, integer, uuid, bigint);

CREATE OR REPLACE FUNCTION public.fc_create_transaction(
	_hash text,
	_statusID integer,
    _typeID integer,
    _contractID uuid,
	_timestamp bigint)
    RETURNS tb_blockchain_transactions
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

DECLARE 
tb_blockchain_transactions public.tb_blockchain_transactions;
BEGIN
INSERT INTO public.tb_blockchain_transactions(
        hash, 
        "statusID", 
        "typeID",
        "contractID",
        timestamp)
	VALUES (
        _hash, 
        _statusID, 
        _typeID,
        _contractID,
        _timestamp) 
    RETURNING * INTO tb_blockchain_transactions;
RETURN tb_blockchain_transactions;
END

$BODY$;

ALTER FUNCTION public.fc_create_transaction(text, integer, integer, uuid, bigint)
    OWNER TO local_user;
