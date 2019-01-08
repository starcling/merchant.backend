-- FUNCTION: public.fc_get_transactionhistory()

-- DROP FUNCTION public.fc_get_transactionhistory();

CREATE OR REPLACE FUNCTION public.fc_get_transactionhistory()
    RETURNS TABLE (
        pullPaymentModelID uuid,
        hash text,
        title character varying (255),        
        
    )
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$

BEGIN

    RETURN 
    QUERY (
select pmt."pullPaymentModelID",
  bct.hash,
  pms.title from public.tb_payments as pmt,public.tb_blockchain_transactions as bct,
public.tb_payment_models as pms
WHERE  pmt."id" = bct."paymentID" and
                    pms."id"=pmt."pullPaymentModelID" and
                    bct."typeID" IN(2,3);
);


END

$BODY$;

ALTER FUNCTION public.fc_get_transactionhistory()
    OWNER TO local_user;
